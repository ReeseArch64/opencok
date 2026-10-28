import { and, asc, desc, eq, gt, inArray, isNull, lte, ne, sql } from "drizzle-orm";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { LegacyActivitySnapshot } from "../contracts/deadline";
import type {
    ActivityDiscoveryReader,
    ActivityDiscoveryBounds,
    ActivityDueCursor,
    ActivityDiscoveryBacklog,
} from "../contracts/discovery";

const dueProjection = {
    id: timed_activity.id,
    ownerId: timed_activity.ownerId,
    queueId: timed_activity.queueId,
    type: timed_activity.type,
    dueAt: timed_activity.dueAt,
    version: timed_activity.version,
};

const legacyProjection = {
    uuid: queue.uuid,
    ownerId: queue.ownerId,
    type: queue.type,
    itemId: queue.itemId,
    startTime: queue.startTime,
    updateTime: queue.updateTime,
};

function validate(types: readonly number[], limit: number, now = 0n): void
{
    if (
        !Number.isInteger(limit) || limit < 1 || limit > 1001 || types.length > 42
        || new Set(types).size !== types.length
        || types.some((type) => !Number.isInteger(type) || type < 0 || type > 41)
        || now < 0n || now >= 9223372036854775807n
    )
    {
        throw new Error("Invalid activity discovery bounds");
    }
}

export class ActivityDiscoveryRepository implements ActivityDiscoveryReader
{
    public constructor(private readonly db: DatabaseClient<"kingdom">)
    {}

    public async bounds(types: readonly number[], now: bigint): Promise<ActivityDiscoveryBounds>
    {
        validate(types, 1, now);
        if (!types.length)
        {
            return { legacy: null, due: null };
        }
        const legacy = await this.legacyQuery(types)
            .orderBy(desc(queue.uuid)).limit(1);
        const due = await this.db.select({ dueAt: timed_activity.dueAt, id: timed_activity.id })
            .from(timed_activity).where(and(
                eq(timed_activity.status, 0),
                inArray(timed_activity.type, [...types]),
                lte(timed_activity.dueAt, now),
            )).orderBy(desc(timed_activity.dueAt), desc(timed_activity.id)).limit(1);

        return { legacy: legacy[0]?.uuid ?? null, due: due[0] ?? null };
    }

    public async legacy(
        types: readonly number[],
        limit: number,
        after?: string,
        through?: string,
    ): Promise<readonly LegacyActivitySnapshot[]>
    {
        validate(types, limit);
        if (!types.length)
        {
            return [];
        }
        const rows = await this.legacyQuery(types, after, through)
            .orderBy(asc(queue.uuid)).limit(limit);

        return rows.map((row) => {
            if (!row.itemId)
            {
                throw new Error("Invalid legacy activity candidate");
            }

            return { ...row, itemId: row.itemId };
        });
    }

    public async due(
        types: readonly number[],
        now: bigint,
        limit: number,
        after?: ActivityDueCursor,
        through?: ActivityDueCursor,
    )
    {
        validate(types, limit, now);
        if (!types.length)
        {
            return [];
        }

        return this.db.select(dueProjection).from(timed_activity).where(and(
            eq(timed_activity.status, 0),
            inArray(timed_activity.type, [...types]),
            lte(timed_activity.dueAt, now),
            after
                ? sql`(${timed_activity.dueAt}, ${timed_activity.id}) > (${after.dueAt}, ${after.id})`
                : undefined,
            through
                ? sql`(${timed_activity.dueAt}, ${timed_activity.id}) <= (${through.dueAt}, ${through.id})`
                : undefined,
        )).orderBy(asc(timed_activity.dueAt), asc(timed_activity.id)).limit(limit);
    }

    public async backlog(types: readonly number[], now: bigint): Promise<ActivityDiscoveryBacklog>
    {
        const legacy = await this.legacy(types, 1001);
        const due = await this.due(types, now, 1001);

        return {
            legacy: legacy.length,
            due: due.length,
            legacyLimited: legacy.length === 1001,
            dueLimited: due.length === 1001,
            oldestDueAt: due[0]?.dueAt ?? null,
        };
    }

    private legacyQuery(types: readonly number[], after?: string, through?: string)
    {
        return this.db.select(legacyProjection).from(queue).leftJoin(
            timed_activity,
            and(eq(timed_activity.queueId, queue.uuid), eq(timed_activity.status, 0)),
        )
            .where(and(
                inArray(queue.type, [...types]),
                isNull(timed_activity.queueId),
                ne(queue.updateTime, 9223372036854775807n),
                ne(queue.itemId, ""),
                after ? gt(queue.uuid, after) : undefined,
                through ? lte(queue.uuid, through) : undefined,
            ));
    }
}
