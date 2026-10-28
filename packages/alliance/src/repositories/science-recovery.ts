import { and, asc, eq, sql } from "drizzle-orm";
import { alliance_science_upgrade } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science_upgrade";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export class AllianceScienceRecoveryReader
{
    public constructor(private readonly db: DatabaseClient<"kingdom">)
    {}

    public async due(realm: number, now: bigint, after?: string)
    {
        const { db } = this;

        return db
            .selectDistinctOn([alliance_science_upgrade.allianceId], {
                allianceId: alliance_science_upgrade.allianceId,
                owner: alliance_member.uid,
                scienceId: alliance_science_upgrade.scienceId,
                startTime: alliance_science_upgrade.startTime,
                needTime: alliance_science_upgrade.needTime,
                accelerate: alliance_science_upgrade.accelerate,
            })
            .from(alliance_science_upgrade)
            .innerJoin(
                alliance_member,
                eq(alliance_member.allianceId, alliance_science_upgrade.allianceId),
            )
            .innerJoin(
                userprofile,
                and(
                    eq(userprofile.uid, alliance_member.uid),
                    eq(userprofile.allianceId, alliance_member.allianceId),
                ),
            )
            .where(
                and(
                    eq(userprofile.serverId, realm),
                    sql`coalesce(${userprofile.banFlag},0) = 0`,
                    sql`coalesce(${userprofile.banTime},0) <= ${now}`,
                    sql`${alliance_science_upgrade.startTime} + ${alliance_science_upgrade.needTime} <= ${now}`,
                    after ? sql`${alliance_science_upgrade.allianceId} > ${after}` : undefined,
                ),
            )
            .orderBy(asc(alliance_science_upgrade.allianceId), asc(alliance_member.uid))
            .limit(64);
    }
}
