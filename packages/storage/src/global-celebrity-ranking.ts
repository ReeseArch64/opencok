import { DependencyError } from "@opencok/errors/dependency";

const boards: Readonly<Record<number, { key: string; end: number; }>> = {
    0: { key: "global_kill_ranking", end: 150 },
    1: { key: "global_power_rank", end: 150 },
    2: { key: "global_train_rank", end: 150 },
    3: { key: "global_attack_wins_ranking", end: 150 },
    4: { key: "global_defence_wins_ranking", end: 29 },
    5: { key: "global_power_rank", end: 150 },
    6: { key: "global_honor_point_rank", end: 150 },
    11: { key: "global_military_point_rank", end: 150 },
};

export async function loadGlobalCelebrityRanking(
    command: (command: string, ...args: string[]) => Promise<unknown>,
    kingdomId: number,
    rankType: number,
): Promise<readonly string[]>
{
    if (
        !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2147483647
        || !Number.isInteger(rankType)
        || !Object.hasOwn(boards, rankType)
    )
    {
        throw new DependencyError("global ranking input");
    }

    const board = boards[rankType]!;
    const values = await command("LRANGE", `${board.key}_${kingdomId}`, "0", String(board.end));

    if (!Array.isArray(values) || values.length > board.end + 1)
    {
        throw new DependencyError("global ranking list");
    }

    let bytes = 0;
    const result: string[] = [];

    for (const value of values)
    {
        if (typeof value !== "string" || !value.isWellFormed())
        {
            throw new DependencyError("global ranking value");
        }

        bytes += Buffer.byteLength(value);

        if (bytes > 4 * 1024 * 1024)
        {
            throw new DependencyError("global ranking size");
        }

        result.push(value);
    }

    return result;
}
