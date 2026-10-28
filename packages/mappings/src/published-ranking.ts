import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import {
    publishedRankingSchema,
    attributeRankingSchema,
} from "@opencok/validations/published-ranking";
import { validateFields } from "@opencok/messages/validations/fields";

function rows(entries: readonly string[], maximum: number): Fields[]
{
    if (!Array.isArray(entries) || entries.length > maximum)
    {
        throw new Error("Invalid published ranking");
    }

    let bytes = 0;

    return entries.map((entry) => {
        if (typeof entry !== "string" || !entry.isWellFormed())
        {
            throw new Error("Invalid ranking entry");
        }

        bytes += Buffer.byteLength(entry);

        if (bytes > 4 * 1024 * 1024)
        {
            throw new Error("Oversized published ranking");
        }

        return decodeLegacyJsonObject(entry);
    });
}

export function publishedRanking(entries: readonly string[], uid: string, hide: number): Fields
{
    const board = rows(entries, 100);
    let rank = -1;

    for (const row of board)
    {
        if (row.uid?.type !== Type.String || row.rank?.type !== Type.Int)
        {
            throw new Error("Invalid published position");
        }

        if (row.uid.value === uid)
        {
            rank = row.rank.value as number;
        }
    }

    return validateFields(publishedRankingSchema, {
        rankList: sfs.array(board.map((row) => sfs.object(row))),
        myRank: sfs.int(rank),
        myHide: sfs.int(hide),
    });
}

export function attributeRanking(entries: readonly string[], type: number): Fields
{
    return validateFields(attributeRankingSchema, {
        rankMap: sfs.array(rows(entries, type === 0 ? 151 : 30).map((row) => sfs.object(row))),
    });
}
