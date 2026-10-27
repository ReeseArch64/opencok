import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import type { MutationTransaction } from "./mutation";

export async function pendingOwnedProgression(
  tx: MutationTransaction,
  kingdomId: number,
  endTime: bigint,
  now: bigint,
) {
  const authorized = sql`coalesce(${userprofile.banFlag},0)=0 and coalesce(${userprofile.banTime},0)<=${now} and ${userprofile.serverId}=${kingdomId} and coalesce(${userprofile.crossFightSrcServerId},-1)<=0`;
  const [pending] = await tx
      .select({ id: timed_activity.id })
      .from(timed_activity)
      .innerJoin(userprofile, eq(userprofile.uid, timed_activity.ownerId))
      .where(and(authorized, eq(timed_activity.status, 0), lt(timed_activity.dueAt, endTime)))
      .limit(1),
    [legacy] = await tx
      .select({ id: queue.uuid })
      .from(queue)
      .innerJoin(userprofile, eq(userprofile.uid, queue.ownerId))
      .where(and(authorized, lt(queue.updateTime, endTime), sql`coalesce(${queue.itemId},'')<>''`))
      .limit(1),
    [march] = await tx
      .select({ id: world_march_checkpoint.id })
      .from(world_march_checkpoint)
      .innerJoin(userprofile, eq(userprofile.uid, world_march_checkpoint.ownerUid))
      .where(
        and(
          authorized,
          eq(world_march_checkpoint.status, 0),
          lt(world_march_checkpoint.dueAt, endTime),
        ),
      )
      .limit(1),
    [unregistered] = await tx
      .select({ id: world_march.uuid })
      .from(world_march)
      .innerJoin(userprofile, eq(userprofile.uid, world_march.ownerUid))
      .leftJoin(world_march_checkpoint, eq(world_march_checkpoint.id, world_march.uuid))
      .where(
        and(
          authorized,
          eq(world_march.worldId, 0),
          eq(world_march.type, 0),
          eq(world_march.targetType, 3),
          isNull(world_march_checkpoint.id),
          lt(world_march.marchStartTime, endTime),
        ),
      )
      .limit(1);

  return !!(pending || legacy || march || unregistered);
}
