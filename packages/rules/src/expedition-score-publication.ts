import type { ExpeditionScoreVersion } from "@opencok/contracts/expedition-score-publication";
import { cityInteger, cityAmount } from "./city-progression";
import { long, text, type Row } from "@opencok/contracts/rows";

const states = [
  "WAITING_STATE",
  "MATCHING_STATE",
  "PREPARING_STATE",
  "COLLECT_STATE",
  "KILL_MONSTER_STATE",
  "BUILDING_STATE",
  "SCIENCE_STATE",
  "TRAIN_ARMY_STATE",
  "FIGHTING_STATE",
];

export function expeditionDiscovery(
  clock: Row,
  version: ExpeditionScoreVersion,
  now: bigint,
  enabled = true,
) {
  if (!enabled)
    {clock = { ...clock, stage: 0, opponent: 0, startTime: 0n, endTime: 9223372036854775807n };}

  const stage = cityInteger(clock.stage, 0, 8),
    kingdomId = cityInteger(clock.serverId, 1),
    opponent = cityInteger(clock.opponent),
    revision = cityAmount(clock.revision);
  cityAmount(now);

  if (
    kingdomId !== version.kingdomId ||
    opponent === kingdomId ||
    version.ownerEpoch < 1n ||
    version.sequence < 1n ||
    revision < 1n
  )
    {throw new Error("Foreign expedition discovery state");}

  return {
    key: `opencok:global:expedition-match:${kingdomId}`,
    value: JSON.stringify({
      serverId: kingdomId,
      matchServerId: opponent || -1,
      status: states[stage],
      periodId: text(clock, "periodId"),
      startTime: String(long(clock, "startTime")),
      endTime: String(long(clock, "endTime")),
      ownerEpoch: String(version.ownerEpoch),
      sequence: String(version.sequence),
      revision: String(revision),
    }),
    ownerEpoch: String(version.ownerEpoch),
    sequence: String(version.sequence),
    expiresAt: String(now + 864000000n),
  };
}
