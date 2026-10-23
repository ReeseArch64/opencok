import { afterAll, beforeAll, expect, test } from "bun:test";
import { transferLegacy } from "../scripts/postgresql/transfer";
import { manifest } from "../src/postgresql/manifest";
import { TransferError } from "../src/postgresql/transfer-values";
import { MigrationFixture } from "./support/pg-migration-fixture";

const fixture = new MigrationFixture();
beforeAll(async () => { await fixture.start(); }, 180_000);
afterAll(async () => { await fixture.stop(); }, 30_000);

test("table-atomic transfer resumes after interruption and reconciles every field and keyless duplicate", async () => {
  let completed = 0;
  await expect(transferLegacy(fixture.source, fixture.targets, { restoredSource: true, batchSize: 1, onTable: () => {
    completed++; if (completed === 3) throw new TransferError("synthetic-interruption");
  } })).rejects.toThrow("synthetic-interruption");
  expect((await fixture.targets.realm.query("SELECT count(*)::integer AS n FROM legacy_meta.transfer_tables")).rows[0].n).toBe(3);
  await expect(transferLegacy(fixture.source, fixture.targets, { restoredSource: true })).rejects.toThrow("resume-required");
  const receipts = await transferLegacy(fixture.source, fixture.targets, { restoredSource: true, resume: true, batchSize: 1 });
  expect(receipts).toHaveLength(772);
  expect(receipts.filter((receipt) => receipt.status === "verified")).toHaveLength(3);
  const noPrimary = new Set(manifest.tables.filter((table) => !table.indexes.some((index) => index.kind === "primary")).map((table) => table.id));
  expect(noPrimary.size).toBe(34);
  const duplicateAllowed = new Set(manifest.tables.filter((table) => !table.indexes.some((index) => index.kind !== "index")).map((table) => table.id));
  for (const receipt of receipts) expect(receipt.rows).toBe(duplicateAllowed.has(receipt.table) ? "3" : "2");
  expect(await transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true })).toHaveLength(772);
}, 180_000);

test("explicit imported IDs advance signed and full-uint64 generators", async () => {
  for (const role of ["global", "realm"] as const) {
    for (const table of manifest.tables.filter((table) => table.role === role)) {
      const auto = table.columns.find((column) => column.autoIncrement);
      if (!auto) continue;
      const name = `"${table.namespace}"."${table.name}"`;
      const client = await fixture.targets[role].connect();
      try {
        const maximum = BigInt((await client.query(`SELECT max("${auto.name}")::text AS value FROM ${name}`)).rows[0].value);
        let next: bigint;
        if (auto.sourceType === "bigint unsigned") next = BigInt((await client.query("SELECT legacy_meta.next_unsigned($1)::text AS value", [table.id])).rows[0].value);
        else {
          const sequence = (await client.query("SELECT pg_get_serial_sequence($1,$2) AS name", [name, auto.name])).rows[0].name;
          next = BigInt((await client.query("SELECT nextval($1::regclass)::text AS value", [sequence])).rows[0].value);
        }
        expect(next).toBeGreaterThan(maximum);
      } finally { client.release(); }
    }
  }
});

test("reconciliation refuses modified data and detects schema drift without revealing values", async () => {
  await fixture.targets.realm.query(`UPDATE cokdb1.ability_page SET page=page+100`);
  await expect(transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true })).rejects.toThrow("row-or-field-reconciliation, cokdb1.ability_page");
  await fixture.targets.realm.query(`UPDATE cokdb1.ability_page SET page=page-100`);
  await fixture.targets.realm.query(`ALTER TABLE cokdb1.ability_page ADD COLUMN synthetic_drift text`);
  await expect(transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true })).rejects.toThrow("preflight-or-run");
  await fixture.targets.realm.query(`ALTER TABLE cokdb1.ability_page DROP COLUMN synthetic_drift`);
  expect(await transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true })).toHaveLength(772);
}, 180_000);

test("NUL text and a proven MariaDB/ICU equality mismatch stop reconciliation without leaking values", async () => {
  await fixture.source.query("UPDATE cokdb1.ability_page SET uid=CONCAT(uid,CHAR(0))");
  try {
    await expect(transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true, batchSize: 1 }))
      .rejects.toThrow("unrepresentable-value, cokdb1.ability_page.uid");
  } finally { await fixture.source.query("UPDATE cokdb1.ability_page SET uid=REPLACE(uid,CHAR(0),'')"); }
  // general_ci treats these as one class; ICU primary treats them as distinct.
  const [source] = await fixture.source.query("SELECT (_utf8's' COLLATE utf8_general_ci = _utf8'ß' COLLATE utf8_general_ci) AS same_class");
  expect((source as { same_class: number }[])[0]!.same_class).toBe(1);
  expect((await fixture.targets.realm.query("SELECT 's' COLLATE legacy_meta.ci = 'ß' COLLATE legacy_meta.ci AS same_class")).rows[0].same_class).toBe(false);
  await fixture.source.query("UPDATE cokdb1.account_lock SET lastLoginIp=CASE WHEN uid LIKE '1%' THEN 's' ELSE 'ß' END");
  try {
    await expect(transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true }))
      .rejects.toThrow("collation-equality-mismatch, cokdb1.account_lock.lastLoginIp");
  } finally { await fixture.source.query("UPDATE cokdb1.account_lock SET lastLoginIp=uid"); }
}, 60_000);

test("both physical databases preserve all reconciled fields after restart and backup/restore", async () => {
  await fixture.admin.end();
  await Promise.all(Object.values(fixture.targets).map((pool) => pool.end()));
  await fixture.postgres.restart();
  fixture.admin = await fixture.postgres.connect();
  fixture.targets = { global: await fixture.postgres.connect("global"), realm: await fixture.postgres.connect("realm") };
  expect(await transferLegacy(fixture.source, fixture.targets, { restoredSource: true, verifyOnly: true })).toHaveLength(772);
  const restored = { global: fixture.targets.global, realm: fixture.targets.realm };
  try {
    for (const role of ["global", "realm"] as const) {
      const archive = await fixture.postgres.docker(["exec", fixture.postgres.name, "pg_dump", "--username=postgres", "--format=custom", role]);
      await fixture.admin.query(`CREATE DATABASE "recovered_${role}"`);
      await fixture.postgres.docker(["exec", "-i", fixture.postgres.name, "pg_restore", "--username=postgres", `--dbname=recovered_${role}`, "--exit-on-error", "--no-owner"], archive);
      restored[role] = await fixture.postgres.connect(`recovered_${role}`);
    }
    expect(await transferLegacy(fixture.source, restored, { restoredSource: true, verifyOnly: true })).toHaveLength(772);
  } finally {
    for (const role of ["global", "realm"] as const) if (restored[role] !== fixture.targets[role]) await restored[role].end();
  }
}, 180_000);
