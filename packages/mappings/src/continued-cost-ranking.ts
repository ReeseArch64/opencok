import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { str } from "@opencok/messages/sfs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { num, text, type Row } from "@opencok/contracts/rows";

export function costRankingEntry(row: Row, rank: number)
{
    cityInteger(rank, 1, 100);
    const score = cityAmount(row.score),
        metadata: unknown = JSON.parse(text(row, "metadata"));

    if (score <= 0n || !metadata || typeof metadata !== "object" || Array.isArray(metadata))
    {
        throw new Error("Invalid consumption ranking metadata");
    }

    const data = metadata as Row,
        uid = text(row, "uid"),
        kingdom = cityInteger(row.kingdomId, 1),
        hide = cityInteger(data.hideKing, 0, 1);

    if (!uid || uid.length > 40 || typeof data.name !== "string" || typeof data.pic !== "string")
    {
        throw new Error("Invalid consumption ranking member");
    }

    const result = `{"uid":${JSON.stringify(uid)},"name":${JSON.stringify(data.name)},"pic":${
        JSON.stringify(data.pic)
    },"picVer":${cityInteger(num(data, "picVer"))},"picfraId":${
        cityInteger(num(data, "picfraId"))
    },"type":${cityInteger(row.type, 1, 6)},"sid":${
        JSON.stringify(String(kingdom))
    },"hideKing":${hide},"val":${score},"rank":${rank}}`;

    if (str(decodeLegacyJsonObject(result), "uid") !== uid)
    {
        throw new Error("Invalid consumption ranking wire identity");
    }

    return result;
}
