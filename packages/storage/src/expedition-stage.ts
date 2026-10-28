import { DependencyError } from "@opencok/errors/dependency";

const stages = new Map([
    ["WAITING_STATE", 0],
    ["MATCHING_STATE", 1],
    ["PREPARING_STATE", 2],
    ["COLLECT_STATE", 3],
    ["KILL_MONSTER_STATE", 4],
    ["BUILDING_STATE", 5],
    ["SCIENCE_STATE", 6],
    ["TRAIN_ARMY_STATE", 7],
    ["FIGHTING_STATE", 8],
]);

export async function loadExpeditionStage(
    command: (command: string, ...args: string[]) => Promise<unknown>,
    kingdomId: number,
): Promise<number | undefined>
{
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    {
        throw new DependencyError("redis");
    }

    const raw = await command("GET", `opencok:global:expedition-match:${kingdomId}`);

    if (raw === null)
    {
        return undefined;
    }

    if (typeof raw !== "string" || Buffer.byteLength(raw) > 65535)
    {
        throw new DependencyError("redis");
    }

    let parsed: unknown;

    try
    {
        parsed = JSON.parse(raw);
    }
    catch
    {
        throw new DependencyError("redis");
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    {
        throw new DependencyError("redis");
    }

    const record = parsed as Record<string, unknown>;

    if (record.serverId !== kingdomId)
    {
        throw new DependencyError("redis");
    }

    if (record.status === undefined)
    {
        return undefined;
    }

    if (typeof record.status !== "string" || !stages.has(record.status))
    {
        throw new DependencyError("redis");
    }

    return stages.get(record.status)!;
}
