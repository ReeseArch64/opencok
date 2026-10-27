import { alias } from "drizzle-orm/pg-core";
import { appendMutationRecords } from "./mutation";
import { fenceRealmTransaction } from "./realm-authority";
import { insertSystemMail } from "./system-mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, asc, eq, lte, or } from "drizzle-orm";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { red_packets } from "@opencok/drizzle/schema/opencok_kingdom/red_packets";
import { red_packets_records } from "@opencok/drizzle/schema/opencok_kingdom/red_packets_records";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { RedPacketReader, RedPacketWrite } from "@opencok/contracts/paid-gifts";
import type { MutationTransaction } from "./mutation";

export function redPacketReader(tx: MutationTransaction, owner: string): RedPacketReader {
  return {
    async payment(orderId, platform) {
      return (
        await tx
          .select({
            productId: paylog.productId,
            time: paylog.time,
            spend: paylog.spend,
            status: paylog.status,
          })
          .from(paylog)
          .where(and(eq(paylog.uid, owner), eq(paylog.orderId, orderId), eq(paylog.pf, platform)))
          .for("update")
      )[0];
    },
    async packet(uid) {
      if (!uid || uid.length > 255) {throw new Error("Invalid red packet identity");}

      const [packet] = await tx
        .select()
        .from(red_packets)
        .where(eq(red_packets.uid, uid))
        .for("update");

      if (!packet) {return undefined;}

      const records = await tx
        .select()
        .from(red_packets_records)
        .where(eq(red_packets_records.uid, uid))
        .orderBy(asc(red_packets_records.getTime), asc(red_packets_records.player))
        .limit(4097);

      if (records.length > 4096) {throw new Error("Red packet records exceed bound");}

      return { packet, records };
    },
    async received() {
      const rows = await tx
        .select({ uid: red_packets_records.uid })
        .from(red_packets_records)
        .where(eq(red_packets_records.player, owner))
        .orderBy(asc(red_packets_records.uid))
        .limit(4097);

      if (rows.length > 4096) {throw new Error("Received red packets exceed bound");}

      return rows;
    },
  };
}

function packetValues(row: Row) {
  return {
    uid: text(row, "uid"),
    range: num(row, "range"),
    rangeId: text(row, "rangeId"),
    type: num(row, "type"),
    sender: text(row, "sender"),
    senderName: text(row, "senderName"),
    pic: text(row, "pic"),
    picVer: num(row, "picVer"),
    total: num(row, "total"),
    remain: num(row, "remain"),
    totalPeople: num(row, "totalPeople"),
    curPeople: num(row, "curPeople"),
    sendTime: long(row, "sendTime"),
    endTime: long(row, "endTime"),
    state: num(row, "state"),
  };
}

export async function writeRedPackets(
  tx: MutationTransaction,
  owner: string,
  write: RedPacketWrite,
) {
  if ((write.created?.length ?? 0) > 128) {throw new Error("Too many red packet creations");}

  for (const row of write.created ?? []) {await tx.insert(red_packets).values(packetValues(row));}

  if (write.updated) {
    const row = write.updated;
    await tx
      .update(red_packets)
      .set({
        remain: num(row, "remain"),
        curPeople: num(row, "curPeople"),
        state: num(row, "state"),
      })
      .where(eq(red_packets.uid, text(row, "uid")));
  }

  if (write.claim) {
    const row = write.claim;

    if (text(row, "player") !== owner) {throw new Error("Foreign red packet claimant");}

    await tx.insert(red_packets_records).values({
      uid: text(row, "uid"),
      player: owner,
      name: text(row, "name"),
      pic: text(row, "pic"),
      picVer: num(row, "picVer"),
      value: num(row, "value"),
      getTime: long(row, "getTime"),
    });
  }
}

export function createRedPacketExpiryStore(
  db: import("./game").Database["kingdom"]["db"],
  authority: import("./realm-authority").RealmAuthority,
): import("@opencok/contracts/paid-gifts").RedPacketExpiryStore {
  const expiringPacket = alias(red_packets, "expiring_packet");

  return {
    settle(now, refund) {
      if (now < 0n || !Number.isSafeInteger(Number(now)))
        {throw new Error("Invalid packet expiry clock");}

      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const candidates = await tx
          .select({ packet: expiringPacket })
          .from(expiringPacket)
          .leftJoin(userprofile, eq(userprofile.uid, expiringPacket.sender))
          .where(
            and(
              eq(expiringPacket.state, 0),
              lte(expiringPacket.endTime, now),
              or(
                eq(expiringPacket.sender, "3000002"),
                eq(userprofile.serverId, authority.kingdomId),
              ),
            ),
          )
          .orderBy(asc(expiringPacket.endTime), asc(expiringPacket.uid))
          .limit(128)
          .for("update", { of: expiringPacket, skipLocked: true });
        let settled = 0;

        for (const { packet } of candidates) {
          const rows = await tx
            .select({ value: red_packets_records.value })
            .from(red_packets_records)
            .where(eq(red_packets_records.uid, packet.uid))
            .limit(4097);

          if (
            rows.length > 4096 ||
            rows.length !== packet.curPeople ||
            rows.some((row) => (row.value ?? 0) <= 0) ||
            rows.reduce((sum, row) => sum + (row.value ?? 0), packet.remain ?? 0) !== packet.total
          )
            {throw new Error("Invalid packet funding history");}

          const refundPlan = refund(packet);

          if (refundPlan) {
            const { mail, event } = refundPlan;
            await insertSystemMail(tx, mail, mail.owner, mail.uid.slice(0, 32), mail.createTime);
            await appendMutationRecords(
              tx,
              authority,
              {
                owner: mail.owner,
                requestId: `redpacket:expiry:${mail.uid}`,
                command: "redPackets.expire",
                request: Buffer.from(packet.uid),
              },
              { response: Buffer.alloc(0), events: [event] },
              now,
            );
          }

          await tx.update(red_packets).set({ state: 1 }).where(eq(red_packets.uid, packet.uid));
          settled++;
        }

        authority.assertReady();

        return settled;
      });
    },
  };
}
