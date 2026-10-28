import { and, asc, eq } from "drizzle-orm";
import { anniversary_userinfo } from "@opencok/drizzle/schema/opencok_kingdom/anniversary_userinfo";
import { anniversary_allianceinfo } from "@opencok/drizzle/schema/opencok_kingdom/anniversary_allianceinfo";
import { atk_time } from "@opencok/drizzle/schema/opencok_kingdom/atk_time";
import { def_time } from "@opencok/drizzle/schema/opencok_kingdom/def_time";
import { team_atk_time } from "@opencok/drizzle/schema/opencok_kingdom/team_atk_time";
import { atk_name } from "@opencok/drizzle/schema/opencok_kingdom/atk_name";
import { logrecord } from "@opencok/drizzle/schema/opencok_kingdom/logrecord";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type { MutationTransaction } from "./mutation";

export async function readAnniversaryStatistics(tx: MutationTransaction, owner: string)
{
    const [statistics] = await tx
        .select()
        .from(anniversary_userinfo)
        .where(eq(anniversary_userinfo.uid, owner));
    const alliances = await tx.select().from(anniversary_allianceinfo).limit(2);

    if (alliances.length > 1)
    {
        throw new Error("Ambiguous anniversary alliance statistics");
    }

    const [attack] = await tx.select().from(atk_time).where(eq(atk_time.uid, owner));
    const [defend] = await tx.select().from(def_time).where(eq(def_time.uid, owner));
    const [team] = await tx.select().from(team_atk_time).where(eq(team_atk_time.uid, owner));
    const [cached] = await tx.select().from(atk_name).where(eq(atk_name.uid, owner));
    let name = cached?.name;

    if (name == null && attack?.time)
    {
        const attacks = await tx
            .select({ user: logrecord.user })
            .from(logrecord)
            .where(and(eq(logrecord.timeStamp, attack.time), eq(logrecord.data1, owner)))
            .orderBy(asc(logrecord.uid))
            .limit(2);

        if (attacks.length > 1)
        {
            throw new Error("Ambiguous anniversary attack history");
        }

        if (attacks[0])
        {
            const targets = await tx
                .select({ uid: logrecord.data1 })
                .from(logrecord)
                .where(and(eq(logrecord.user, attacks[0].user), eq(logrecord.param1, 2)))
                .orderBy(asc(logrecord.uid))
                .limit(2);

            if (targets.length > 1)
            {
                throw new Error("Ambiguous anniversary target history");
            }

            if (targets[0]?.uid)
            {
                name = (
                    await tx
                        .select({ name: userprofile.name })
                        .from(userprofile)
                        .where(eq(userprofile.uid, targets[0].uid))
                )[0]?.name;
            }
        }
    }

    return {
        statistics: statistics ?? {},
        alliance: alliances[0] ?? {},
        times: {
            attack: attack?.time ?? 0n,
            defend: defend?.time ?? 0n,
            team: team?.time ?? 0n,
            name: name ?? "",
        },
    };
}
