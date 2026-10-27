import { expeditionActivitySchema } from "@opencok/validations/new-expedition";
import { validateFields } from "./validation";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { text, long, num, type Row } from "@opencok/contracts/rows";
import type { ExpeditionState } from "@opencok/contracts/new-expedition";
import type { Rules } from "@opencok/rules/game";
import { expeditionPanelDefinitions } from "@opencok/rules/expedition-phase";
import { expeditionPanelSchema } from "@opencok/validations/new-expedition";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "./rewards";
import { randomInt } from "node:crypto";

const scoreFormat = new Intl.NumberFormat("en-US", {
  useGrouping: false,
  maximumFractionDigits: 0,
  roundingMode: "halfEven",
});

export function expeditionScoreText(value: number) {
  return scoreFormat.format(value);
}

export function expeditionRewardList(row: Row | undefined) {
  return text(row ?? {}, "takeReward")
    .split("|")
    .filter(Boolean)
    .map((id) => sfs.int(Number(id)));
}

export function expeditionInfo(state: ExpeditionState, profile: Row, realmName: string): Fields {
  const phase = state.phase,
    period = state.period;
  const row = state.progress.find((item) => num(item, "stage") === phase?.stage);
  const kingdoms = [
    sfs.object({
      serverid: sfs.int(num(profile, "serverId")),
      score: sfs.string(expeditionScoreText(state.kingdomScore)),
      name: sfs.string(realmName),
      banner: sfs.string(""),
    }),
  ];

  if (period && phase && phase.stage !== 0 && num(period, "matchServerId") > 0)
    {kingdoms.push(
      sfs.object({ serverid: sfs.int(num(period, "matchServerId")), score: sfs.string("0") }),
    );}

  const rewardlist = expeditionRewardList(row);

  return validateFields(expeditionActivitySchema, {
    state: sfs.int(phase?.stage ?? 0),
    score: sfs.string(expeditionScoreText(num(row ?? {}, "score"))),
    alliancescore: sfs.double(state.allianceScore),
    rank: sfs.int(state.rank),
    kingdominfolist: sfs.array(kingdoms),
    startTime: sfs.long(phase?.startTime ?? 0n),
    endTime: sfs.long(phase?.endTime ?? 9223372036854775807n),
    count: sfs.int(num(profile, "expeditionCrossCount")),
    ...(rewardlist.length ? { rewardlist: sfs.array(rewardlist) } : {}),
  });
}

export function expeditionRecord(row: Row): Fields {
  return {
    time: sfs.long(long(row, "time")),
    targetServerName: sfs.string(text(row, "targetServerName")),
    targetServerId: sfs.int(num(row, "targetServerId")),
    kingUid: sfs.string(text(row, "kingUid")),
    kingName: sfs.string(text(row, "kingUserName")),
    type: sfs.int(num(row, "type")),
  };
}

export function expeditionTaxRecord(row: Row): Fields {
  return {
    time: sfs.long(long(row, "taxTime")),
    type: sfs.int(num(row, "type")),
    targetServerName: sfs.string(text(row, "targetServerName")),
    targetServerId: sfs.int(num(row, "targetServerId")),
    wood: sfs.long(long(row, "wood")),
    food: sfs.long(long(row, "food")),
    iron: sfs.long(long(row, "iron")),
    stone: sfs.long(long(row, "stone")),
  };
}

export function expeditionDistribution(row: Row): Fields {
  return {
    time: sfs.long(long(row, "sendTime")),
    kingUid: sfs.string(text(row, "kingUid")),
    kingName: sfs.string(text(row, "kingName")),
    recieveUid: sfs.string(text(row, "toUid")),
    recieveName: sfs.string(text(row, "toUserName")),
    wood: sfs.long(long(row, "wood")),
    food: sfs.long(long(row, "food")),
    iron: sfs.long(long(row, "iron")),
    stone: sfs.long(long(row, "stone")),
  };
}

export function expeditionPanels(
  state: ExpeditionState,
  profile: Row,
  rules: Rules,
  now: bigint,
): Fields[] {
  return expeditionPanelDefinitions(rules, now, state.lastMergeMillis ?? 0n).map(
    ({ rule, merge }) => {
      const result: Fields = {
        ...expeditionInfo(
          { ...state, progress: [], allianceScore: 0, rank: 0 },
          profile,
          rules.profile.servers?.get(String(rules.kingdomId))?.name ?? "",
        ),
        ...(merge ? { merge: sfs.bool(true) } : {}),
        id: sfs.string(rule.id!),
      };

      for (const key of ["activityid", "exchange", "res_andmd5", "res_iosmd5"])
        {if (rule[key] !== undefined) {result[key] = sfs.string(rule[key]!);}}

      if (rule.rewardid !== undefined)
        {result.reward = rewardPreviewArray(
          previewRewards(
            rule.rewardid,
            rules,
            { kingdomId: rules.kingdomId, version: "12.06.0", now: Number(now) },
            randomInt,
          ),
        );}

      result.popup = sfs.string(
        now >= (state.phase?.startTime ?? 0n) &&
          now <= (state.phase?.endTime ?? 9223372036854775807n)
          ? (rule.popup ?? "0")
          : "0",
      );

      for (const key of ["androidmd5", "iosmd5"])
        {if (rule[key] !== undefined) {result[key] = sfs.string(rule[key]!);}}

      return validateFields(expeditionPanelSchema, result);
    },
  );
}
