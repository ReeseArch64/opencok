import { and, asc, desc, eq, sql } from "drizzle-orm";
import { user_comeback_record } from "@opencok/drizzle/schema/opencok_kingdom/user_comeback_record";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { comebackDeviceId, comebackViewedKey, comebackClaims } from "@opencok/rules/comeback";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { text, long, type Row } from "@opencok/contracts/rows";
import type { ComebackState, ComebackWrite } from "@opencok/contracts/comeback";
import { readComebackSession, lockComebackDevice } from "./comeback-session";
import { insertSystemMail } from "./system-mail";
import type { MutationTransaction } from "./mutation";

export async function readComeback(
  tx: MutationTransaction,
  owner: string,
  profile: Row,
): Promise<ComebackState> {
  await lockComebackDevice(tx, profile);
  const records = await tx
    .select()
    .from(user_comeback_record)
    .where(eq(user_comeback_record.uid, owner))
    .orderBy(desc(user_comeback_record.backTime), asc(user_comeback_record.configId))
    .limit(65)
    .for("update");

  if (records.length > 64) throw new Error("Comeback history exceeds bound");

  const [deviceRecord] = await tx
    .select({
      uid: user_comeback_record.uid,
      configId: user_comeback_record.configId,
      backTime: user_comeback_record.backTime,
      backType: user_comeback_record.backType,
    })
    .from(user_comeback_record)
    .where(eq(user_comeback_record.deviceId, comebackDeviceId(profile)))
    .orderBy(desc(user_comeback_record.backTime), asc(user_comeback_record.uid))
    .limit(1);
  const session = await readComebackSession(tx, owner);
  const [viewed] = await tx
    .select({ value: trigger_var.value, at: trigger_var.refreshtime })
    .from(trigger_var)
    .where(
      and(
        eq(trigger_var.type, 1),
        eq(trigger_var.uid, owner),
        eq(trigger_var.key, comebackViewedKey),
      ),
    );

  if (viewed && viewed.value !== "1") throw new Error("Invalid comeback view marker");

  const [charges] = await tx
    .select({ total: sql<string>`coalesce(sum(${paylog.spend}),0)::text` })
    .from(paylog)
    .where(eq(paylog.uid, owner));
  const amount = Number(charges?.total ?? 0);

  if (!Number.isFinite(amount)) throw new Error("Invalid comeback payment history");

  return {
    records,
    deviceRecord,
    session,
    viewedAt: viewed?.at ?? 0n,
    totalCharge: Math.max(-2147483648, Math.min(2147483647, Math.trunc(amount))),
  };
}

export async function writeComeback(tx: MutationTransaction, owner: string, write: ComebackWrite) {
  if (write.record) {
    const row = write.record;
    const configId = text(row, "configId"),
      deviceId = text(row, "deviceId");

    if (row.uid !== owner || !/^\d{1,11}$/.test(configId) || deviceId.length > 255)
      throw new Error("Invalid comeback record identity");

    comebackClaims(row.dailyReward, 30);
    comebackClaims(row.payReward, 100);
    const value = {
      uid: owner,
      configId,
      deviceId,
      backTime: cityAmount(row.backTime),
      backType: cityInteger(row.backType, 1, 4),
      backReward: cityInteger(row.backReward ?? 0, 0, 127),
      dailyReward: text(row, "dailyReward"),
      payReward: text(row, "payReward"),
      payTotal: cityAmount(row.payTotal),
    };
    const [old] = await tx
      .select()
      .from(user_comeback_record)
      .where(and(eq(user_comeback_record.uid, owner), eq(user_comeback_record.configId, configId)))
      .for("update");

    if (
      old &&
      (old.backTime !== value.backTime ||
        old.backType !== value.backType ||
        old.payTotal !== value.payTotal ||
        (old.deviceId ?? "") !== value.deviceId)
    )
      throw new Error("Comeback enrollment identity changed");

    await tx
      .insert(user_comeback_record)
      .values(value)
      .onConflictDoUpdate({
        target: [user_comeback_record.uid, user_comeback_record.configId],
        set: {
          backReward: value.backReward,
          dailyReward: value.dailyReward,
          payReward: value.payReward,
        },
      });
  }

  if (write.clearBackFlags)
    await tx
      .update(userprofile)
      .set({ backFlag_mc: 0, backFlag_op: 0 })
      .where(eq(userprofile.uid, owner));

  if (write.viewedAt !== undefined) {
    const at = cityAmount(write.viewedAt);
    await tx
      .insert(trigger_var)
      .values({ type: 1, uid: owner, key: comebackViewedKey, value: "1", refreshtime: at })
      .onConflictDoUpdate({
        target: [trigger_var.type, trigger_var.uid, trigger_var.key],
        set: { value: "1", refreshtime: at },
      });
  }

  if (write.mail) {
    if (
      write.mail.owner !== owner ||
      long(write.record ?? {}, "backTime") !== write.mail.createTime
    )
      throw new Error("Invalid comeback enrollment mail");

    await insertSystemMail(
      tx,
      write.mail,
      owner,
      write.mail.uid.slice(0, 32),
      write.mail.createTime,
    );
  }
}
