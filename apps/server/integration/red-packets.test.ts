import { settleRedPacketExpiry } from "@opencok/services/red-packets";
import { createRedPacketExpiryStore } from "@opencok/repositories/red-packets";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import {
  createRedPacketDomain,
  paidGiftParameters,
  publishRedPacketAnnouncement,
} from "@opencok/services/red-packets";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { createCampaignAudience } from "@opencok/repositories/campaign-notice";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import type { DeliveredGiftProof, PaidGiftGateway } from "@opencok/contracts/paid-gifts";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { red_packets } from "@opencok/drizzle/schema/opencok_kingdom/red_packets";
import { red_packets_records } from "@opencok/drizzle/schema/opencok_kingdom/red_packets_records";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, str, int } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture(enabled = true) {
  const proofs = new Map<string, DeliveredGiftProof>(),
    gateway: PaidGiftGateway = {
      async delivered(input) {
        return proofs.get(input.orderId) ?? null;
      },
    },
    h = await cityHarness([
      anniversaryDomain,
      createRedPacketDomain(enabled ? gateway : undefined),
    ]);
  h.clock.now = Date.UTC(2024, 8, 27, 12);
  await h.db.db.update(user_building).set({ level: 20 }).where(eq(user_building.itemId, 400000));
  const purchase = async (tier = "gold_8", owner = "owner") => {
    const catalog = [...h.rules.advanced.castleExchanges!.values()].find(
      (row) => row.product_id === tier && Number(row.dollar) > 0,
    )!;
    const proof: DeliveredGiftProof = {
      owner,
      kingdomId: 1,
      orderId: randomUUID(),
      platform: "synthetic",
      exchangeId: catalog.id!,
      productId: tier,
      priceCents: Math.round(Number(catalog.dollar) * 100),
      occurredAt: BigInt(h.clock.now),
    };
    proofs.set(proof.orderId, proof);
    await h.db.db.insert(paylog).values({
      uid: owner,
      orderId: proof.orderId,
      pf: proof.platform,
      productId: tier,
      spend: proof.priceCents / 100,
      time: proof.occurredAt,
      status: 2,
      payLevel: 0,
    });
    return proof;
  };
  const paid = (proof: DeliveredGiftProof, owner = proof.owner) =>
    h.command(
      "campaign.paid.gift",
      paidGiftParameters(owner, proof.orderId, proof.platform),
      owner,
    );
  const claim = (uid: string, owner = "other", info = 0, operationId = randomUUID()) =>
    h.command(
      "redPackets.rv",
      {
        uid: sfs.string(uid),
        serverId: sfs.int(1),
        info: sfs.int(info),
        operationId: sfs.string(operationId),
      },
      owner,
    );
  const counter = async (key: string, owner = "other") =>
    (await h.db.db.select().from(trigger_var).where(eq(trigger_var.uid, owner))).find(
      (row) => row.key === key,
    )?.value;
  return {
    ...h,
    proofs,
    purchase,
    paid,
    claim,
    counter,
    packets: () => h.db.db.select().from(red_packets),
  };
}
test("verified delivered native gift tiers create the six maintained funded system pools once", async () => {
  const h = await fixture();
  try {
    for (const [tier, cents, total, people] of [
      ["gold_8", 99, 250, 5],
      ["gold_1", 499, 750, 8],
      ["gold_2", 999, 1500, 10],
      ["gold_3", 1999, 2400, 15],
      ["gold_4", 4999, 6000, 20],
      ["gold_5", 9999, 12000, 30],
    ] as const) {
      const proof = await h.purchase(tier);
      expect(proof.priceCents).toBe(cents);
      const result = await h.paid(proof);
      await h.paid(proof);
      const packet = (await h.packets()).find((row) => row.total === total)!;
      expect(packet).toMatchObject({
        total,
        remain: total,
        totalPeople: people,
        sender: "3000002",
        range: 0,
        rangeId: "1",
        type: 0,
        curPeople: 0,
        endTime: proof.occurredAt + 86400000n,
      });
      expect(result.body.evidence).toBeDefined();
    }
    expect(await h.packets()).toHaveLength(6);
    expect(await h.counter("long_3th_anniversary_redpacket_buy_time_count", "owner")).toBe(
      String(
        h.rules.advanced.campaignVariables!.get(
          "S$long_3th_anniversary_redpacket_buy_time_count_max",
        )!.initialValue,
      ),
    );
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "redPackets.announce",
      ),
    ).toHaveLength(6);
    expect((await h.db.db.select().from(userprofile))[0]?.gold).toBe(100000n);
    expect(
      (await h.db.db.select().from(command_receipt)).filter(
        (row) => row.command === "campaign.paid.gift",
      ),
    ).toHaveLength(6);
  } finally {
    await h.close();
  }
}, 120000);
test("absent proof, mismatched owner realm catalog money time and undelivered receipts cannot create pools", async () => {
  const h = await fixture();
  try {
    const proof = await h.purchase();
    const variants: Partial<DeliveredGiftProof>[] = [
      { owner: "other" },
      { kingdomId: 2 },
      { orderId: "foreign" },
      { platform: "foreign" },
      { exchangeId: "missing" },
      { productId: "gold_5" },
      { priceCents: 100 },
      { occurredAt: proof.occurredAt + 1n },
    ];
    for (const patch of variants) {
      h.proofs.set(proof.orderId, { ...proof, ...patch });
      await expect(h.paid(proof)).rejects.toThrow();
    }
    h.proofs.delete(proof.orderId);
    await expect(h.paid(proof)).rejects.toThrow();
    h.proofs.set(proof.orderId, proof);
    await h.db.db.update(paylog).set({ status: 1 });
    await expect(h.paid(proof)).rejects.toThrow();
    expect(await h.packets()).toHaveLength(0);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
    await h.db.db.update(paylog).set({ status: 2 });
    await h.paid(proof);
    expect(await h.packets()).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("the unconfigured payment producer remains gated and closed campaign windows preserve evidence without issuing gifts", async () => {
  const h = await fixture(false);
  try {
    await expect(h.paid(await h.purchase())).rejects.toThrow();
    expect(await h.packets()).toHaveLength(0);
  } finally {
    await h.close();
  }
  const closed = await fixture();
  try {
    closed.clock.now = Date.UTC(2025, 8, 27);
    await closed.paid(await closed.purchase());
    expect(await closed.packets()).toHaveLength(0);
    expect(
      (await closed.db.db.select().from(command_receipt)).filter(
        (row) => row.command === "campaign.paid.gift",
      ),
    ).toHaveLength(1);
  } finally {
    await closed.close();
  }
}, 120000);
test("funded claims grant real gold and observe source event52 once while previews and duplicate operations retain native shapes", async () => {
  const h = await fixture();
  try {
    await h.paid(await h.purchase());
    const [packet] = await h.packets();
    const uid = packet!.uid;
    const preview = await h.claim(uid, "other", 1);
    expect(preview.body.info?.type).toBe(18);
    expect(int(preview.body, "status")).toBe(1);
    expect(preview.body.add).toBeUndefined();
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(0);
    const operationId = randomUUID(),
      result = await h.claim(uid, "other", 0, operationId),
      add = int(result.body, "add");
    expect(add).toBeGreaterThan(0);
    expect(result.body.gold?.value).toBe(100000n + BigInt(add));
    expect(int(result.body, "recordGold")).toBe(add);
    expect(str(result.body, "key_goldSum")).toBe(uid);
    expect(int(result.body, "status")).toBe(0);
    expect(await h.counter("long_3th_anniversary_redpacket_get_money_count")).toBe("1");
    await h.claim(uid, "other", 0, operationId);
    const repeat = await h.claim(uid);
    expect(repeat.body.add).toBeUndefined();
    expect(int(repeat.body, "recordGold")).toBe(add);
    expect(await h.counter("long_3th_anniversary_redpacket_get_money_count")).toBe("1");
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(1);
    expect((await h.packets())[0]!.remain).toBe(250 - add);
    const received = await h.command("redPackets.rvd.id", {}, "other");
    expect(received.body.records?.value).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("concurrent distinct recipients conserve a finite pool through the final claimant and enforce per-player uniqueness", async () => {
  const h = await fixture();
  try {
    const [profile] = await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "other")),
      [resource] = await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other")),
      [building] = await h.db.db
        .select()
        .from(user_building)
        .where(eq(user_building.uuid, "other-400000"));
    for (const uid of ["third", "fourth", "fifth"]) {
      await h.db.db.insert(userprofile).values({ ...profile!, uid });
      await h.db.db.insert(user_resource).values({ ...resource!, uid });
      await h.db.db.insert(user_building).values({ ...building!, uid, uuid: `${uid}-castle` });
    }
    await h.paid(await h.purchase());
    const uid = (await h.packets())[0]!.uid;
    await Promise.all(
      ["owner", "other", "third", "fourth", "fifth", "other"].map((owner) => h.claim(uid, owner)),
    );
    const [packet] = await h.packets(),
      records = await h.db.db.select().from(red_packets_records);
    expect(packet).toMatchObject({ remain: 0, curPeople: 5, state: 1 });
    expect(records).toHaveLength(5);
    expect(records.reduce((sum, row) => sum + row.value!, 0)).toBe(250);
    expect(
      (await h.db.db.select().from(economy_posting)).reduce(
        (sum, row) => sum + row.after - row.before,
        0n,
      ),
    ).toBe(250n);
    expect((await h.claim(uid, "other")).body.add).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
test("strict expiry, castle threshold, realm and alliance audience checks prevent unfunded or foreign claims", async () => {
  const h = await fixture();
  try {
    await h.paid(await h.purchase());
    const [packet] = await h.packets(),
      uid = packet!.uid;
    await h.db.db
      .update(user_building)
      .set({ level: 9 })
      .where(eq(user_building.uuid, "other-400000"));
    expect(int((await h.claim(uid)).body, "status")).toBe(4);
    await h.db.db
      .update(user_building)
      .set({ level: 20 })
      .where(eq(user_building.uuid, "other-400000"));
    await h.db.db.update(red_packets).set({ range: 1, rangeId: "foreign-alliance" });
    await expect(h.claim(uid)).rejects.toThrow();
    await h.db.db.update(red_packets).set({ range: 0, rangeId: "2" });
    await expect(h.claim(uid)).rejects.toThrow();
    await h.db.db.update(red_packets).set({ rangeId: "1" });
    await h.db.db
      .update(userprofile)
      .set({ crossFightSrcServerId: 2 })
      .where(eq(userprofile.uid, "other"));
    await expect(h.claim(uid)).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ crossFightSrcServerId: 0 })
      .where(eq(userprofile.uid, "other"));
    h.clock.now = Number(packet!.endTime);
    expect(int((await h.claim(uid)).body, "status")).toBe(3);
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(0);
    expect((await h.packets())[0]!.remain).toBe(250);
  } finally {
    await h.close();
  }
}, 120000);
test("receipt failures atomically roll back packet creation, funded claims, score and gold before safe retry", async () => {
  const h = await fixture();
  try {
    await h.db.pool.query(
      `create function reject_packet_receipt() returns trigger language plpgsql as $$ begin raise exception 'synthetic failure'; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_packet_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_packet_receipt()`,
    );
    const proof = await h.purchase();
    await expect(h.paid(proof)).rejects.toThrow();
    expect(await h.packets()).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.db.pool.query(`drop trigger reject_packet_receipt on opencok_kingdom.command_receipt`);
    await h.paid(proof);
    const uid = (await h.packets())[0]!.uid;
    await h.db.pool.query(
      `create trigger reject_packet_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_packet_receipt()`,
    );
    const operationId = randomUUID();
    await expect(h.claim(uid, "other", 0, operationId)).rejects.toThrow();
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(0);
    expect((await h.packets())[0]!.remain).toBe(250);
    expect(
      (await h.db.db.select().from(trigger_var)).filter((row) => row.uid === "other"),
    ).toHaveLength(0);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "other")))[0]!.gold,
    ).toBe(100000n);
    await h.db.pool.query(`drop trigger reject_packet_receipt on opencok_kingdom.command_receipt`);
    await h.claim(uid, "other", 0, operationId);
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("packet announcements retain native post12 and filter audience, expire and reject a stale realm authority", async () => {
  const h = await fixture();
  try {
    await h.paid(await h.purchase());
    const [event] = await h.db.db.select().from(mutation_outbox),
      audience = createCampaignAudience(h.db.db, h.authority),
      sent: string[] = [];
    await h.db.db
      .update(userprofile)
      .set({ crossFightSrcServerId: 2 })
      .where(eq(userprofile.uid, "other"));
    await publishRedPacketAnnouncement(
      event!.payload,
      "owner",
      ["owner", "other"],
      audience,
      async (owner, command, body) => {
        expect(command).toBe("push.chat");
        expect(int(body, "post")).toBe(12);
        expect(str(body, "version")).toBe("2.0.0");
        expect(str(body, "redPackets")).toBe((await h.packets())[0]!.uid);
        sent.push(owner);
      },
      h.clock.now,
    );
    expect(sent).toEqual(["owner"]);
    await publishRedPacketAnnouncement(
      event!.payload,
      "owner",
      ["owner"],
      audience,
      async () => {
        throw new Error("Expired packet announced");
      },
      h.clock.now + 86400000,
    );
    await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.claim((await h.packets())[0]!.uid, "owner")).rejects.toThrow();
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);

async function packetItem(h: Awaited<ReturnType<typeof fixture>>, count = 2) {
  await h.db.db
    .insert(user_item)
    .values({ uuid: "red-item", ownerId: "owner", itemId: "209639", count });
  return (operationId = randomUUID(), range = 0) =>
    h.command("redPackets.sd", {
      uuid: sfs.string("red-item"),
      msg: sfs.string("A synthetic gift"),
      range: sfs.int(range),
      total: sfs.int(300),
      num: sfs.int(3),
      operationId: sfs.string(operationId),
    });
}
test("native player packets reserve the actual gold and owned item once and only newly funded system claims score", async () => {
  const h = await fixture();
  try {
    const send = await packetItem(h),
      operationId = randomUUID(),
      result = await send(operationId),
      uid = str(result.body, "uid");
    await send(operationId);
    expect(result.body.gold?.value).toBe(99700n);
    expect((await h.db.db.select().from(user_item))[0]!.count).toBe(1);
    expect(await h.packets()).toHaveLength(1);
    expect((await h.claim(uid, "owner")).body.add).toBeUndefined();
    const claim = await h.claim(uid, "other");
    expect(int(claim.body, "add")).toBeGreaterThan(0);
    expect(await h.counter("long_3th_anniversary_redpacket_get_money_count")).toBeUndefined();
    expect((await h.packets())[0]!.remain! + int(claim.body, "add")).toBe(300);
    await expect(
      h.command(
        "redPackets.sd",
        {
          uuid: sfs.string("red-item"),
          msg: sfs.string("gift"),
          range: sfs.int(0),
          total: sfs.int(300),
          num: sfs.int(3),
        },
        "other",
      ),
    ).rejects.toThrow();
    await h.db.db.update(userprofile).set({ gold: 0n }).where(eq(userprofile.uid, "owner"));
    await expect(send()).rejects.toThrow();
    expect((await h.db.db.select().from(user_item))[0]!.count).toBe(1);
    expect(await h.packets()).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("expired player packets fund the original sender's remainder mail once and actual mail claims conserve all gold", async () => {
  const h = await fixture();
  try {
    const send = await packetItem(h),
      uid = str((await send()).body, "uid"),
      claimed = int((await h.claim(uid)).body, "add"),
      store = createRedPacketExpiryStore(h.db.db, h.authority);
    const end = (await h.packets())[0]!.endTime!;
    expect(await settleRedPacketExpiry(store, h.rules, end - 1n)).toBe(0);
    h.clock.now = Number(end);
    await Promise.all([
      settleRedPacketExpiry(store, h.rules, end),
      settleRedPacketExpiry(store, h.rules, end),
    ]);
    expect(await settleRedPacketExpiry(store, h.rules, end)).toBe(0);
    const [refund] = await h.db.db.select().from(mail);
    expect(refund).toMatchObject({
      toUser: "owner",
      rewardId: `gold,0,${300 - claimed}`,
      rewardStatus: 0,
      createTime: end,
    });
    expect((await h.packets())[0]!.state).toBe(1);
    expect((await h.claim(uid)).body.add).toBeUndefined();
    const claims = new MailRewardService(
      createMailRewardExecutor(
        h.db.db,
        h.authority,
        () => h.clock.now,
        async () => true,
      ),
      h.rules,
    );
    await expect(
      claims.command("other", "mail.reward", {
        uid: sfs.string(refund!.uid),
        operationId: sfs.string(randomUUID()),
      }),
    ).rejects.toThrow();
    await claims.command("owner", "mail.reward", {
      uid: sfs.string(refund!.uid),
      operationId: sfs.string(randomUUID()),
    });
    await claims.command("owner", "mail.reward", {
      uid: sfs.string(refund!.uid),
      operationId: sfs.string(randomUUID()),
    });
    expect(
      (await h.db.db.select().from(userprofile)).reduce((sum, row) => sum + row.gold!, 0n),
    ).toBe(200000n);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "redPackets.mail",
      ),
    ).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("expiry mail receipt failure retains the reserved pool and retries without duplicating refunds", async () => {
  const h = await fixture();
  try {
    await (
      await packetItem(h)
    )();
    const packet = (await h.packets())[0]!,
      store = createRedPacketExpiryStore(h.db.db, h.authority);
    await h.db.pool.query(
      `create function reject_expiry_receipt() returns trigger language plpgsql as $$ begin if new.command='redPackets.expire' then raise exception 'synthetic expiry failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_expiry_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_expiry_receipt()`,
    );
    await expect(settleRedPacketExpiry(store, h.rules, packet.endTime!)).rejects.toThrow();
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    expect((await h.packets())[0]!.state).toBe(0);
    await h.db.pool.query(`drop trigger reject_expiry_receipt on opencok_kingdom.command_receipt`);
    expect(await settleRedPacketExpiry(store, h.rules, packet.endTime!)).toBe(1);
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
    await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(settleRedPacketExpiry(store, h.rules, packet.endTime!)).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("alliance packet admission and announcements recheck current matching membership and exclude former members", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(alliance).values({
      uid: "guild",
      alliancename: "Synthetic guild",
      bannerStyle: "",
      createtime: BigInt(h.clock.now),
    });
    await h.db.db.update(userprofile).set({ allianceId: "guild" });
    await h.db.db.insert(alliance_member).values([
      { uid: "owner", allianceId: "guild", rank: 1 },
      { uid: "other", allianceId: "guild", rank: 1 },
    ]);
    const send = await packetItem(h),
      uid = str((await send(randomUUID(), 1)).body, "uid"),
      event = (await h.db.db.select().from(mutation_outbox)).find(
        (row) => row.eventType === "redPackets.announce",
      )!,
      sent: string[] = [];
    await h.db.db.delete(alliance_member).where(eq(alliance_member.uid, "other"));
    await expect(h.claim(uid)).rejects.toThrow();
    await publishRedPacketAnnouncement(
      event.payload,
      "owner",
      ["owner", "other"],
      createCampaignAudience(h.db.db, h.authority),
      async (owner) => {
        sent.push(owner);
      },
      h.clock.now,
    );
    expect(sent).toEqual(["owner"]);
    await h.db.db.insert(alliance_member).values({ uid: "other", allianceId: "guild", rank: 1 });
    expect(int((await h.claim(uid)).body, "add")).toBeGreaterThan(0);
  } finally {
    await h.close();
  }
}, 120000);

test("claim quotas cap maintained personal counters while each distinct funded pool still delivers its conserved gold", async () => {
  const h = await fixture();
  try {
    const maximum = Number(
      h.rules.advanced.campaignVariables!.get(
        "S$long_3th_anniversary_redpacket_get_money_count_max",
      )!.initialValue,
    );
    await h.db.db.insert(trigger_var).values({
      type: 1,
      uid: "other",
      key: "long_3th_anniversary_redpacket_get_money_count",
      value: String(maximum - 1),
      refreshtime: BigInt(h.clock.now),
    });
    await h.paid(await h.purchase());
    await h.paid(await h.purchase());
    for (const packet of await h.packets())
      {expect(int((await h.claim(packet.uid)).body, "add")).toBeGreaterThan(0);}
    expect(await h.counter("long_3th_anniversary_redpacket_get_money_count")).toBe(String(maximum));
    expect(await h.db.db.select().from(red_packets_records)).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);

test("delayed delivered-payment consumption pins its original campaign instant and never extends the saved packet lifetime", async () => {
  const h = await fixture();
  try {
    const proof = await h.purchase();
    h.clock.now += 2 * 86400000;
    await h.paid(proof);
    const [packet] = await h.packets();
    expect(packet!.sendTime).toBe(proof.occurredAt);
    expect(packet!.endTime).toBe(proof.occurredAt + 86400000n);
    expect(int((await h.claim(packet!.uid)).body, "status")).toBe(3);
    expect(
      await settleRedPacketExpiry(
        createRedPacketExpiryStore(h.db.db, h.authority),
        h.rules,
        BigInt(h.clock.now),
      ),
    ).toBe(1);
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
