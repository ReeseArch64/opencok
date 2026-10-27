import { createTotemEffectStore } from "@opencok/repositories/totem";
import { settleTotemEffects } from "@opencok/services/totem";
import { ProductionService } from "@opencok/services/production";
import { createProductionExecutor } from "@opencok/repositories/production";
import { randomUUID } from "node:crypto";
import { cityQueueCommands } from "@opencok/rules/city-command";
import { activityTransitionInstant } from "@opencok/repositories/timed-activity";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { createActivityExecutor, type ActivityDomain } from "@opencok/repositories/timed-activity";
import { createCityProgressionStore } from "@opencok/repositories/city-progression";
import { createCityProductionBoundary } from "@opencok/repositories/city-production";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { persistReconnectProgress } from "@opencok/repositories/reconnect-write";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { productionContext } from "@opencok/services/production-context";
import { createCityProgressionHandlers, type CityDomain } from "@opencok/services/city-progression";
import { constructionDomain } from "@opencok/services/construction";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { loadRules } from "@opencok/resources/rules";
import { num, text } from "@opencok/contracts/rows";
import { sfs, str, decode, type Fields } from "@opencok/messages/sfs";
import { eq } from "drizzle-orm";
import { DisposablePostgres } from "../../../../packages/drizzle/tests/support/postgres";

export async function cityHarness(extra: readonly CityDomain[] = [], totems = false) {
  const pg = new DisposablePostgres();
  const admin = await pg.start();
  await admin.query('CREATE DATABASE "city"');
  await admin.end();
  const db = createDatabase("kingdom", { ...pg.options, database: "city", max: 8 });
  const close = async () => {
    await db.close();
    await pg.stop();
  };
  try {
    await migrate(db.db, {
      migrationsFolder: new URL("../../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const rules = await loadRules();
    let now = 1000000;
    const effects = { world: async () => new Map<number, number>(), emperor: async () => null };
    const authority = await acquireRealmAuthority(db.db, 1, () => true);
    for (const owner of ["owner", "other"]) {
      await db.db.insert(userprofile).values({
        uid: owner,
        name: "Synthetic",
        country: "BR",
        serverId: 1,
        level: 1,
        exp: 0,
        gold: 100000n,
      });
      await db.db.insert(user_resource).values({
        uid: owner,
        wood: 1000000n,
        food: 1000000n,
        stone: 1000000n,
        iron: 1000000n,
        silver: 1000000,
        chip: 0,
        diamond: 0,
        dragon_food: 0,
        dragon_gold: 0,
        lastUpdateTime: BigInt(now),
      });
      let power = 0n;
      for (const [itemId, pos] of [
        [400000, 0],
        [419000, 1],
        [403000, 6],
        [423000, 10],
        [416000, 7],
        [411000, 18],
        [410000, 19],
        [413000, 17],
      ] as const) {
        await db.db.insert(user_building).values({
          uuid: `${owner}-${itemId}`,
          uid: owner,
          itemId,
          pos,
          level: 1,
          refreshTime: BigInt(now),
          opType: 0,
        });
        power += BigInt(rules.building(String(itemId), 1).power ?? 0);
      }
      await db.db.insert(playerinfo).values({
        uid: owner,
        power: power + BigInt(rules.role(1).power ?? 0),
        buildingPower: power,
      });
      for (const type of [0, 1, 2, 3, 6, 8, 9, 10, 11, 12])
        await db.db.insert(queue).values({
          uuid: `${owner}-q${type}`,
          ownerId: owner,
          qid: 1,
          type,
          itemId: "",
          startTime: idleDeadline,
          endTime: idleDeadline,
          updateTime: idleDeadline,
          totalTime: 0n,
        });
    }
    const basePreparation = {
      async prepare(tx: Parameters<typeof readReconnectProgress>[0], owner: string, at: bigint) {
        const state = await readReconnectProgress(tx, owner, 1, at);
        const planned = await productionContext(state, rules, at, {
          worldPowerEffects: async () => new Map<string, string>(),
          emperorVersion: async () => null,
        });
        await persistReconnectProgress(tx, state, planned.write, authority, at);
        return planned.rates;
      },
    };
    const baseBoundary = createCityProductionBoundary(basePreparation, (row) => {
      const rule = rules.building(
        text(row, "itemId"),
        num(row, "level"),
        num(row, "star"),
        num(row, "progress"),
      );
      return rule.effects?.productionPerHour === undefined
        ? undefined
        : ["wood", "stone", "iron", "food"][rule.effects.productionResourceId ?? -1];
    });
    const prepareTotems = async (
      tx: Parameters<typeof readReconnectProgress>[0],
      owner: string,
      at: bigint,
    ) => {
      if (totems)
        await settleTotemEffects(
          createTotemEffectStore(tx, owner, at, 1200, 1, baseBoundary),
          rules,
          1200,
        );
    };
    const boundary: typeof baseBoundary = async (tx, owner, at, change, deleted, economy) => {
      await prepareTotems(tx, owner, at);
      return baseBoundary(tx, owner, at, change, deleted, economy);
    };
    const preparation = {
      async prepare(tx: Parameters<typeof readReconnectProgress>[0], owner: string, at: bigint) {
        await prepareTotems(tx, owner, at);
        return basePreparation.prepare(tx, owner, at);
      },
    };
    const handlers = createCityProgressionHandlers(
      (tx: Parameters<typeof readReconnectProgress>[0], owner, at) =>
        createCityProgressionStore(tx, owner, at, boundary),
      [constructionDomain, ...extra],
      rules,
      effects,
    );
    const service = new TimedActivityService(
      createActivityExecutor(
        db.db,
        authority,
        handlers.domains as ReadonlyMap<number, ActivityDomain>,
        () => now,
        {
          before: async (tx, owner, at, command) => {
            if (command.command === "activity.restore") return at;
            const transition =
              ["queue.finish", "queue.ccd"].includes(command.command) ||
              cityQueueCommands[command.command]?.action === "queue.finish";
            const params = decode(Buffer.from(command.request));
            const queueId = transition
              ? str(
                  params,
                  cityQueueCommands[command.command]?.queueKey ??
                    (command.command === "queue.ccd" ? "qUUID" : "uuid"),
                )
              : undefined;
            const instant = await activityTransitionInstant(tx, owner, queueId, at);
            await preparation.prepare(tx, owner, instant);
            return instant;
          },
          command: handlers.command,
          next: handlers.next,
          accelerate: handlers.accelerate,
        },
      ),
      rules,
      effects,
    );
    const command = (name: string, params: Fields, owner = "owner") =>
      service.domainCommand(owner, name, {
        ...params,
        operationId: params.operationId ?? sfs.string(randomUUID()),
      });
    const active = async (type: number, owner = "owner") =>
      (await db.db.select().from(timed_activity)).find(
        (row) => row.ownerId === owner && row.type === type && row.status === 0,
      )!;
    const finish = async (type: number, owner = "owner") => {
      const activity = await active(type, owner);
      now = Math.max(now, Number(activity.dueAt));
      return service.command(owner, "queue.finish", {
        uuid: sfs.string(activity.queueId),
        activityId: sfs.string(activity.id),
        version: sfs.int(activity.version),
        operationId: sfs.string(randomUUID()),
      });
    };
    const building = async (id: string) =>
      (await db.db.select().from(user_building).where(eq(user_building.uuid, id)))[0];
    return {
      db,
      rules,
      service,
      production: new ProductionService(
        createProductionExecutor(db.db, authority, preparation, () => now),
        rules,
        effects,
      ),
      authority,
      handlers,
      effects,
      preparation,
      command,
      active,
      finish,
      building,
      close,
      clock: {
        get now() {
          return now;
        },
        set now(value: number) {
          now = value;
        },
      },
    };
  } catch (error) {
    await close();
    throw error;
  }
}
