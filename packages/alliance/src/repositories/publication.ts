import { AllianceScienceRepository } from "./science";
import { AllianceHelpRepository } from "./help";
import { and, eq, inArray } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { AllianceTransaction } from "../contracts/persistence";

export class AlliancePublicationRepository
{
    public constructor(
        private readonly db: DatabaseClient<"kingdom">,
        private readonly kingdomId: number,
        private readonly fence: (tx: AllianceTransaction) => Promise<void>,
    )
    {}

    public async read(id: string, players: readonly string[] = [])
    {
        return this.db.transaction(
            async (tx) => {
                await this.fence(tx);
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
                            eq(userprofile.serverId, this.kingdomId),
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
                                eq(userprofile.serverId, this.kingdomId),
                            ),
                        )
                    : [];

                return { record, members, queues, helps, sciences, research, profiles };
            },
            { isolationLevel: "repeatable read" },
        );
    }
}
