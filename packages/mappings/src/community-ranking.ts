import type {
    CommunityRankingSnapshot,
    DonationRankingKind,
    DonationScore,
} from "@opencok/contracts/community-ranking";
import type { Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { javaDecimal } from "@opencok/rules/java-integer";
import { donationRankingRows, rankingCalendar } from "@opencok/rules/community-ranking";
import {
    donationRankingSchema,
    resourceDonationRankingSchema,
    cemeteryRankingSchema,
} from "@opencok/validations/community-ranking";
import { validateFields } from "@opencok/messages/validations/fields";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);

function appearance(row: Row): Fields
{
    const result: Fields = {};

    for (const key of ["uid", "name", "pic"])
    {
        result[key] = sfs.string(String(row[key] ?? ""));
    }

    result.picVer = sfs.int(int(row.picVer));
    result.picfraId = sfs.int(int(row.picfraId));

    return result;
}

function member(row: Row): Fields
{
    return { ...appearance(row), power: sfs.long(long(row.power)), rank: sfs.int(int(row.rank)) };
}

export function donationRanking(
    snapshot: CommunityRankingSnapshot,
    kind: DonationRankingKind,
    now: number,
): Fields
{
    const rows = donationRankingRows(snapshot.rows, kind, now);
    const donateRank = sfs.array(
        rows.map((row) => {
            const fields: Fields = kind === "all"
                ? {
                    donateTime: sfs.long(long(row.donateTime)),
                    alliance_honor: sfs.int(int(row.honor)),
                    donation: sfs.int(int(row.donation)),
                    ...member(row),
                }
                : member(row);

            if (kind === "today")
            {
                Object.assign(fields, {
                    donateTime: sfs.long(long(row.donateTime)),
                    alliance_honor: sfs.int(int(row.honor)),
                    donation: sfs.int(int(row.donation)),
                });
            }

            if (kind === "week")
            {
                fields.allianceId = sfs.string(String(row.allianceId ?? ""));

                if (row.historyUid != null)
                {
                    Object.assign(fields, {
                        alliance_honor: sfs.int(int(row.honor)),
                        donation: sfs.int(int(row.donation)),
                    });
                }
            }

            if (kind !== "today")
            {
                fields.key = sfs.int(int(row.key));
            }

            return sfs.object(fields);
        }),
    );
    const result: Fields = { donateRank };

    if (kind === "today")
    {
        result.refreshTime = sfs.long(rankingCalendar(now).nextDay);
    }

    if (kind === "week")
    {
        return validateFields(donationRankingSchema, {
            refreshTime: sfs.long(rankingCalendar(now).nextMonday),
            donateRank,
        });
    }

    return validateFields(donationRankingSchema, result);
}

export function resourceDonationRanking(
    snapshot: CommunityRankingSnapshot,
    scores: readonly DonationScore[],
    weekly: boolean,
    now: number,
): Fields
{
    if (scores.length > 101 || snapshot.rows.length > 32767)
    {
        throw new Error("Oversized donation ranking");
    }

    const index = new Map(
        snapshot.rows.filter((row) => row.profileUid != null).map((row) => [String(row.uid), row]),
    );
    const shown = new Set<string>();
    const ranks = scores.flatMap((score) => {
        const row = index.get(score.uid);

        if (!row)
        {
            return [];
        }

        shown.add(score.uid);

        return [sfs.object({ ...member(row), score: sfs.double(score.score) })];
    });

    for (const [uid, row] of index)
    {
        if (!shown.has(uid))
        {
            ranks.push(sfs.object({ ...member(row), score: sfs.double(0) }));
        }
    }

    const result: Fields = { ranks: sfs.array(ranks) };

    if (weekly)
    {
        result.weekendTime = sfs.long(rankingCalendar(now).nextMonday);
    }

    return validateFields(resourceDonationRankingSchema, result);
}

export function cemeteryRanking(snapshot: CommunityRankingSnapshot, uid: string): Fields
{
    if (snapshot.rows.length > 100)
    {
        throw new Error("Oversized cemetery ranking");
    }

    const self = snapshot.ownItems ? snapshot.rows.findIndex((row) => row.uid === uid) + 1 : 0;
    const rows = snapshot.rows
        .filter(
            (row) =>
                row.profileUid != null
                && (!String(row.allianceId ?? "").trim() || row.foundAlliance != null),
        )
        .slice(0, 49);

    return validateFields(cemeteryRankingSchema, {
        myRanking: sfs.int(self),
        serverRanking: sfs.array(
            rows.map((row) => {
                const result = appearance(row);

                if (String(row.allianceId ?? "").trim())
                {
                    for (const key of ["allianceId", "abbr", "alliancename"])
                    {
                        result[key] = sfs.string(String(row[key] ?? ""));
                    }
                }

                result.useItemSum = sfs.int(int(row.useItemSum));
                result.deadSum = sfs.long(long(row.deadSum));

                return sfs.object(result);
            }),
        ),
    });
}
