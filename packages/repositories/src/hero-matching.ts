import { and, asc, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";
import { hero_match_period } from "@opencok/drizzle/schema/opencok_global/hero_match_period";
import { hero_match_realm } from "@opencok/drizzle/schema/opencok_global/hero_match_realm";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { heroMatchGroups, heroMatchIdentity } from "@opencok/rules/hero-matching";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type {
  HeroMatchingRegistry,
  HeroMatchingRealmStore,
} from "@opencok/contracts/hero-matching";
import type { Database } from "./game";

type Global = Database["databases"]["global"]["db"];

export function createHeroMatchingRegistry(db: Global): HeroMatchingRegistry {
  const lock = async (tx: Parameters<Parameters<Global["transaction"]>[0]>[0], id: string) => {
    await tx.execute(sql`set local lock_timeout='1s'`);
    await tx.execute(sql`set local statement_timeout='3s'`);
    await tx.execute(sql`select pg_advisory_xact_lock(728222,hashtext(${id}))`);
  };

  return {
    async register(value) {
      cityInteger(value.kingdomId, 1);
      cityAmount(value.power);
      cityAmount(value.startTime);
      cityAmount(value.endTime);
      cityAmount(value.registeredAt);
      cityInteger(value.groupSize, 1, 128);
      cityInteger(value.matchSize, 1, Math.min(16, value.groupSize));
      cityInteger(value.shuffle, 0, value.groupSize * 10 - 1);

      if (
        !value.definition ||
        value.definition.length > 100 ||
        value.periodId !== heroMatchIdentity(value.definition, value.startTime) ||
        value.endTime <= value.startTime ||
        value.registeredAt < value.startTime ||
        value.registeredAt >= value.endTime
      )
        throw new Error("Invalid hero realm registration");

      await db.transaction(async (tx) => {
        await lock(tx, value.periodId);
        let [period] = await tx
          .select()
          .from(hero_match_period)
          .where(eq(hero_match_period.id, value.periodId))
          .for("update");

        if (!period) {
          if (value.registeredAt + 240000n >= value.endTime) return;

          [period] = await tx
            .insert(hero_match_period)
            .values({
              id: value.periodId,
              definition: value.definition,
              startTime: value.startTime,
              endTime: value.endTime,
              admissionEnd: value.registeredAt + 240000n,
              createdAt: value.registeredAt,
              groupSize: value.groupSize,
              matchSize: value.matchSize,
              matchedAt: 0n,
            })
            .returning();
        }

        if (
          !period ||
          period.startTime !== value.startTime ||
          period.endTime !== value.endTime ||
          period.definition !== value.definition ||
          value.registeredAt < period.createdAt
        )
          throw new Error("Conflicting hero matching period");

        const [existing] = await tx
          .select()
          .from(hero_match_realm)
          .where(
            and(
              eq(hero_match_realm.periodId, value.periodId),
              eq(hero_match_realm.kingdomId, value.kingdomId),
            ),
          )
          .limit(1);

        if (existing || period.matchedAt > 0n || value.registeredAt >= period.admissionEnd) return;

        const [count] = await tx
          .select({ total: sql<string>`count(*)::text` })
          .from(hero_match_realm)
          .where(eq(hero_match_realm.periodId, value.periodId));

        if (Number(count?.total ?? 0) >= 4096)
          throw new Error("Hero matching registry bound exceeded");

        await tx.insert(hero_match_realm).values({
          periodId: value.periodId,
          kingdomId: value.kingdomId,
          power: value.power,
          shuffle: value.shuffle,
          registeredAt: value.registeredAt,
          matchedAt: 0n,
          serverGroup: null,
        });
      });
    },
    async match(periodId, now) {
      cityAmount(now);
      await db.transaction(async (tx) => {
        await lock(tx, periodId);
        const [period] = await tx
          .select()
          .from(hero_match_period)
          .where(eq(hero_match_period.id, periodId))
          .for("update");

        if (!period || period.matchedAt > 0n || now < period.admissionEnd || now >= period.endTime)
          return;

        const realms = await tx
          .select()
          .from(hero_match_realm)
          .where(eq(hero_match_realm.periodId, periodId))
          .limit(4097);
        const groups = heroMatchGroups(realms, period.groupSize, period.matchSize);

        if (!groups.length) return;

        await tx.execute(
          sql`update opencok_global.hero_match_realm r set "serverGroup"=v."serverGroup", "matchedAt"=${now} from jsonb_to_recordset(${JSON.stringify(groups)}::jsonb) as v("kingdomId" integer,"serverGroup" text) where r."periodId"=${periodId} and r."kingdomId"=v."kingdomId"`,
        );
        await tx
          .update(hero_match_period)
          .set({ matchedAt: now })
          .where(eq(hero_match_period.id, periodId));
      });
    },
    async result(periodId, kingdomId) {
      const [row] = await db
        .select()
        .from(hero_match_realm)
        .where(
          and(
            eq(hero_match_realm.periodId, periodId),
            eq(hero_match_realm.kingdomId, kingdomId),
            gt(hero_match_realm.matchedAt, 0n),
          ),
        )
        .limit(1);

      return row?.serverGroup
        ? { periodId, serverGroup: row.serverGroup, matchedAt: row.matchedAt }
        : undefined;
    },
  };
}

export function createHeroMatchingRealmStore(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now,
): HeroMatchingRealmStore {
  return {
    pending() {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const at = BigInt(now()),
          periods = await tx
            .select()
            .from(hero_activity)
            .where(
              and(
                eq(hero_activity.activityType, 3),
                eq(hero_activity.finish, 0),
                gt(hero_activity.endTime, at),
                or(isNull(hero_activity.serverGroup), eq(hero_activity.serverGroup, "")),
              ),
            )
            .orderBy(asc(hero_activity.startTime), asc(hero_activity.uuid))
            .limit(2);

        if (periods.length > 1) throw new Error("Hero matching local period bound exceeded");

        if (!periods.length) return [];

        const [power] = await tx
          .select({
            total: sql<string>`coalesce(sum(coalesce(${playerinfo.power},0)+coalesce(${playerinfo.buildingPower},0)),0)::text`,
          })
          .from(playerinfo);

        return periods.map((period) => ({
          id: period.uuid,
          definition: period.activityId,
          startTime: period.startTime ?? 0n,
          endTime: period.endTime ?? 0n,
          power: cityAmount(power?.total ?? "0"),
        }));
      });
    },
    async apply(id, result) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        const [period] = await tx
          .select()
          .from(hero_activity)
          .where(eq(hero_activity.uuid, id))
          .for("update");

        if (!period || period.finish !== 0 || (period.endTime ?? 0n) <= BigInt(now())) return;

        const members = result.serverGroup.split("|").map((raw) => cityInteger(raw, 1));

        if (
          period.activityType !== 3 ||
          result.periodId !== heroMatchIdentity(period.activityId, period.startTime ?? 0n) ||
          members.length < 1 ||
          members.length > 16 ||
          new Set(members).size !== members.length ||
          !members.includes(authority.kingdomId) ||
          result.matchedAt < (period.startTime ?? 0n) ||
          result.matchedAt > BigInt(now()) ||
          result.matchedAt >= (period.endTime ?? 0n) ||
          (period.serverGroup && period.serverGroup !== result.serverGroup)
        )
          throw new Error("Invalid owned hero match result");

        await tx
          .update(hero_activity)
          .set({ serverGroup: result.serverGroup })
          .where(eq(hero_activity.uuid, id));
        await tx
          .update(hero_event)
          .set({ serverGroup: result.serverGroup })
          .where(and(eq(hero_event.activityId, id), inArray(hero_event.type, [3, 4])));
      });
    },
  };
}
