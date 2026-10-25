import { and, asc, eq, gt, or, inArray, lte } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type {
  ActivityAction,
  ActivityEconomy,
  ActivityExecutor,
  TimedActivity,
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
export function createActivityExecutor(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  domains: ReadonlyMap<number, ActivityDomain>,
  now = Date.now,
): ActivityExecutor {
  const execute = createMutationExecutor(db, authority, now);
  return (command, plan) =>
    execute(command, async (tx) =>
      executeInventoryTransaction(
        tx,
        command.owner,
        async (inventory) => {
          const captured = BigInt(now());
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
            apply: async (action, activity, economy) => {
              const domain = domains.get(activity.type);
              if (!domain || activity.ownerId !== command.owner)
                throw new Error("Activity domain unavailable");
              return domain(tx, action, activity, captured, economy);
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
            if (command.command !== "queue.ccd" || result.guideStep.length > 255)
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
      ),
    );
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
