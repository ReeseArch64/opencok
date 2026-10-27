import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, and, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { loadRules } from "@opencok/resources/rules";
import { sfs, encode, type Fields } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

test("mail claims commit once across overlap, new request IDs, lost replies, rollback, deletion and restart", async () => {
  const pg = new DisposablePostgres();
  const databases: ReturnType<typeof createDatabase<"kingdom">>[] = [];
  try {
    const admin = await pg.start();
    await admin.query('CREATE DATABASE "mail_claims"');
    await admin.end();
    const open = () => {
      const database = createDatabase("kingdom", {
        ...pg.options,
        database: "mail_claims",
        max: 8,
      });
      databases.push(database);
      return database;
    };
    const first = open();
    await migrate(first.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    for (const uid of ["mail-owner", "mail-other"]) {
      await first.db
        .insert(userprofile)
        .values({ uid, name: uid, country: "BR", serverId: 1, exp: 0, level: 1, gold: 100n });
      await first.db.insert(user_resource).values({
        uid,
        wood: 10n,
        stone: 20n,
        iron: 30n,
        food: 40n,
        silver: 0,
        chip: 0,
        diamond: 0,
        dragon_food: 0,
        dragon_gold: 0,
        lastUpdateTime: 0n,
      });
    }
    const rules = await loadRules();
    let ready = true;
    const authority = await acquireRealmAuthority(first.db, 1, () => ready);
    const executor = createMailRewardExecutor(first.db, authority);
    const service = new MailRewardService(executor, rules);
    const send = async (
      uid: string,
      rewardId: string,
      type = 2,
      toUser = "mail-owner",
      rewardStatus = 0,
      fromUser = "system",
    ) =>
      first.db.insert(mail).values({
        uid,
        toUser,
        fromUser,
        contents: Buffer.from("synthetic"),
        rewardId,
        type,
        rewardStatus,
        createTime: 1000n,
      });
    const claim = (uid: string, params: Fields = {}) =>
      service.command("mail-owner", "mail.reward", { uid: sfs.string(uid), ...params });
    const batch = (uids: string, params: Fields = {}) =>
      service.command("mail-owner", "mail.reward.batch", { uids: sfs.string(uids), ...params });
    const balance = async () =>
      (await first.db.select().from(userprofile).where(eq(userprofile.uid, "mail-owner")))[0]!;
    const state = async (uid: string) =>
      (await first.db.select().from(mail).where(eq(mail.uid, uid)))[0]!;
    await send("single", "goods,200300,2|gold,0,7|wood,0,3|money,0,4|crystal,0,6");
    const replies = await Promise.all(Array.from({ length: 8 }, () => claim("single")));
    expect(replies.every((reply) => reply.body.gold!.value === 107n)).toBe(true);
    expect((await balance()).gold).toBe(107n);
    expect((await balance()).crystal).toBe(6n);
    expect((await state("single")).rewardStatus).toBe(1);
    expect((await state("single")).status).toBe(1);
    expect((await first.db.select().from(user_item))[0]?.count).toBe(2);
    expect(
      (await first.db.select().from(user_resource).where(eq(user_resource.uid, "mail-owner")))[0]
        ?.wood,
    ).toBe(13n);
    expect(await first.db.select().from(mail_update)).toHaveLength(1);
    expect(
      (await first.db.select().from(command_receipt)).filter(
        (row) => row.requestId === "mail-claim:single",
      ),
    ).toHaveLength(1);
    expect(await first.db.select().from(economy_posting)).toHaveLength(5);
    expect(
      (await first.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "mail.reward.claimed",
      ),
    ).toHaveLength(1);
    await send("foreign", "gold,0,500", 2, "mail-other");
    await expect(claim("foreign")).rejects.toThrow();
    await send("old-claimed", "gold,0,500", 2, "mail-owner", 1);
    await expect(claim("old-claimed")).rejects.toThrow("E100147");
    await send("overlap-a", "gold,0,5|goods,200300,1");
    await send("overlap-b", "gold,0,8|goods,200300,2");
    await send("overlap-c", "gold,0,13|goods,200300,3");
    await Promise.all([
      batch("overlap-a,overlap-b,overlap-a"),
      batch("overlap-b,overlap-c"),
      claim("overlap-b"),
    ]);
    expect((await balance()).gold).toBe(133n);
    expect((await first.db.select().from(user_item))[0]?.count).toBe(8);
    await send("rollback-a", "gold,0,50|goods,200300,3");
    await send("rollback-b", "equip,1000001,1");
    await expect(batch("rollback-a,rollback-b")).rejects.toThrow();
    expect((await balance()).gold).toBe(133n);
    expect((await state("rollback-a")).rewardStatus).toBe(0);
    expect((await state("rollback-b")).rewardStatus).toBe(0);
    expect(
      await first.db
        .select()
        .from(command_receipt)
        .where(eq(command_receipt.requestId, "mail-claim:rollback-a")),
    ).toHaveLength(0);
    expect(
      await first.db
        .select()
        .from(economy_posting)
        .where(eq(economy_posting.requestId, "mail-claim:rollback-a")),
    ).toHaveLength(0);
    expect(
      await first.db.select().from(mail_update).where(eq(mail_update.mailUid, "rollback-a")),
    ).toHaveLength(0);
    await send("failure", "goods,200300,2|gold,0,9");
    await first.db.execute(
      sql`CREATE FUNCTION reject_mail_claim() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN IF NEW.uid = ''failure'' THEN RAISE EXCEPTION ''synthetic marker failure''; END IF; RETURN NEW; END'`,
    );
    await first.db.execute(
      sql`CREATE TRIGGER reject_mail_claim BEFORE UPDATE ON opencok_kingdom.mail FOR EACH ROW EXECUTE FUNCTION reject_mail_claim()`,
    );
    await expect(claim("failure")).rejects.toThrow();
    expect((await balance()).gold).toBe(133n);
    expect((await first.db.select().from(user_item))[0]?.count).toBe(8);
    await first.db.execute(sql`DROP TRIGGER reject_mail_claim ON opencok_kingdom.mail`);
    await send("lost", "gold,0,11");
    let loseReply = true;
    const unreliable = new MailRewardService(async (...args) => {
      const response = await executor(...args);
      if (loseReply) {
        loseReply = false;
        throw new Error("Synthetic lost reply after commit");
      }
      return response;
    }, rules);
    const operationId = randomUUID();
    await expect(
      unreliable.command("mail-owner", "mail.reward", {
        uid: sfs.string("lost"),
        operationId: sfs.string(operationId),
      }),
    ).rejects.toThrow("lost reply");
    const recovered = await claim("lost", { operationId: sfs.string(operationId) });
    expect(recovered.body.gold).toEqual(sfs.long(144));
    expect((await balance()).gold).toBe(144n);
    await expect(claim("single", { operationId: sfs.string(operationId) })).rejects.toThrow(
      "conflict",
    );
    await first.db.delete(mail).where(eq(mail.uid, "lost"));
    expect((await claim("lost")).body.gold).toEqual(sfs.long(144));
    await send("lost", "gold,0,999");
    expect((await claim("lost")).body.gold).toEqual(sfs.long(144));
    expect((await balance()).gold).toBe(144n);
    for (const [id, type] of [
      ["label-notice", 14],
      ["label-system", 2],
      ["label-fight", 7],
    ] as const)
      {await send(id, "gold,0,1", type);}
    const notice = await batch("label-notice", { types: sfs.string("1,1") });
    expect(notice.body.successUids).toEqual(sfs.string("label-notice"));
    expect((await state("label-system")).rewardStatus).toBe(0);
    expect((await state("label-fight")).rewardStatus).toBe(0);
    await send("future", "gold,0,5", 16, "mail-owner", 0, "99.0.0");
    await expect(claim("future")).rejects.toThrow();
    expect((await batch("future")).body.successUids).toEqual(sfs.string(""));
    await send("bad", "gold,0,-1");
    await expect(claim("bad")).rejects.toThrow();
    expect((await state("bad")).rewardStatus).toBe(0);
    await expect(batch("single", { types: sfs.string("invalid") })).rejects.toThrow();
    await expect(
      new MailRewardService(
        createMailRewardExecutor(first.db, authority, Date.now, async () => false),
        rules,
      ).command("mail-owner", "mail.reward", { uid: sfs.string("single") }),
    ).rejects.toThrow();
    await first.db
      .update(userprofile)
      .set({ gold: 9223372036854775807n })
      .where(eq(userprofile.uid, "mail-owner"));
    await expect(claim("label-system")).rejects.toThrow();
    expect((await state("label-system")).rewardStatus).toBe(0);
    await first.db.update(userprofile).set({ gold: 145n }).where(eq(userprofile.uid, "mail-owner"));
    await send(
      "resource-kinds",
      "stone,0,2|iron,0,3|food,0,4|chip,0,5|diamond,0,6|sandstone,0,7|diamondstone,0,8|marble,0,9|granite,0,10|limestone,0,11",
    );
    const resourceKinds = await claim("resource-kinds");
    for (const [key, value] of [
      ["stone", 22],
      ["iron", 33],
      ["food", 44],
      ["chip", 5],
      ["diamond", 6],
      ["sand_stone", 7],
      ["diamond_stone", 8],
      ["marble", 9],
      ["granite", 10],
      ["limestone", 11],
    ] as const)
      {expect(resourceKinds.body[key]).toEqual(sfs.long(value));}
    expect(resourceKinds.body.stone_bind).toEqual(sfs.long(0));
    await first.db
      .update(userprofile)
      .set({ pf: "dmm", dmmGold: 3n, dmmPaidSpecialGold: 5n, dmmPaidGold: 10n })
      .where(eq(userprofile.uid, "mail-owner"));
    await send("dmm", "gold,0,7");
    expect((await claim("dmm")).body.gold).toEqual(sfs.long(25));
    expect((await balance()).gold).toBe(145n);
    expect((await balance()).dmmGold).toBe(10n);
    const receipt = await claim("single", { operationId: sfs.string(randomUUID()) });
    await pg.restart();
    const second = open();
    const restarted = new MailRewardService(createMailRewardExecutor(second.db, authority), rules);
    expect(
      encode(
        (
          await restarted.command("mail-owner", "mail.reward", {
            uid: sfs.string("single"),
            operationId: receipt.body.operationId!,
          })
        ).body,
      ),
    ).toEqual(encode(receipt.body));
    ready = false;
    await expect(
      restarted.command("mail-owner", "mail.reward", { uid: sfs.string("single") }),
    ).rejects.toThrow();
    ready = true;
    await acquireRealmAuthority(second.db, 1, () => true);
    await expect(
      restarted.command("mail-owner", "mail.reward", { uid: sfs.string("single") }),
    ).rejects.toThrow();
    expect(
      (await second.db.select().from(userprofile).where(eq(userprofile.uid, "mail-owner")))[0]
        ?.gold,
    ).toBe(145n);
    expect((await second.db.select().from(user_item))[0]?.count).toBe(8);
    expect(
      await second.db
        .select()
        .from(command_receipt)
        .where(
          and(
            eq(command_receipt.ownerUid, "mail-other"),
            eq(command_receipt.requestId, "mail-claim:foreign"),
          ),
        ),
    ).toHaveLength(0);
  } finally {
    for (const database of databases) {await database.close();}
    await pg.stop();
  }
}, 120000);
