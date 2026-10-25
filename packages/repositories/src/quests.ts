import { user_daily_task } from "@opencok/drizzle/schema/opencok_kingdom/user_daily_task";
import { sign_in } from "@opencok/drizzle/schema/opencok_kingdom/sign_in";
import { and, eq, sql } from "drizzle-orm";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { user_story_task } from "@opencok/drizzle/schema/opencok_kingdom/user_story_task";
import { user_new_daily_task } from "@opencok/drizzle/schema/opencok_kingdom/user_new_daily_task";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { user_14day_login } from "@opencok/drizzle/schema/opencok_kingdom/user_14day_login";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import type { QuestState, QuestWrite } from "@opencok/contracts/city-progression";
import { text, num, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export async function readQuests(
  tx: MutationTransaction,
  owner: string,
  profile: Row,
  now: bigint,
): Promise<QuestState> {
  const legacy = await tx
    .select()
    .from(user_daily_task)
    .where(eq(user_daily_task.uid, owner))
    .limit(1025);
  const [fresh] = await tx.select().from(sign_in).where(eq(sign_in.uid, owner));
  const [lord] = await tx.select().from(user_lord).where(eq(user_lord.uid, owner));
  const [mixed] = await tx.select().from(user_mixed_info).where(eq(user_mixed_info.uid, owner));
  const [signIn] = await tx
    .select()
    .from(user_14day_login)
    .where(and(eq(user_14day_login.uid, owner), eq(user_14day_login.type, 1)));
  const story = await tx
    .select()
    .from(user_story_task)
    .where(eq(user_story_task.uid, owner))
    .limit(4097);
  const daily = await tx
    .select()
    .from(user_new_daily_task)
    .where(eq(user_new_daily_task.uid, owner))
    .limit(257);
  let [guild] = await tx
    .select()
    .from(alliance)
    .where(eq(alliance.uid, text(profile, "allianceId")));
  if (guild && now / 86400000n > BigInt(guild.taskFlushTime ?? 0) / 86400000n) {
    const [flushed] = await tx
      .update(alliance)
      .set({ taskFlushTime: now, taskNum: 0, taskLimit: "" })
      .where(
        and(
          eq(alliance.uid, guild.uid),
          sql`COALESCE(${alliance.taskFlushTime},0) < ${(now / 86400000n) * 86400000n}`,
        ),
      )
      .returning();
    if (flushed) guild = flushed;
    else
      [guild] = await tx
        .select()
        .from(alliance)
        .where(eq(alliance.uid, text(profile, "allianceId")));
  }
  if (story.length > 4096 || daily.length > 256 || legacy.length > 1024)
    throw new Error("Oversized quest aggregate");
  return {
    legacy,
    fresh: fresh ?? {},
    lord: lord ?? {},
    mixed: mixed ?? {},
    signIn: signIn ?? {},
    story,
    daily,
    alliance: guild ?? {},
  };
}
export async function writeQuests(tx: MutationTransaction, owner: string, write: QuestWrite) {
  for (const rows of [write.tasks, write.story, write.daily])
    for (const row of rows ?? []) {
      if (
        row.uid !== owner ||
        ![0, 1, 2].includes(num(row, "state")) ||
        !Number.isInteger(num(row, "num")) ||
        num(row, "num") < 0 ||
        num(row, "num") > 2147483647
      )
        throw new Error("Invalid quest write");
    }
  if (write.fresh)
    await tx
      .insert(sign_in)
      .values({ uid: owner, ...write.fresh })
      .onConflictDoUpdate({ target: sign_in.uid, set: write.fresh });
  if (write.resetLegacy) await tx.delete(user_daily_task).where(eq(user_daily_task.uid, owner));
  for (const row of write.legacy ?? []) {
    const value = {
      uid: owner,
      id: text(row, "id"),
      num: num(row, "num"),
      times: num(row, "times"),
    };
    await tx
      .insert(user_daily_task)
      .values(value)
      .onConflictDoUpdate({ target: [user_daily_task.uid, user_daily_task.id], set: value });
  }
  if (write.legacyPeriod !== undefined)
    await tx
      .insert(user_lord)
      .values({ uid: owner, dailyTaskFlushTime: write.legacyPeriod })
      .onConflictDoUpdate({
        target: user_lord.uid,
        set: { dailyTaskFlushTime: write.legacyPeriod },
      });
  if (write.dailyClaims !== undefined)
    await tx
      .insert(user_mixed_info)
      .values({ uid: owner, mdata: "", dailyTaskId: write.dailyClaims })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: { dailyTaskId: write.dailyClaims } });
  if (write.allianceBox) {
    const [profile] = await tx
      .execute(sql`SELECT "allianceId" FROM opencok_kingdom.userprofile WHERE uid = ${owner}`)
      .then((result) => result.rows);
    const [guild] = await tx
      .select()
      .from(alliance)
      .where(eq(alliance.uid, String(profile?.allianceId ?? "")))
      .for("update");
    if (
      !guild ||
      BigInt(guild.taskFlushTime ?? 0) / 86400000n !== write.allianceBox.period ||
      (guild.taskNum ?? 0) < write.allianceBox.threshold
    )
      throw new Error("Stale alliance quest period");
    const limits = new Map(
      (guild.taskLimit ?? "")
        .split("|")
        .filter(Boolean)
        .map((pair) => {
          const [id, count] = pair.split(";");
          return [Number(id), Number(count)] as const;
        }),
    );
    const count = limits.get(write.allianceBox.threshold) ?? 0;
    if (count >= (guild.maxMember ?? 0)) throw new Error("Alliance quest box limit reached");
    limits.set(write.allianceBox.threshold, count + 1);
    await tx
      .update(alliance)
      .set({ taskLimit: [...limits].map(([id, count]) => `${id};${count}`).join("|") })
      .where(eq(alliance.uid, guild.uid));
  }
  for (const row of write.tasks ?? []) {
    const value = {
      uid: owner,
      id: text(row, "id"),
      type: num(row, "type"),
      state: num(row, "state"),
      num: num(row, "num"),
    };
    await tx
      .insert(user_task)
      .values(value)
      .onConflictDoUpdate({ target: [user_task.uid, user_task.id], set: value });
  }
  for (const row of write.story ?? []) {
    const value = {
      uid: owner,
      id: num(row, "id"),
      type: num(row, "type"),
      state: num(row, "state"),
      num: num(row, "num"),
    };
    await tx
      .insert(user_story_task)
      .values(value)
      .onConflictDoUpdate({ target: [user_story_task.uid, user_story_task.id], set: value });
  }
  if (write.resetDaily)
    await tx.delete(user_new_daily_task).where(eq(user_new_daily_task.uid, owner));
  for (const row of write.daily ?? []) {
    const value = {
      uid: owner,
      id: num(row, "id"),
      type: num(row, "type"),
      state: num(row, "state"),
      num: num(row, "num"),
    };
    await tx
      .insert(user_new_daily_task)
      .values(value)
      .onConflictDoUpdate({
        target: [user_new_daily_task.uid, user_new_daily_task.id, user_new_daily_task.type],
        set: value,
      });
  }
  if (write.lord)
    await tx
      .insert(user_lord)
      .values({ uid: owner, ...write.lord })
      .onConflictDoUpdate({ target: user_lord.uid, set: write.lord });
  if (write.signIn)
    await tx
      .insert(user_14day_login)
      .values({ uid: owner, type: 1, ...write.signIn })
      .onConflictDoUpdate({
        target: [user_14day_login.uid, user_14day_login.type],
        set: write.signIn,
      });
  if (write.taskStage !== undefined)
    await tx
      .insert(user_mixed_info)
      .values({ uid: owner, mdata: "", taskStage: write.taskStage })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: { taskStage: write.taskStage } });
  if (write.allianceTasks) {
    const rows = await tx.execute(
      sql`UPDATE opencok_kingdom.alliance SET "taskNum" = COALESCE("taskNum",0) + ${write.allianceTasks} WHERE uid = (SELECT "allianceId" FROM opencok_kingdom.userprofile WHERE uid = ${owner}) RETURNING uid`,
    );
    if (rows.rowCount !== 1) throw new Error("Missing quest alliance");
  }
}
