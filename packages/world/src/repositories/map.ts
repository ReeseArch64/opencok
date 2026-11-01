import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { and, eq, inArray } from "drizzle-orm";

export async function readWorldMap(
    db: DatabaseClient<"kingdom">,
    uid: string,
    ids: number[],
    cosmeticKinds: readonly number[],
)
{
    return db.transaction(
        async (tx) => {
            const world = (
                await tx.select().from(user_world).where(eq(user_world.uid, uid)).limit(1)
            )[0];
            const hasMarches =
                (await tx.select({ uuid: world_march.uuid }).from(world_march).limit(1)).length
                    > 0;
            const points = ids.length
                ? await tx
                    .select()
                    .from(worldpoint)
                    .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
                : [];
            const allianceIds = [
                ...new Set(
                    points.map((row) => row.allianceId).filter((id): id is string => Boolean(id)),
                ),
            ];
            const alliances = allianceIds.length
                ? await tx
                    .select({ uid: alliance.uid, abbr: alliance.abbr })
                    .from(alliance)
                    .where(inArray(alliance.uid, allianceIds))
                    .limit(1025)
                : [];

            if (alliances.length > 1024)
            {
                throw new Error("World alliance projection exceeds bound");
            }

            const owners = [
                ...new Set(
                    points.filter((row) => row.pointType === 1 && row.ownerId).map((row) =>
                        row.ownerId!
                    ),
                ),
            ];
            const cosmetics = owners.length
                ? await tx
                    .select()
                    .from(user_state)
                    .where(
                        and(
                            inArray(user_state.uid, owners),
                            inArray(user_state.type2, [...cosmeticKinds]),
                        ),
                    )
                    .orderBy(user_state.uid, user_state.stateId)
                    .limit(8193)
                : [];

            if (cosmetics.length > 8192)
            {
                throw new Error("World cosmetic projection exceeds bound");
            }

            return { world, hasMarches, points, cosmetics, alliances };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
}
