import { and, asc, eq, gt, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_interest } from "@opencok/drizzle/schema/opencok_kingdom/world_interest";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_territory } from "@opencok/drizzle/schema/opencok_kingdom/alliance_territory";
import type { WorldUtilityStore } from "@opencok/contracts/world-utility";
import type { Database } from "./game";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

export function createWorldUtilityStore(
    db: Database["kingdom"]["db"],
    authority: RealmAuthority,
    size: number,
): WorldUtilityStore
{
    return {
        read: (owner, point, alliance) =>
            db.transaction(
                async (tx) => {
                    const [profile] = await tx.select().from(userprofile).where(
                        eq(userprofile.uid, owner),
                    );
                    const [world] = await tx.select().from(user_world).where(
                        eq(user_world.uid, owner),
                    );
                    const points = point !== undefined && point > 0
                        ? await tx
                            .select()
                            .from(worldpoint)
                            .where(
                                sql`${worldpoint.worldId}=0 AND ${worldpoint.x} BETWEEN ${
                                    Math.max(0, ((point - 1) % size) - 8)
                                } AND ${
                                    Math.min(size - 1, ((point - 1) % size) + 8)
                                } AND ${worldpoint.y} BETWEEN ${
                                    Math.max(0, Math.floor((point - 1) / size) - 8)
                                } AND ${Math.min(size - 1, Math.floor((point - 1) / size) + 8)}`,
                            )
                            .orderBy(asc(worldpoint.id))
                            .limit(290)
                        : [];
                    const members = alliance && profile?.allianceId
                        ? await tx
                            .select({
                                uid: alliance_member.uid,
                                allianceId: alliance_member.allianceId,
                                rank: alliance_member.rank,
                                pointId: user_world.pointId,
                                worldId: user_world.worldId,
                            })
                            .from(alliance_member)
                            .innerJoin(user_world, eq(user_world.uid, alliance_member.uid))
                            .where(eq(alliance_member.allianceId, profile.allianceId))
                            .orderBy(asc(alliance_member.uid))
                            .limit(1001)
                        : [];
                    const territories = alliance && profile?.allianceId
                        ? await tx
                            .select({ pointId: alliance_territory.pointId })
                            .from(alliance_territory)
                            .where(
                                and(
                                    eq(alliance_territory.allianceId, profile.allianceId),
                                    eq(alliance_territory.atWorldId, 0),
                                    eq(alliance_territory.type, 14),
                                    gt(alliance_territory.pointId, 0),
                                ),
                            )
                            .orderBy(asc(alliance_territory.uid))
                            .limit(1001)
                        : [];

                    if (points.length > 289 || members.length > 1000 || territories.length > 1000)
                    {
                        throw new Error("World utility snapshot exceeds bound");
                    }

                    return { profile, world, points, members, territories };
                },
                { isolationLevel: "repeatable read", accessMode: "read only" },
            ),
        async leave(owner)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [world] = await tx.select().from(user_world).where(eq(user_world.uid, owner));

                if (!world || world.worldId !== 0)
                {
                    throw new Error("Missing resident world owner");
                }

                await tx.delete(world_interest).where(eq(world_interest.ownerUid, owner));
            });
        },
    };
}
