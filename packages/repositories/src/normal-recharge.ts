import { and, eq, inArray, sql } from "drizzle-orm";
import { pay_total } from "@opencok/drizzle/schema/opencok_kingdom/pay_total";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import type { NormalRechargeState, NormalRechargeWrite } from "@opencok/contracts/normal-recharge";
import { long } from "@opencok/contracts/rows";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import type { MutationTransaction } from "./mutation";

function marker(key: string) {
  if (!/^normal\.recharge\.order\.v1\.[a-f0-9]{64}$/.test(key))
    {throw new Error("Invalid recharge receipt key");}
}

export async function readNormalRecharge(
  tx: MutationTransaction,
  owner: string,
  now: bigint,
  initialize: boolean,
): Promise<NormalRechargeState> {
  let [server] = await tx
    .select({
      payTotalTime: server_info.payTotalTime,
      lastMergeMillis: server_info.lastMergeMillis,
      mergeTiredRushBeginTime: server_info.mergeTiredRushBeginTime,
    })
    .from(server_info)
    .where(eq(server_info.uid, "server"));

  if (
    initialize &&
    server &&
    long(server, "lastMergeMillis") > 0n &&
    long(server, "lastMergeMillis") <= now &&
    long(server, "mergeTiredRushBeginTime") <= 0n
  ) {
    [server] = await tx
      .select({
        payTotalTime: server_info.payTotalTime,
        lastMergeMillis: server_info.lastMergeMillis,
        mergeTiredRushBeginTime: server_info.mergeTiredRushBeginTime,
      })
      .from(server_info)
      .where(eq(server_info.uid, "server"))
      .for("update");
  }

  const totals = await tx
    .select()
    .from(pay_total)
    .where(and(eq(pay_total.uid, owner), inArray(pay_total.type, [1, 2, 3, 4])))
    .limit(5)
    .for("update");

  if (totals.length > 4) {throw new Error("Recharge total bound exceeded");}

  return {
    server: server ?? {},
    totals,
    async payment(orderId, platform) {
      if (!orderId || orderId.length > 200 || !platform || platform.length > 20)
        {throw new Error("Invalid recharge order selection");}

      return (
        await tx
          .select({
            uid: paylog.uid,
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
    async processed(key) {
      marker(key);
      const [row] = await tx
        .select({ value: sql<string>`left(${trigger_var.value},65)` })
        .from(trigger_var)
        .where(and(eq(trigger_var.type, 1), eq(trigger_var.uid, owner), eq(trigger_var.key, key)));

      if (row && !/^[a-f0-9]{64}$/.test(row.value))
        {throw new Error("Invalid recharge order receipt");}

      return row?.value;
    },
  };
}

export async function writeNormalRecharge(
  tx: MutationTransaction,
  owner: string,
  write: NormalRechargeWrite,
  now: bigint,
) {
  if (write.mergeBegin !== undefined) {
    const rows = await tx
      .update(server_info)
      .set({ mergeTiredRushBeginTime: cityAmount(write.mergeBegin) })
      .where(
        and(
          eq(server_info.uid, "server"),
          sql`coalesce(${server_info.mergeTiredRushBeginTime},0)<=0`,
        ),
      )
      .returning({ uid: server_info.uid });

    if (rows.length !== 1) {throw new Error("Recharge merge anchor changed");}
  }

  if (write.total) {
    const total = {
      uid: owner,
      type: cityInteger(write.total.type, 1, 4),
      gold: cityAmount(write.total.gold),
      getLv: cityInteger(write.total.getLv, 0, 128),
      updateTime: cityAmount(write.total.updateTime),
    };

    if (total.updateTime > now) {throw new Error("Future recharge total");}

    await tx
      .insert(pay_total)
      .values(total)
      .onConflictDoUpdate({ target: [pay_total.uid, pay_total.type], set: total });
  }

  if (write.receipt) {
    marker(write.receipt.key);

    if (!/^[a-f0-9]{64}$/.test(write.receipt.fingerprint))
      {throw new Error("Invalid recharge receipt fingerprint");}

    await tx.insert(trigger_var).values({
      type: 1,
      uid: owner,
      key: write.receipt.key,
      value: write.receipt.fingerprint,
      refreshtime: now,
    });
  }
}
