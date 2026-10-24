import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { DragonRankingTeam } from "@opencok/contracts/dragon-ranking";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeDragonRanking(teams: readonly DragonRankingTeam[]): Fields {
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

export class DragonRankingDto extends createZodDto(
  z.strictObject({
    rank: wire.array(
      wire.object(
        z
          .strictObject({
            teamId: wire.string,
            allianceId: wire.string,
            name: wire.string,
            leader: wire.string,
            kingName: wire.string,
            icon: wire.string,
            abbr: wire.string,
            teamState: wire.int,
            score: wire.int,
            kingId: wire.int,
            wins2: wire.int,
            curmember: wire.int,
            maxmember: wire.int,
            fighting: wire.int,
            rankNum: wire.int,
            type: wire.int,
            fightPower: wire.long,
          })
          .extend({ wins: z.union([wire.int, wire.double]) }),
      ),
    ),
  }),
) {}

export function dragonRanking(...args: Parameters<typeof serializeDragonRanking>): Fields {
  return new DragonRankingDto(serializeDragonRanking(...args));
}
