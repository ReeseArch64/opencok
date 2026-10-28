import { validateFields } from "./validation.ts";
import { dragonRankingSchema } from "@opencok/validations/dragon-ranking";

import type { DragonRankingTeam } from "@opencok/contracts/dragon-ranking";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeDragonRanking(teams: readonly DragonRankingTeam[]): Fields
{
    return {
        rank: sfs.array(
            teams.map((team) => {
                const wins = team.fightNum === 0 ? 0 : team.winNum / team.fightNum;

                return sfs.object({
                    teamId: sfs.string(team.teamId),
                    allianceId: sfs.string(team.teamId),
                    name: sfs.string(team.name),
                    leader: sfs.string(team.leader),
                    teamState: sfs.int(team.teamState),
                    score: sfs.int(team.score),
                    kingId: sfs.int(team.kingId),
                    kingName: sfs.string(team.kingName),
                    wins: team.fightNum === 0 ? sfs.int(0) : sfs.double(wins),
                    wins2: sfs.int(Math.max(-2147483648, Math.trunc(Math.min(wins * 100, 100)))),
                    curmember: sfs.int(team.curmember),
                    maxmember: sfs.int(team.maxmember),
                    fighting: sfs.int(team.fighting),
                    fightPower: sfs.long(team.fightPower),
                    icon: sfs.string(team.icon),
                    rankNum: sfs.int(team.rankNum),
                    abbr: sfs.string(team.abbr),
                    type: sfs.int(0),
                });
            }),
        ),
    };
}

export function dragonRanking(...args: Parameters<typeof serializeDragonRanking>): Fields
{
    return validateFields(dragonRankingSchema, serializeDragonRanking(...args));
}
