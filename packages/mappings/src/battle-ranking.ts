import type { PlayoffTeam, PlayoffPublication } from "@opencok/contracts/battle-ranking";
import type { Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { fightRankingSchema, playoffRankingSchema } from "@opencok/validations/battle-ranking";
import { playoffBattleStart, playoffTimes, playoffPairs } from "@opencok/rules/battle-ranking";
import { validateFields } from "@opencok/messages/validations/fields";

export function fightRanking(rows?: readonly Row[]): Fields
{
    return validateFields(
        fightRankingSchema,
        rows === undefined
            ? {}
            : {
                rank: sfs.array(
                    rows.map((row) =>
                        sfs.object({
                            rankNum: sfs.int(Number(row.rankNum)),
                            id: sfs.string(String(row.id)),
                            teamId: sfs.string(String(row.teamId)),
                            name: sfs.string(String(row.name)),
                            winNum: sfs.int(Number(row.winNum)),
                            failNum: sfs.int(Number(row.failNum)),
                            killNum: sfs.int(Number(row.killNum)),
                            score: sfs.int(Number(row.score)),
                            awardNum: sfs.int(Number(row.awardNum)),
                            holdNum: sfs.int(Number(row.holdNum)),
                            campType: sfs.int(Number(row.campType)),
                        })
                    ),
                ),
            },
    );
}

export function playoffRanking(
    publication: PlayoffPublication,
    teams: readonly PlayoffTeam[],
    allianceId: string,
    tickets: readonly string[],
    now: number,
    weekday: number,
): Fields
{
    const self = teams.find((team) => team.teamId === allianceId);
    const times = playoffTimes(publication, self, now);
    const fields: Fields = {};

    if (times.battleState !== undefined)
    {
        fields.battleState = sfs.int(times.battleState);
    }

    if (times.endTime !== undefined)
    {
        fields.endTime = sfs.long(times.endTime);
    }

    fields.teamId = sfs.string(allianceId);
    fields.enemyId = sfs.string(self?.enemyIds[publication.turns - 1] ?? "");
    fields.inBattle = sfs.bool(self?.curEnemyId != null);
    fields.state = sfs.byte(publication.state);
    fields.turns = sfs.int(publication.turns);
    fields.groups = sfs.array(
        playoffPairs(teams, publication.turns, allianceId).map((team) => {
            const start = playoffBattleStart(now, weekday, team.index);

            return sfs.object({
                kingId: sfs.int(team.kingId),
                kingName: sfs.string(team.kingName),
                teamId: sfs.string(team.teamId),
                name: sfs.string(team.name),
                abbr: sfs.string(team.abbr),
                icon: sfs.string(team.icon),
                curmember: sfs.int(team.curmember),
                fighting: sfs.int(team.fighting),
                fightPower: sfs.long(team.fightPower),
                rankNum: sfs.int((team.rankNum + 1) | 0),
                start: sfs.long(start),
                end: sfs.long(start + 7200n),
                groupId: sfs.int(team.groupId),
                ticketPayed: sfs.bool(tickets.includes(team.teamId)),
            });
        }),
    );

    return validateFields(playoffRankingSchema, fields);
}
