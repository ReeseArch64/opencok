import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";

function kingdom(id: number, win: number, servers: readonly Row[])
{
    const row = servers.find((server) => num(server, "Id") === id);

    return row ? { serverId: id, name: text(row, "name"), banner: text(row, "banner"), win } : {};
}

export function expeditionHistorySnapshot(result: Row)
{
    const raw: unknown = JSON.parse(text(result, "ranking"));

    if (
        !raw
        || typeof raw !== "object"
        || !("users" in raw)
        || !Array.isArray(raw.users)
        || raw.users.length > 10
    )
    {
        throw new Error("Invalid expedition final history");
    }

    const userlist: Row[] = [];

    for (const row of raw.users)
    {
        if (!row || typeof row !== "object" || typeof row.uid !== "string" || !row.metadata)
        {
            break;
        }

        let value: unknown;

        try
        {
            value = JSON.parse(row.metadata);
        }
        catch
        {
            break;
        }

        if (
            !value
            || typeof value !== "object"
            || !("name" in value)
            || typeof value.name !== "string"
            || !("abbr" in value)
            || typeof value.abbr !== "string"
        )
        {
            break;
        }

        const metadata = value as Row;
        userlist.push({
            uid: row.uid,
            name: metadata.name!,
            ...(typeof metadata.pic === "string" ? { pic: metadata.pic } : {}),
            ...(typeof metadata.picVer === "number"
                ? { picVer: metadata.picVer, picfraId: num(metadata, "picfraId") }
                : {}),
            abbr: metadata.abbr!,
            serverId: num(metadata, "serverId"),
            ranking: userlist.length + 1,
        });
    }

    const winner = num(result, "winner"),
        loser = winner === num(result, "leader") ? num(result, "opponent") : num(result, "leader");

    return JSON.stringify({
        stage: num(result, "stage"),
        begintime: String(long(result, "finalizedAt")),
        userlist,
        winServerId: winner,
        loseServerId: loser,
    });
}

function users(raw: unknown): Fields[]
{
    if (!Array.isArray(raw) || raw.length > 10)
    {
        throw new Error("Invalid expedition history users");
    }

    return raw.map((row): Fields => {
        if (
            !row
            || typeof row !== "object"
            || typeof row.uid !== "string"
            || typeof row.name !== "string"
            || typeof row.abbr !== "string"
            || !Number.isInteger(row.serverId)
            || !Number.isInteger(row.ranking)
        )
        {
            throw new Error("Invalid expedition history member");
        }

        return {
            uid: sfs.string(row.uid),
            name: sfs.string(row.name),
            ...(typeof row.pic === "string" ? { pic: sfs.string(row.pic) } : {}),
            ...(Number.isInteger(row.picVer) ? { picVer: sfs.int(row.picVer) } : {}),
            ...(Number.isInteger(row.picfraId) ? { picfraId: sfs.int(row.picfraId) } : {}),
            abbr: sfs.string(row.abbr),
            serverId: sfs.int(row.serverId),
            ranking: sfs.int(row.ranking),
        };
    });
}

function kingdoms(raw: unknown): Fields[]
{
    if (!Array.isArray(raw) || raw.length !== 2)
    {
        throw new Error("Invalid expedition history kingdoms");
    }

    return raw.map((row): Fields => {
        if (!row || typeof row !== "object")
        {
            throw new Error("Invalid expedition history kingdom");
        }

        if (Object.keys(row).length === 0)
        {
            return {};
        }

        if (
            !Number.isInteger(row.serverId)
            || typeof row.name !== "string"
            || typeof row.banner !== "string"
            || ![0, 1].includes(row.win)
        )
        {
            throw new Error("Invalid expedition history kingdom");
        }

        return {
            serverId: sfs.int(row.serverId),
            name: sfs.string(row.name),
            banner: sfs.string(row.banner),
            win: sfs.int(row.win),
        };
    });
}

export function expeditionHistory(rows: readonly Row[], servers: readonly Row[]): Fields
{
    return {
        ranklist: sfs.array(
            rows.map((row) => {
                let stage = num(row, "stageId"),
                    at = long(row, "createTime"),
                    userlist: unknown,
                    kingdomlist: unknown;

                if (row.history)
                {
                    const value: unknown = JSON.parse(text(row, "history"));

                    if (
                        !value
                        || typeof value !== "object"
                        || !("stage" in value)
                        || !("begintime" in value)
                        || !("userlist" in value)
                        || !("winServerId" in value)
                        || !("loseServerId" in value)
                        || !Number.isInteger(value.winServerId)
                        || !Number.isInteger(value.loseServerId)
                        || typeof value.begintime !== "string"
                        || !/^\d{1,19}$/.test(value.begintime)
                    )
                    {
                        throw new Error("Invalid owned expedition history");
                    }

                    stage = Number(value.stage);
                    at = BigInt(value.begintime);
                    userlist = value.userlist;
                    kingdomlist = [
                        kingdom(Number(value.winServerId), 1, servers),
                        kingdom(Number(value.loseServerId), 0, servers),
                    ];
                }
                else
                {
                    userlist = JSON.parse(text(row, "users"));
                    kingdomlist = [
                        kingdom(num(row, "winServerId"), 1, servers),
                        kingdom(num(row, "loseServerId"), 0, servers),
                    ];
                }

                if (!Number.isInteger(stage) || stage < 0 || stage > 8 || at < 0n)
                {
                    throw new Error("Invalid expedition history stage");
                }

                return sfs.object({
                    stage: sfs.int(stage),
                    begintime: sfs.long(at),
                    userlist: sfs.array(users(userlist).map(sfs.object)),
                    kingdomlist: sfs.array(kingdoms(kingdomlist).map(sfs.object)),
                });
            }),
        ),
    };
}
