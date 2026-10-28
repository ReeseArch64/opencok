import type { PlayoffTeam } from "@opencok/contracts/battle-ranking";
import type { Row } from "@opencok/contracts/rows";
import { decodePublishedJson } from "@opencok/messages/stored-json";
import { javaDecimal } from "@opencok/rules/java-integer";

function object(value: unknown): Record<string, unknown>
{
    if (!value || typeof value !== "object" || Array.isArray(value))
    {
        throw new Error("Invalid battle object");
    }

    return value as Record<string, unknown>;
}

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);

function string(value: unknown): string
{
    if (value == null)
    {
        return "";
    }

    if (typeof value !== "string")
    {
        throw new Error("Invalid battle text");
    }

    return value;
}

export function decodeFightRanking(raw: string | undefined, teamId: string): Row[]
{
    if (raw === undefined)
    {
        return [];
    }

    const parsed = decodePublishedJson(Buffer.from(raw));

    if (!Array.isArray(parsed) || parsed.length > 4096)
    {
        throw new Error("Invalid battle encounters");
    }

    const matches = parsed
        .map(object)
        .filter((row) => row.teamId === teamId || row.enemyId === teamId);

    if (matches.length > 1)
    {
        throw new Error("Ambiguous battle encounter");
    }

    const match = matches[0];

    if (!match)
    {
        return [];
    }

    const members = Object.values(object(match.fightPlayerMap));

    if (members.length > 32767)
    {
        throw new Error("Oversized fight ranking");
    }

    const result = members
        .map(object)
        .filter((row) => int(row.state) === 1)
        .map((row) => ({
            rankNum: int(row.rankNum),
            id: string(row.id),
            teamId: string(row.teamId),
            name: string(row.name),
            winNum: int(row.winNum),
            failNum: int(row.failNum),
            killNum: Number(BigInt.asIntN(32, long(row.killNum))),
            score: int(row.score),
            awardNum: int(row.awardNum),
            holdNum: int(row.holdNum),
            campType: int(row.camp),
        }));

    if (
        result.some((row) => !row.id || ![match.teamId, match.enemyId].includes(row.teamId))
        || new Set(result.map((row) => row.id)).size !== result.length
    )
    {
        throw new Error("Invalid fight members");
    }

    return result.sort((a, b) => a.rankNum - b.rankNum || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function decodePlayoffTeams(raws: readonly string[]): PlayoffTeam[]
{
    if (raws.length > 64)
    {
        throw new Error("Oversized playoff");
    }

    const teams = raws.map((raw) => {
        const row = object(decodePublishedJson(Buffer.from(raw)));

        if (
            !Array.isArray(row.results)
            || row.results.length < 3
            || row.results.length > 6
            || !Array.isArray(row.enemyIds)
            || row.enemyIds.length !== 6
        )
        {
            throw new Error("Invalid playoff rounds");
        }

        return {
            teamId: string(row.teamId),
            name: string(row.teamName),
            kingId: int(row.kingId),
            kingName: string(row.kingName),
            abbr: string(row.abbr),
            icon: string(row.icon),
            curmember: int(row.curmember),
            fighting: int(row.fighting),
            fightPower: long(row.fightPower),
            rankNum: int(row.rankNum),
            groupId: int(row.groupId),
            index: int(row.index),
            score: int(row.score),
            results: row.results.map(int),
            enemyIds: row.enemyIds.map((value) => (value == null ? null : string(value))),
            curEnemyId: row.curEnemyId == null ? null : string(row.curEnemyId),
        };
    });

    if (
        teams.some((team) => !team.teamId || team.index < 0 || team.index > 11)
        || new Set(teams.map((team) => team.teamId)).size !== teams.length
    )
    {
        throw new Error("Invalid playoff teams");
    }

    return teams;
}
