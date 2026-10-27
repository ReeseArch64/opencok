import { and, eq } from "drizzle-orm";
import type { createDatabases } from "@opencok/drizzle";
import { cn1_profile_session as session } from "@opencok/drizzle/schema/opencok_global/cn1_profile_session";
import { cn1RewardRatio } from "@opencok/rules/cn1-rewards";
import { javaDecimal } from "@opencok/rules/java-integer";
import type { Rules } from "@opencok/rules/game";
import type { Row } from "@opencok/contracts/rows";

export function createCn1Sessions(
  db: ReturnType<typeof createDatabases>["global"]["db"],
  rules: Rules,
  kingdomId: number,
) {
  const current = new Map<string, typeof session.$inferSelect | null>();
  const active = new Map<string, string>();
  const remember = (owner: string, row: typeof session.$inferSelect | null) => {
    current.delete(owner);
    current.set(owner, row);

    if (current.size > 8192)
      {for (const key of current.keys()) {
        if (!active.has(key) && key !== owner) {current.delete(key);}

        if (current.size <= 8192) {break;}
      }}

    if (current.size > 8192) {throw new Error("CN1 session capacity exceeded");}
  };
  const timestamp = (now: number) => {
    if (!Number.isSafeInteger(now) || now < 0) {throw new Error("Invalid CN1 session time");}

    return BigInt(now);
  };
  async function sample(owner: string, now: number, id?: string, closing = false) {
    const time = timestamp(now);
    const value = await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(session)
        .where(eq(session.ownerUid, owner))
        .limit(1)
        .for("update");

      if (!row) {return null;}

      if (id && row.sessionId !== id) {return row;}

      if (!id || !row.sessionId) {return row;}

      const elapsed = time > row.sampledAt ? (time - row.sampledAt) / 60000n : 0n;
      const onlineMinutes =
        row.isAddict === 0 ? 0 : Number(BigInt.asIntN(32, BigInt(row.onlineMinutes) + elapsed));
      const values = {
        onlineMinutes,
        sampledAt: closing ? time : row.sampledAt + elapsed * 60000n,
        ...(closing ? { offlineAt: time, sessionId: null } : {}),
      };
      const [updated] = await tx
        .update(session)
        .set(values)
        .where(and(eq(session.ownerUid, owner), eq(session.sessionId, id)))
        .returning();

      if (!updated) {throw new Error("CN1 session changed");}

      return updated;
    });
    remember(owner, value);
  }

  return {
    async open(owner: string, id: string, now: number) {
      const time = timestamp(now);
      const row = await db.transaction(async (tx) => {
        const [saved] = await tx
          .select()
          .from(session)
          .where(eq(session.ownerUid, owner))
          .limit(1)
          .for("update");

        if (!saved) {return null;}

        let isAddict = saved.isAddict;

        if (isAddict === 2 && saved.authAt < time) {isAddict = 0;}

        let onlineMinutes = saved.onlineMinutes;

        if (
          saved.sessionId !== null &&
          active.get(owner) === saved.sessionId &&
          time > saved.sampledAt
        )
          {onlineMinutes = Number(
            BigInt.asIntN(32, BigInt(onlineMinutes) + (time - saved.sampledAt) / 60000n),
          );}

        const control = rules.configuration.payControl?.get("69036");

        if (
          isAddict === 0 ||
          (saved.offlineAt !== null &&
            control &&
            (time - saved.offlineAt) / 60000n >= javaDecimal(control.k4, 32))
        )
          {onlineMinutes = 0;}

        const [updated] = await tx
          .update(session)
          .set({ isAddict, onlineMinutes, sessionId: id, sampledAt: time, offlineAt: null })
          .where(eq(session.ownerUid, owner))
          .returning();

        return updated!;
      });
      active.set(owner, id);
      remember(owner, row);
    },
    async close(owner: string, id: string, now: number) {
      await sample(owner, now, id, true);

      if (active.get(owner) === id) {
        active.delete(owner);
        current.delete(owner);
      }
    },
    async refresh(owner: string, now: number) {
      await sample(owner, now, active.get(owner));
    },
    ratio(profile: Row): number {
      const owner = profile.uid;

      if (typeof owner !== "string" || !current.has(owner))
        {throw new Error("CN1 session not restored");}

      const row = current.get(owner)!;

      return cn1RewardRatio(
        row === null ? null : { isAddict: row.isAddict, onlineLastTime: row.onlineMinutes },
        rules,
        { kingdomId, version: typeof profile.appVersion === "string" ? profile.appVersion : "" },
      );
    },
    async check() {
      await db.select().from(session).limit(0);
    },
  };
}
