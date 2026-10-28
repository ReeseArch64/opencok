import { and, asc, eq, or, sql } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceQuerySelection } from "../contracts/queries";
import { AllianceQueryCommand } from "../enums/query-command";
import { AllianceMembershipCommand } from "../enums/membership-command";

export class AllianceQueryRepository
{
    public static async directory(
        tx: AllianceTransaction,
        command: string,
        selection: AllianceQuerySelection,
    )
    {
        return selection.key !== undefined && !selection.searchPlayers
            ? await tx
                .select()
                .from(alliance)
                .where(
                    command === AllianceQueryCommand.Abbreviation
                        ? sql`lower(${alliance.abbr})=${selection.key.toLowerCase()}`
                        : ([
                                AllianceQueryCommand.Name,
                                AllianceQueryCommand.CheckName,
                            ] as readonly string[]).includes(command)
                        ? sql`lower(${alliance.alliancename})=${selection.key.toLowerCase()}`
                        : command === AllianceMembershipCommand.Create
                        ? sql`lower(${alliance.abbr})=${
                            [...selection.key].slice(0, 3).join("")
                                .toLowerCase()
                        }`
                        : or(
                            sql`position(${selection.key.toLowerCase()} in lower(${alliance.alliancename})) > 0`,
                            sql`position(${selection.key.toLowerCase()} in lower(${alliance.abbr})) > 0`,
                        ),
                )
                .orderBy(asc(alliance.uid))
                .limit(selection.pageSize ?? 10)
                .offset(
                    ((selection.page ?? 1) - 1) * (selection.pageSize ?? 10),
                )
            : [];
    }

    public static async total(tx: AllianceTransaction, selection: AllianceQuerySelection)
    {
        return selection.key !== undefined && !selection.searchPlayers
            ? BigInt(
                (
                    await tx
                        .select({ total: sql<string>`count(*)::text` })
                        .from(alliance)
                        .where(
                            or(
                                sql`position(${selection.key.toLowerCase()} in lower(${alliance.alliancename})) > 0`,
                                sql`position(${selection.key.toLowerCase()} in lower(${alliance.abbr})) > 0`,
                            ),
                        )
                )[0]!.total,
            )
            : 0n;
    }

    public static async candidates(
        tx: AllianceTransaction,
        selection: AllianceQuerySelection,
        kingdomId: number,
        at: bigint,
    )
    {
        return selection.searchPlayers
            ? await tx
                .select({
                    uid: userprofile.uid,
                    name: userprofile.name,
                    pic: userprofile.pic,
                    picVer: userprofile.picVer,
                    picfraId: userprofile.picfraId,
                    lang: userprofile.lang,
                    power: playerinfo.power,
                    offLineTime: userprofile.offLineTime,
                })
                .from(userprofile)
                .innerJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
                .where(
                    and(
                        eq(userprofile.serverId, kingdomId),
                        sql`coalesce(${userprofile.allianceId},'')=''`,
                        sql`coalesce(${userprofile.banFlag},0)=0`,
                        sql`coalesce(${userprofile.banTime},0)<=${at}`,
                        sql`position(${
                            (selection.key ?? "").toLowerCase()
                        } in lower(${userprofile.name}))>0`,
                    ),
                )
                .orderBy(asc(userprofile.uid))
                .limit(10)
                .offset(((selection.page ?? 1) - 1) * 10)
            : [];
    }
}
