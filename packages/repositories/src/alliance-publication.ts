import { AllianceScienceRepository } from "@opencok/alliance/repositories/science";
import { AllianceHelpRepository } from "@opencok/alliance/repositories/help";
import { and, eq, inArray } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

export function createAlliancePublicationReader(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
)
{
    return async (id: string, players: readonly string[] = []) => {
        return db.transaction(
            async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [record] = await tx.select().from(alliance).where(eq(alliance.uid, id));
                const members = await tx
                    .select({
                        uid: alliance_member.uid,
                        rank: alliance_member.rank,
                        point: alliance_member.point,
                        accPoint: alliance_member.accPoint,
                        name: userprofile.name,
                    })
                    .from(alliance_member)
                    .innerJoin(
                        userprofile,
                        and(
                            eq(userprofile.uid, alliance_member.uid),
                            eq(userprofile.allianceId, alliance_member.allianceId),
                        ),
                    )
                    .where(
                        and(
                            eq(alliance_member.allianceId, id),
                            eq(userprofile.serverId, authority.kingdomId),
                        ),
                    );
                const queues = members.length
                    ? await tx
                        .select()
                        .from(queue)
                        .where(
                            inArray(
                                queue.ownerId,
                                members.map((row) => row.uid),
                            ),
                        )
                    : [];
                const helps = await AllianceHelpRepository.readPublication(tx, id);
                const sciences = await AllianceScienceRepository.readPublishedSciences(tx, id);
                const research = await AllianceScienceRepository.readPublishedResearch(tx, id);
                const profiles = players.length
                    ? await tx
                        .select({ uid: userprofile.uid, allianceId: userprofile.allianceId })
                        .from(userprofile)
                        .where(
                            and(
                                inArray(userprofile.uid, [...players]),
                                eq(userprofile.serverId, authority.kingdomId),
                            ),
                        )
                    : [];

                return { record, members, queues, helps, sciences, research, profiles };
            },
            { isolationLevel: "repeatable read" },
        );
    };
}
