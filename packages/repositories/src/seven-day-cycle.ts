import { desc, eq } from "drizzle-orm";
import { user_exchange_cycle } from "@opencok/drizzle/schema/opencok_kingdom/user_exchange_cycle";
import { user_luck_draw } from "@opencok/drizzle/schema/opencok_kingdom/user_luck_draw";
import { luck_draw_history } from "@opencok/drizzle/schema/opencok_kingdom/luck_draw_history";
import { long, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { cycleField, cycleClaims, cycleBuffs } from "@opencok/rules/seven-day-cycle";
import type { SevenDayCycleWrite } from "@opencok/contracts/seven-day-cycle";
import type { MutationTransaction } from "./mutation";
export async function readSevenDayCycle(tx: MutationTransaction, owner: string) {
  const [cycle] = await tx
    .select()
    .from(user_exchange_cycle)
    .where(eq(user_exchange_cycle.uid, owner))
    .for("update");
  const draws = await tx
    .select()
    .from(user_luck_draw)
    .where(eq(user_luck_draw.uid, owner))
    .limit(4)
    .for("update");
  if (draws.length > 3 || draws.some((row) => ![0, 1, 2].includes(row.type)))
    throw new Error("Invalid owned cycle draws");
  const history: Row[] = [];
  for (const page of [0, 1, 2])
    history.push(
      ...(await tx
        .select()
        .from(luck_draw_history)
        .where(eq(luck_draw_history.type, page))
        .orderBy(desc(luck_draw_history.time))
        .limit(30)),
    );

  return { cycle, draws, history };
}
export async function writeSevenDayCycle(
  tx: MutationTransaction,
  owner: string,
  write: SevenDayCycleWrite,
) {
  if (write.cycle) {
    const row = write.cycle;
    if (row.uid !== owner) throw new Error("Invalid cycle owner");
    const value = {
      uid: owner,
      ...Object.fromEntries(
        [0, 1, 2].flatMap((page) => {
          const names = ["stage", "totalstage", "waittime", "cdtime", "receive_reward"];
          return names.map((name) => {
            const key = cycleField(name, page);
            if (name === "receive_reward") cycleClaims(text(row, key));
            const value =
              name === "stage"
                ? cityInteger(row[key], 0, 6)
                : name === "totalstage"
                  ? cityInteger(row[key])
                  : name === "receive_reward"
                    ? text(row, key)
                    : long(row, key);
            if (typeof value === "bigint" && (value < -1n || value > 9223372036854775807n))
              throw new Error("Invalid cycle timestamp");
            return [key, value];
          });
        }),
      ),
    };
    await tx
      .insert(user_exchange_cycle)
      .values(value)
      .onConflictDoUpdate({ target: user_exchange_cycle.uid, set: value });
  }
  if (write.draw) {
    const row = write.draw;
    if (row.uid !== owner) throw new Error("Invalid cycle draw owner");
    cycleBuffs(text(row, "reward"));
    const value = {
      uid: owner,
      type: cityInteger(row.type, 0, 2),
      count: cityInteger(row.count),
      upTime: long(row, "upTime"),
      randTime: long(row, "randTime"),
      reward: text(row, "reward"),
    };
    if ([value.upTime, value.randTime].some((at) => at < 0n || at > 9223372036854775807n))
      throw new Error("Invalid cycle draw timestamp");
    await tx
      .insert(user_luck_draw)
      .values(value)
      .onConflictDoUpdate({ target: [user_luck_draw.uid, user_luck_draw.type], set: value });
  }
  if (write.history) {
    const row = write.history;
    if (
      row.gameUid !== owner ||
      text(row, "roleName").length > 40 ||
      text(row, "allianceName").length > 40
    )
      throw new Error("Invalid cycle history owner");
    await tx.insert(luck_draw_history).values({
      gameUid: owner,
      roleName: text(row, "roleName"),
      allianceId: text(row, "allianceId"),
      allianceName: text(row, "allianceName"),
      type: cityInteger(row.type, 0, 2),
      itemId: text(row, "itemId"),
      time: long(row, "time"),
    });
  }
}
