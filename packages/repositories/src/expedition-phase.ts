import { and, eq, sql } from "drizzle-orm";
import { expedition_clock } from "@opencok/drizzle/schema/opencok_kingdom/expedition_clock";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { expedition_admission } from "@opencok/drizzle/schema/opencok_kingdom/expedition_admission";
import { text } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import type { ExpeditionPhaseStore } from "@opencok/contracts/expedition-phase";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { Database } from "./game";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { readExpedition } from "./new-expedition";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { ExpeditionActivityReader } from "@opencok/contracts/expedition-phase";

export function createExpeditionPhaseStore(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now,
): ExpeditionPhaseStore {
  return {
    async reconcile(period, resolve) {
      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        const [prior] = await tx
          .select()
          .from(expedition_clock)
          .where(eq(expedition_clock.serverId, authority.kingdomId))
          .for("update");
        const [manifest] = await tx
            .select()
            .from(expedition_period)
            .where(eq(expedition_period.serverId, authority.kingdomId))
            .limit(1),
          [admission] = await tx
            .select()
            .from(expedition_admission)
            .where(eq(expedition_admission.periodId, text(period, "id")))
            .limit(1);
        const at = BigInt(now());

        if (prior && at < prior.updatedAt) {return prior;}

        const plan = resolve({ manifest, admission }, at);
        const value = {
          serverId: authority.kingdomId,
          periodId: text(plan, "periodId"),
          stage: cityInteger(plan.stage, 0, 8),
          startTime: cityAmount(plan.startTime),
          endTime: cityAmount(plan.endTime),
          opponent: cityInteger(plan.opponent),
        };

        if (
          prior &&
          prior.periodId === value.periodId &&
          prior.stage === value.stage &&
          prior.startTime === value.startTime &&
          prior.endTime === value.endTime &&
          prior.opponent === value.opponent
        )
          {return prior;}

        const revision = (prior?.revision ?? 0n) + 1n;

        if (revision > 9223372036854775807n || !value.periodId || value.periodId.length > 40)
          {throw new Error("Invalid expedition clock revision");}

        const [saved] = await tx
          .insert(expedition_clock)
          .values({ ...value, revision, updatedAt: at })
          .onConflictDoUpdate({
            target: expedition_clock.serverId,
            set: { ...value, revision, updatedAt: at },
          })
          .returning();

        return saved!;
      });
    },
  };
}

export async function currentExpeditionClock(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
) {
  authority.assertReady();
  const [row] = await db
    .select()
    .from(expedition_clock)
    .where(
      and(eq(expedition_clock.serverId, authority.kingdomId), sql`${expedition_clock.revision}>0`),
    )
    .limit(1);

  return row;
}

export function createExpeditionActivityReader(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now,
): ExpeditionActivityReader {
  return {
    async read(owner) {
      if (!owner || owner.length > 40 || !owner.isWellFormed() || owner.includes("\0"))
        {throw new GameError(errors.invalid);}

      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`set local statement_timeout='3s'`);
        await fenceRealmTransaction(tx, authority);
        const at = BigInt(now()),
          [profile] = await tx
            .select()
            .from(userprofile)
            .where(eq(userprofile.uid, owner))
            .for("share");

        if (
          !profile ||
          profile.serverId !== authority.kingdomId ||
          (profile.banFlag ?? 0) !== 0 ||
          (profile.banTime ?? 0n) > at
        )
          {throw new GameError(errors.invalid);}

        return {
          profile,
          state: await readExpedition(tx, profile, at, "newexpidition.activityinfo"),
        };
      });
    },
  };
}
