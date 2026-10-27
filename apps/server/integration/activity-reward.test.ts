import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { user_military_rank } from "@opencok/drizzle/schema/opencok_kingdom/user_military_rank";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { createAlliancePublicationReader } from "@opencok/repositories/alliance-publication";
import { publishAllianceMutation } from "@opencok/services/alliance-publication";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { expect, test } from "bun:test";
import { and, eq } from "drizzle-orm";
import { activityRewardDomain } from "@opencok/services/activity-reward";
import { user_activity } from "@opencok/drizzle/schema/opencok_kingdom/user_activity";
import { server_push } from "@opencok/drizzle/schema/opencok_kingdom/server_push";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { sfs, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture(reward: string, version = "") {
  const h = await cityHarness([activityRewardDomain]);
  h.rules.advanced.campaignRules = [
    {
      id: "synthetic-activity-items",
      state: 2,
      openType: 2,
      events: [{ code: 40, parameters: "200001" }],
      conditions: [],
      actions: [{ code: 9, parameters: "P$long_activity_grants;+;$key_itemNum" }],
    },
  ];
  h.rules.advanced.campaignVariables!.set("P$long_activity_grants", {
    scope: "P",
    id: "long_activity_grants",
    initialValue: 0,
  });

  await h.db.db
    .update(userprofile)
    .set({ appVersion: "12.06.0" })
    .where(eq(userprofile.uid, "owner"));
  await h.db.db
    .insert(user_activity)
    .values({ uid: "owner", actId: "earned", type: 1, status: 0, time: BigInt(h.clock.now) });
  await h.db.db.insert(server_push).values({
    uid: "earned",
    reward: Buffer.from(javaMailBytes(reward)!),
    updateVersion: version,
    startTime: 1n,
    endTime: 2n,
    state: 2,
  });
  const claim = (operationId: string, owner = "owner", actId = "earned") =>
    h.command(
      "activity.accept.reward",
      { actId: sfs.string(actId), operationId: sfs.string(operationId) },
      owner,
    );
  const entitlement = async () =>
    (
      await h.db.db
        .select()
        .from(user_activity)
        .where(and(eq(user_activity.uid, "owner"), eq(user_activity.actId, "earned")))
    )[0]!;
  return { ...h, claim, entitlement };
}
test("earned activity rewards atomically grant owned assets and equipment once across replay and fresh requests", async () => {
  const h = await fixture(
    "gold,0,5|wood,0,7|money,0,11|crystal,0,3|sandstone,0,13|goods,200001,2|equip,1001010,1|exp,0,1",
  );
  try {
    const beforeProfile = (
      await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
    )[0]!;
    const replay = await Promise.all(Array.from({ length: 4 }, () => h.claim("original")));
    expect(
      replay.every(
        (result) =>
          JSON.stringify(result.body, (_, value) =>
            typeof value === "bigint" ? String(value) : value,
          ) ===
          JSON.stringify(replay[0]!.body, (_, value) =>
            typeof value === "bigint" ? String(value) : value,
          ),
      ),
    ).toBe(true);
    const body = replay[0]!.body;
    expect(body.gold).toEqual(sfs.long(beforeProfile.gold! + 5n));
    expect(body.money).toEqual(sfs.long(1000011n));
    expect(body.crystal).toEqual(sfs.long(3n));
    expect(body.sand_stone).toEqual(sfs.long(13n));
    expect(body.expDelta).toEqual(sfs.int(1));
    expect(body.goods!.value as Value[]).toHaveLength(1);
    expect(body.equip!.value as Value[]).toHaveLength(1);
    expect((await h.entitlement()).status).toBe(1);
    expect(
      (
        await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, "long_activity_grants"))
      )[0]!.value,
    ).toBe("2");
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.wood,
    ).toBe(1000007n);
    expect(await h.db.db.select().from(user_equip).where(eq(user_equip.uid, "owner"))).toHaveLength(
      1,
    );
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"))).find(
        (row) => row.itemId === "200001",
      )!.count,
    ).toBe(2);
    await expect(h.claim("fresh")).rejects.toThrow();
    expect(
      await h.db.db.select().from(command_receipt).where(eq(command_receipt.ownerUid, "owner")),
    ).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("distinct concurrent activity claims consume one entitlement and preserve foreign and missing rows", async () => {
  const h = await fixture("gold,0,5");
  try {
    await expect(h.claim("foreign", "other")).rejects.toThrow();
    await expect(h.claim("absent", "owner", "absent")).rejects.toThrow();
    const results = await Promise.allSettled(
      Array.from({ length: 4 }, (_, index) => h.claim(`claim-${index}`)),
    );
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect((await h.entitlement()).status).toBe(1);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100005n);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(1);
    await h.db.db.update(user_activity).set({ status: 0 }).where(eq(user_activity.uid, "owner"));
    await h.db.db.update(userprofile).set({ serverId: 2 }).where(eq(userprofile.uid, "owner"));
    await expect(h.claim("foreign-realm")).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ serverId: 1, banFlag: 1 })
      .where(eq(userprofile.uid, "owner"));
    await expect(h.claim("banned")).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ banFlag: 0, banTime: BigInt(h.clock.now + 1) })
      .where(eq(userprofile.uid, "owner"));
    await expect(h.claim("ban-time")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);
test("activity version comparison preserves concatenated source numbers and missing metadata never consumes entitlement", async () => {
  const h = await fixture("gold,0,5", "12.9.0");
  try {
    await h.claim("source-version");
    expect((await h.entitlement()).status).toBe(1);
    await h.db.db.update(user_activity).set({ status: 0 }).where(eq(user_activity.uid, "owner"));
    await h.db.db
      .update(server_push)
      .set({ updateVersion: "99.99.9" })
      .where(eq(server_push.uid, "earned"));
    await expect(h.claim("upgrade-required")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    await h.db.db.delete(server_push).where(eq(server_push.uid, "earned"));
    await expect(h.claim("missing-push")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);
test("unsupported reward types and receipt failure roll back every activity grant and keep the entitlement claimable", async () => {
  const h = await fixture("gold,0,5|unknown_resource,0,3");
  try {
    await expect(h.claim("unsupported")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100000n);
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
    await h.db.db
      .update(server_push)
      .set({ reward: Buffer.from(javaMailBytes("gold,0,5|silver,0,3")!) })
      .where(eq(server_push.uid, "earned"));
    await expect(h.claim("unsupported-silver-alias")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100000n);
    await h.db.db
      .update(server_push)
      .set({ reward: Buffer.from(javaMailBytes("gold,0,5|goods,200001,2")!) })
      .where(eq(server_push.uid, "earned"));
    await h.db.pool.query(
      "CREATE FUNCTION reject_activity_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt interruption'; END $$",
    );
    await h.db.pool.query(
      "CREATE TRIGGER reject_activity_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION reject_activity_receipt()",
    );
    await expect(h.claim("recoverable")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100000n);
    expect(
      await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner")),
    ).toHaveLength(0);
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
    await h.db.pool.query(
      "DROP TRIGGER reject_activity_receipt ON opencok_kingdom.command_receipt",
    );
    await h.claim("recoverable");
    expect((await h.entitlement()).status).toBe(1);
    expect(
      (
        await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, "long_activity_grants"))
      )[0]!.value,
    ).toBe("2");
  } finally {
    await h.close();
  }
}, 120000);

test("legacy general rewards retain source ownership, count, defense slots and level-up ordering with quest power", async () => {
  for (const order of ["general-first", "exp-first", "no-level-up"] as const) {
    const h = await fixture("gold,0,1");
    try {
      const general = [...h.rules.power.generals!.values()][0]!;
      const threshold = Number(h.rules.role(1).player_exp);
      const raw =
        order === "general-first"
          ? `general,${general.id},4|power,0,23|exp,0,${threshold}`
          : order === "exp-first"
            ? `exp,0,${threshold}|general,${general.id},4|power,0,23`
            : `general,${general.id},4|exp,0,1|power,0,23`;
      if (order === "no-level-up")
        await h.db.db.update(userprofile).set({ level: 5 }).where(eq(userprofile.uid, "owner"));
      await h.db.db
        .update(server_push)
        .set({ reward: Buffer.from(javaMailBytes(raw)!) })
        .where(eq(server_push.uid, "earned"));
      const before = (
        await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner"))
      )[0]!;
      const result = await h.claim(order);
      const owned = await h.db.db.select().from(user_general).where(eq(user_general.uid, "owner"));
      expect(owned).toHaveLength(4);
      expect(owned.every((row) => row.level === (order === "general-first" ? 2 : 1))).toBe(true);
      expect(owned.filter((row) => row.status === 1)).toHaveLength(3);
      expect(owned.filter((row) => row.status === 0)).toHaveLength(1);
      expect(result.body.general!.value as Value[]).toHaveLength(4);
      expect(result.body.power).toEqual(sfs.int(23));
      const after = (
        await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner"))
      )[0]!;
      expect(after.questPower).toBe(23);
      const rolePower =
        order === "no-level-up"
          ? 0n
          : BigInt(Number(h.rules.role(2).power) - Number(h.rules.role(1).power));
      expect(after.power! - before.power!).toBe(
        rolePower +
          23n +
          BigInt(Number(general.power)) * 4n * BigInt(order === "general-first" ? 2 : 1),
      );
      await h.db.db
        .insert(user_activity)
        .values({ uid: "owner", actId: "repeat-general", status: 0 });
      await h.db.db.insert(server_push).values({
        uid: "repeat-general",
        reward: Buffer.from(javaMailBytes(`general,${general.id},2|gold,0,3`)!),
      });
      const duplicate = await h.claim(`${order}-owned`, "owner", "repeat-general");
      expect(duplicate.body.general).toBeUndefined();
      expect(
        await h.db.db.select().from(user_general).where(eq(user_general.uid, "owner")),
      ).toHaveLength(4);
    } finally {
      await h.close();
    }
  }
}, 120000);

test("activity alliance rewards serialize the shared pool, audit both contribution counters and notify only current peers", async () => {
  const h = await fixture("honor,0,3|alliance_point,0,7");
  try {
    await h.db.db
      .insert(alliance)
      .values({ uid: "guild", createtime: 1n, bannerStyle: "", alliancepoint: 100n });
    for (const uid of ["owner", "other"]) {
      await h.db.db
        .update(userprofile)
        .set({ allianceId: "guild" })
        .where(eq(userprofile.uid, uid));
      await h.db.db
        .insert(alliance_member)
        .values({ uid, allianceId: "guild", rank: 2, point: 10, accPoint: 20 });
    }
    await h.db.db.insert(user_activity).values({ uid: "other", actId: "earned", status: 0 });
    const results = await Promise.all([h.claim("first"), h.claim("second", "other")]);
    expect(results.map((result) => result.body.honor!.value)).toEqual([23, 23]);
    expect(results.map((result) => result.body.alliancepoint!.value).sort()).toEqual([107n, 114n]);
    const members = await h.db.db.select().from(alliance_member);
    expect(members.every((member) => member.point === 13 && member.accPoint === 23)).toBe(true);
    expect(
      (await h.db.db.select().from(alliance).where(eq(alliance.uid, "guild")))[0]!.alliancepoint,
    ).toBe(114n);
    const postings = await h.db.db.select().from(economy_posting);
    expect(postings).toHaveLength(6);
    expect(postings.every((posting) => posting.after - posting.before === posting.delta)).toBe(
      true,
    );
    const messages = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "alliance.changed"));
    expect(messages).toHaveLength(2);
    const deliveries: { uid: string; command: string; value: unknown }[] = [];
    await publishAllianceMutation(
      createAlliancePublicationReader(h.db.db, h.authority),
      messages.find((message) => message.ownerUid === "owner")!.payload,
      async (uid, command, body) => {
        deliveries.push({ uid, command, value: body.alliancePoint });
      },
      h.rules,
    );
    expect(deliveries).toEqual([{ uid: "other", command: "al.point.push", value: sfs.long(114n) }]);
    await h.db.db.delete(alliance_member).where(eq(alliance_member.uid, "other"));
    deliveries.length = 0;
    await publishAllianceMutation(
      createAlliancePublicationReader(h.db.db, h.authority),
      messages.find((message) => message.ownerUid === "owner")!.payload,
      async (uid, command, body) => {
        deliveries.push({ uid, command, value: body.alliancePoint });
      },
      h.rules,
    );
    expect(deliveries).toEqual([]);
  } finally {
    await h.close();
  }
}, 120000);

test("closed military rewards follow the source skip while an enabled unvalidated rank engine preserves the entire entitlement", async () => {
  const h = await fixture("gold,0,5|military,0,3|milhonor,0,7");
  try {
    const gate = { id: "wr_switch", version: "1.0.0", online: "close", test: "close" };
    h.rules.features.set("wr_switch", gate);
    const closed = await h.claim("closed-rank");
    expect(closed.body.gold).toEqual(sfs.long(100005n));
    expect(closed.body.military).toBeUndefined();
    expect(closed.body.milhonor).toBeUndefined();
    expect((await h.entitlement()).status).toBe(1);
    await h.db.db.update(user_activity).set({ status: 0 }).where(eq(user_activity.uid, "owner"));
    h.rules.features.set("wr_switch", { ...gate, online: "all" });
    await expect(h.claim("unvalidated-rank")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100005n);
  } finally {
    await h.close();
  }
}, 120000);

test("a failed receipt rolls back alliance contribution, pool, canonical journal and native notification together", async () => {
  const h = await fixture("honor,0,3|alliance_point,0,7|gold,0,5");
  try {
    await h.db.db
      .insert(alliance)
      .values({ uid: "guild", createtime: 1n, bannerStyle: "", alliancepoint: 100n });
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "guild" })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(alliance_member)
      .values({ uid: "owner", allianceId: "guild", rank: 2, point: 10, accPoint: 20 });
    await h.db.pool.query(
      "CREATE FUNCTION reject_alliance_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic alliance receipt interruption'; END $$",
    );
    await h.db.pool.query(
      "CREATE TRIGGER reject_alliance_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION reject_alliance_receipt()",
    );
    await expect(h.claim("clan-recovery")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    expect((await h.db.db.select().from(alliance_member))[0]).toMatchObject({
      point: 10,
      accPoint: 20,
    });
    expect((await h.db.db.select().from(alliance))[0]!.alliancepoint).toBe(100n);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100000n);
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.db.pool.query(
      "DROP TRIGGER reject_alliance_receipt ON opencok_kingdom.command_receipt",
    );
    await h.claim("clan-recovery");
    expect((await h.entitlement()).status).toBe(1);
    expect((await h.db.db.select().from(alliance_member))[0]).toMatchObject({
      point: 13,
      accPoint: 23,
    });
    expect((await h.db.db.select().from(alliance))[0]!.alliancepoint).toBe(107n);
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(4);
  } finally {
    await h.close();
  }
}, 120000);

test("ordered repeated XP and general blocks grant one owned general and account consecutive level power exactly", async () => {
  const h = await fixture("gold,0,1");
  try {
    const [existingEntry, addedEntry] = [...h.rules.power.generals!.entries()];
    const [existingId, existing] = existingEntry!,
      [addedId, added] = addedEntry!;
    const first = Number(h.rules.role(1).player_exp),
      second = Number(h.rules.role(2).player_exp);
    await h.db.db.insert(user_general).values({
      uid: "owner",
      uuid: "existing",
      generalId: existingId,
      level: 1,
      color: Number(existing.color),
      status: 1,
    });
    const [initial] = await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner"));
    const before = initial!.power! + BigInt(Number(existing.power));
    await h.db.db.update(playerinfo).set({ power: before }).where(eq(playerinfo.uid, "owner"));
    await h.db.db
      .update(server_push)
      .set({
        reward: Buffer.from(
          javaMailBytes(
            `general,${addedId},1|exp,0,${first}|general,${addedId},1|exp,0,${second}`,
          )!,
        ),
      })
      .where(eq(server_push.uid, "earned"));
    const result = await h.claim("ordered-source");
    expect(result.body.general!.value as Value[]).toHaveLength(1);
    expect(result.body.expDelta).toEqual(sfs.int(second));
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0],
    ).toMatchObject({ level: 3, exp: 0 });
    const generals = await h.db.db.select().from(user_general).where(eq(user_general.uid, "owner"));
    expect(generals).toHaveLength(2);
    expect(generals.every((general) => general.level === 3)).toBe(true);
    const after = (await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner")))[0]!
      .power!;
    expect(after - before).toBe(
      BigInt(Number(h.rules.role(3).power) - Number(h.rules.role(1).power)) +
        BigInt(Number(existing.power)) * 2n +
        BigInt(Number(added.power)) * 3n,
    );
  } finally {
    await h.close();
  }
}, 120000);

test("real XP effect80 applies per ordered grant and caps at the factual maximum without changing requested expDelta", async () => {
  const h = await fixture("exp,0,1|exp,0,1");
  try {
    h.effects.world = async () => new Map([[80, 50]]);
    await h.db.db.update(userprofile).set({ exp: 1 }).where(eq(userprofile.uid, "owner"));
    const reply = await h.claim("bonus-xp");
    expect(reply.body.exp).toEqual(sfs.int(3));
    expect(reply.body.expDelta).toEqual(sfs.int(1));
    const threshold = Number(h.rules.role(1).player_exp);
    h.rules.items.set("player_max", { ...h.rules.items.get("player_max")!, k1: "1" });
    await h.db.db.insert(user_activity).values({ uid: "owner", actId: "cap", status: 0 });
    await h.db.db
      .insert(server_push)
      .values({ uid: "cap", reward: Buffer.from(javaMailBytes(`exp,0,${threshold}|exp,0,1`)!) });
    const capped = await h.claim("cap-xp", "owner", "cap");
    expect(capped.body.exp).toEqual(sfs.int(threshold));
    expect(capped.body.expDelta).toEqual(sfs.int(1));
    await h.db.db
      .update(userprofile)
      .set({ exp: threshold + 7 })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(user_activity).values({ uid: "owner", actId: "imported-cap", status: 0 });
    await h.db.db
      .insert(server_push)
      .values({ uid: "imported-cap", reward: Buffer.from(javaMailBytes("exp,0,1")!) });
    expect((await h.claim("imported-cap-xp", "owner", "imported-cap")).body.exp).toEqual(
      sfs.int(threshold + 7),
    );
  } finally {
    await h.close();
  }
}, 120000);

test("native mixed military awards retain requested amounts, actual weekly cap, all journals and one atomic receipt", async () => {
  const h = await fixture(
    "gold,0,5|honor,0,3|alliance_point,0,7|military,0,3|milhonor,0,7|goods,200001,2",
  );
  try {
    h.rules.features.set("wr_switch", {
      id: "wr_switch",
      version: "1.0.0",
      online: "all",
      test: "all",
    });
    await h.db.db.insert(server_info).values({ uid: "server", lastClearMilitaryMailSendTime: 1n });
    await h.db.db.insert(user_military_rank).values({
      uid: "owner",
      rankingExp: 0,
      militaryRank: 20018001,
      militaryScore: 1.25,
      honor: 100,
      maxHonorWeekly: 24999.5,
    });
    await h.db.db
      .insert(alliance)
      .values({ uid: "guild", createtime: 1n, bannerStyle: "", alliancepoint: 100n });
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "guild" })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(alliance_member)
      .values({ uid: "owner", allianceId: "guild", rank: 2, point: 10, accPoint: 20 });
    await h.db.pool.query(
      "CREATE FUNCTION reject_mixed_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic mixed receipt interruption'; END $$",
    );
    await h.db.pool.query(
      "CREATE TRIGGER reject_mixed_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION reject_mixed_receipt()",
    );
    await expect(h.claim("mixed-recovery")).rejects.toThrow();
    expect((await h.entitlement()).status).toBe(0);
    expect((await h.db.db.select().from(user_military_rank))[0]).toMatchObject({
      militaryScore: 1.25,
      honor: 100,
      maxHonorWeekly: 24999.5,
    });
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
    await h.db.pool.query("DROP TRIGGER reject_mixed_receipt ON opencok_kingdom.command_receipt");
    const result = await h.claim("mixed-recovery");
    expect(result.body.military).toEqual(sfs.int(3));
    expect(result.body.milhonor).toEqual(sfs.int(7));
    expect((await h.db.db.select().from(user_military_rank))[0]).toMatchObject({
      militaryScore: 4.25,
      honor: 100.5,
      maxHonorWeekly: 25000,
      militaryRank: 20018001,
    });
    const postings = await h.db.db.select().from(economy_posting);
    expect(
      postings.filter((posting) => posting.requestId === "activity-military:earned"),
    ).toHaveLength(3);
    expect(
      postings.filter((posting) => posting.requestId === "activity-reward:earned"),
    ).toHaveLength(3);
    expect(postings.every((posting) => posting.after - posting.before === posting.delta)).toBe(
      true,
    );
    await h.claim("mixed-recovery");
    expect(await h.db.db.select().from(economy_posting)).toEqual(postings);
    await h.db.db.update(user_activity).set({ status: 0 }).where(eq(user_activity.uid, "owner"));
    await expect(h.claim("manual-reopen")).rejects.toThrow();
    expect(await h.db.db.select().from(economy_posting)).toEqual(postings);
    expect((await h.db.db.select().from(user_military_rank))[0]!.honor).toBe(100.5);
  } finally {
    await h.close();
  }
}, 120000);
