import type { Connection } from "mysql2/promise";
import type { Pool } from "pg";
import { bootstrap } from "../../scripts/bootstrap";
import { bootstrapPostgres } from "../../scripts/postgresql/bootstrap";
import { createLegacyDatabase } from "../../src/client";
import { catalog, type Contract } from "./contract";
import nativeArtifact from "../fixtures/mariadb-contract.json";
import { DisposableMariaDB } from "./mariadb";
import { DisposablePostgres } from "./postgres";
import { sampleRow } from "./rows";

const native = nativeArtifact as unknown as Contract;
export class MigrationFixture {
  readonly maria = new DisposableMariaDB();
  readonly postgres = new DisposablePostgres();
  source!: Connection;
  admin!: Pool;
  targets!: { global: Pool; realm: Pool };

  async start(seed = true) {
    this.source = await this.maria.start();
    await bootstrap(this.source);
    this.admin = await this.postgres.start();
    for (const name of ["global", "realm"]) await this.admin.query(`CREATE DATABASE "${name}"`);
    this.targets = { global: await this.postgres.connect("global"), realm: await this.postgres.connect("realm") };
    for (const role of ["global", "realm"] as const) {
      const client = await this.targets[role].connect();
      try { await bootstrapPostgres(client, role); } finally { client.release(); }
    }
    if (seed) {
      for (const namespace of ["cokdb1", "cokdb_global", "cokdb_pay", "opencok_chat"] as const) {
        const client = createLegacyDatabase(namespace, this.maria.options);
        try {
          for (const entry of catalog.filter((entry) => entry.database === namespace)) {
            const contract = native.tables[entry.id]!;
            const rows = [sampleRow(contract), sampleRow(contract, 2)];
            if (!contract.indexes.some((index) => index[1])) rows.push(sampleRow(contract));
            await client.db.insert(entry.table).values(rows);
          }
        } finally { await client.close(); }
      }
    }
  }
  async stop() {
    await this.source?.end().catch(() => undefined);
    await Promise.allSettled([this.admin?.end(), ...Object.values(this.targets ?? {}).map((pool) => pool.end())]);
    await Promise.allSettled([this.maria.stop(), this.postgres.stop()]);
  }
}
