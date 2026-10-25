import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { and, asc, eq, gt, or, inArray, lte, isNull, ne } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type {
  ActivityAction,
  ActivityEconomy,
  ActivityExecutor,
  TimedActivity,
  PreparedActivity,
} from "@opencok/contracts/timed-activity";
import { long, num, text } from "@opencok/contracts/rows";
import { createMutationExecutor, type MutationTransaction } from "./mutation";
import { executeInventoryTransaction } from "./inventory";
import type { Database } from "./game";
import type { RealmAuthority } from "./realm-authority";

export type ActivityDomain = (
  tx: MutationTransaction,
  action: ActivityAction,
  activity: TimedActivity,
  now: bigint,
  economy: ActivityEconomy,
) => Promise<Uint8Array>;
export interface ActivityPreparation {
  accelerate?(
    tx: MutationTransaction,
    activity: TimedActivity,
    remaining: bigint,
    now: bigint,
    economy: ActivityEconomy,
  ): Promise<void>;
  next?(
    tx: MutationTransaction,
    activity: TimedActivity,
    now: bigint,
    economy: ActivityEconomy,
  ): Promise<PreparedActivity | undefined>;
  before?(
    tx: MutationTransaction,
    owner: string,
    now: bigint,
    command: import("@opencok/contracts/mutation").MutationCommand,
  ): Promise<void | bigint>;
  command(
    tx: MutationTransaction,
    owner: string,
    command: string,
    params: Uint8Array,
    now: bigint,
    economy: ActivityEconomy,
  ): Promise<PreparedActivity>;
}
export function createActivityExecutor(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  domains: ReadonlyMap<number, ActivityDomain>,
  now = Date.now,
  preparation?: ActivityPreparation,
): ActivityExecutor {
  const execute = createMutationExecutor(db, authority, now);
  return (command, plan) =>
    execute(command, async (tx) => {
      const captured = BigInt(now());
      const preparedAt = await preparation?.before?.(tx, command.owner, captured, command);
      const domainInstant = typeof preparedAt === "bigint" ? preparedAt : captured;
      if (domainInstant < 0n || domainInstant > captured)
        throw new Error("Invalid activity domain clock");
      return executeInventoryTransaction(
        tx,
        command.owner,
        async (inventory) => {
          const queues = await tx
            .select()
            .from(queue)
            .where(eq(queue.ownerId, command.owner))
            .orderBy(asc(queue.uuid))
            .limit(257)
            .for("update");
          const activities = await tx
            .select()
            .from(timed_activity)
            .where(and(eq(timed_activity.ownerId, command.owner), eq(timed_activity.status, 0)))
            .orderBy(asc(timed_activity.id))
            .limit(257)
            .for("update");
          if (queues.length > 256 || activities.length > 256)
            throw new Error("Activity aggregate exceeds bound");
          const result = await plan({
            ...inventory,
            now: captured,
            queues,
            activities,
            accelerate: preparation?.accelerate
              ? (activity, remaining, economy) =>
                  preparation.accelerate!(tx, activity, remaining, domainInstant, economy)
              : undefined,
            next: preparation?.next
              ? (activity, economy) => preparation.next!(tx, activity, domainInstant, economy)
              : undefined,
            prepare: preparation
              ? (name, params, economy) =>
                  preparation.command(tx, command.owner, name, params, captured, economy)
              : undefined,
            apply: async (action, activity, economy) => {
              const domain = domains.get(activity.type);
              if (!domain || activity.ownerId !== command.owner)
                throw new Error("Activity domain unavailable");
              return domain(tx, action, activity, domainInstant, economy);
            },
          });
          if (
            result.queues.length > 256 ||
            result.activities.length > 256 ||
            new Set(result.activities.map((row) => row.id)).size !== result.activities.length ||
            new Set(result.queues.map((row) => row.uuid)).size !== result.queues.length
          )
            throw new Error("Invalid activity write set");
          if (result.guideStep !== undefined) {
            if (
              !["queue.ccd", "army.add", "army.complete", "army.cd"].includes(command.command) ||
              result.guideStep.length > 255
            )
              throw new Error("Invalid activity guide step");
            await tx
              .update(userprofile)
              .set({ guideStep: result.guideStep })
              .where(eq(userprofile.uid, command.owner));
          }
          for (const activity of result.activities) {
            if (
              activity.ownerId !== command.owner ||
              !queues.some((row) => row.uuid === activity.queueId && row.type === activity.type)
            )
              throw new Error("Invalid activity owner");
            const before = activities.find((row) => row.id === activity.id);
            if (before) {
              if (
                before.queueId !== activity.queueId ||
                before.itemId !== activity.itemId ||
                JSON.stringify(before.data ?? null) !== JSON.stringify(activity.data ?? null) ||
                activity.version !== before.version + 1
              )
                throw new Error("Invalid activity transition");
              const changed = await tx
                .update(timed_activity)
                .set(activity)
                .where(
                  and(
                    eq(timed_activity.id, activity.id),
                    eq(timed_activity.version, before.version),
                    eq(timed_activity.status, 0),
                  ),
                )
                .returning({ id: timed_activity.id });
              if (changed.length !== 1) throw new Error("Stale activity transition");
            } else {
              if (activity.version !== 1 || activity.status !== 0)
                throw new Error("Invalid activity creation");
              await tx.insert(timed_activity).values(activity);
            }
          }
          for (const row of result.queues) {
            const before = queues.find((value) => value.uuid === row.uuid);
            if (
              !before &&
              command.command === "queue.open" &&
              text(row, "ownerId") === command.owner &&
              num(row, "type") === 0 &&
              num(row, "qid") >= 2 &&
              long(row, "updateTime") === 9223372036854775807n &&
              !queues.some((value) => value.type === 0 && value.qid === num(row, "qid"))
            ) {
              await tx.insert(queue).values({
                uuid: text(row, "uuid"),
                ownerId: command.owner,
                qid: num(row, "qid"),
                type: 0,
                itemId: "",
                startTime: long(row, "startTime"),
                endTime: long(row, "endTime"),
                updateTime: long(row, "updateTime"),
                totalTime: 0n,
                isHelped: 0,
                para: 0,
              });
              continue;
            }
            if (
              !before ||
              text(row, "ownerId") !== command.owner ||
              num(row, "type") !== before.type ||
              num(row, "qid") !== before.qid
            )
              throw new Error("Queue identity changed");
            await tx
              .update(queue)
              .set({
                itemId: text(row, "itemId"),
                startTime: long(row, "startTime"),
                endTime: long(row, "endTime"),
                updateTime: long(row, "updateTime"),
                totalTime: long(row, "totalTime"),
                isHelped: num(row, "isHelped"),
                para: num(row, "para"),
              })
              .where(and(eq(queue.uuid, before.uuid), eq(queue.ownerId, command.owner)));
          }
          return result;
        },
        command.command,
      );
    });
}
export async function dueActivities(
  db: Database["kingdom"]["db"],
  types: readonly number[],
  now: bigint,
  limit = 64,
  owner?: string,
  after?: Pick<TimedActivity, "dueAt" | "id">,
) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 256)
    throw new Error("Invalid recovery limit");
  if (!types.length) return [];
  return db
    .select()
    .from(timed_activity)
    .where(
      and(
        eq(timed_activity.status, 0),
        owner ? eq(timed_activity.ownerId, owner) : undefined,
        inArray(timed_activity.type, [...types]),
        lte(timed_activity.dueAt, now),
        after
          ? or(
              gt(timed_activity.dueAt, after.dueAt),
              and(eq(timed_activity.dueAt, after.dueAt), gt(timed_activity.id, after.id)),
            )
          : undefined,
      ),
    )
    .orderBy(asc(timed_activity.dueAt), asc(timed_activity.id))
    .limit(limit);
}

export async function unregisteredActivities(
  db: Database["kingdom"]["db"],
  types: readonly number[],
  limit = 64,
  owner?: string,
  after?: string,
) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 256)
    throw new Error("Invalid activity import limit");
  if (!types.length) return [];
  return db
    .select({
      uuid: queue.uuid,
      ownerId: queue.ownerId,
      itemId: queue.itemId,
      startTime: queue.startTime,
      updateTime: queue.updateTime,
    })
    .from(queue)
    .leftJoin(
      timed_activity,
      and(eq(timed_activity.queueId, queue.uuid), eq(timed_activity.status, 0)),
    )
    .where(
      and(
        inArray(queue.type, [...types]),
        owner ? eq(queue.ownerId, owner) : undefined,
        after ? gt(queue.uuid, after) : undefined,
        isNull(timed_activity.id),
        ne(queue.updateTime, 9223372036854775807n),
        ne(queue.itemId, ""),
      ),
    )
    .orderBy(asc(queue.uuid))
    .limit(limit);
}

export async function activityTransitionInstant(
  tx: MutationTransaction,
  owner: string,
  queueId: string | undefined,
  now: bigint,
): Promise<bigint> {
  if (!queueId) return now;
  const [active] = await tx
    .select({ dueAt: timed_activity.dueAt })
    .from(timed_activity)
    .where(
      and(
        eq(timed_activity.ownerId, owner),
        eq(timed_activity.queueId, queueId),
        eq(timed_activity.status, 0),
      ),
    );
  if (!active || active.dueAt >= now) return now;
  const [resource] = await tx
    .select({ at: user_resource.lastUpdateTime })
    .from(user_resource)
    .where(eq(user_resource.uid, owner));
  const checkpoints = await tx
    .select({ at: building_production.settledAt })
    .from(building_production)
    .where(eq(building_production.ownerId, owner))
    .limit(257);
  const buildings = await tx
    .select({ at: user_building.refreshTime })
    .from(user_building)
    .where(
      and(
        eq(user_building.uid, owner),
        inArray(user_building.itemId, [412000, 413000, 414000, 415000]),
      ),
    )
    .limit(257);
  if (checkpoints.length > 256 || buildings.length > 256)
    throw new Error("Activity checkpoint aggregate exceeds bound");
  let at = active.dueAt;
  for (const row of [...checkpoints, ...buildings, { at: resource?.at ?? 0n }])
    if ((row.at ?? 0n) > at) at = row.at!;
  if (at > now) throw new Error("Activity clock moved backwards");
  return at;
}
