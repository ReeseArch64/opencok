import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { heroScoreFlags } from "@opencok/rules/hero-event";
import {
  heroEventEntrySchema,
  heroEventInfoSchema,
  heroEventRewardSchema,
  heroPanelSchema,
} from "@opencok/validations/hero-event";
import { validateFields } from "./validation";

export function heroEventEntry(
  event: Row,
  rule: { score: string; value: string; targets: readonly number[] },
  rewards: Value[],
  score?: Row,
): Fields {
  return validateFields(heroEventEntrySchema, {
    eventId: sfs.string(text(event, "eventId")),
    actId: sfs.string(text(event, "uuid")),
    t: sfs.int(num(event, "type")),
    st: sfs.long(long(event, "startTime")),
    et: sfs.long(long(event, "endTime")),
    score: sfs.string(rule.score),
    value: sfs.string(rule.value),
    reward: sfs.array(rewards),
    target: sfs.string(rule.targets.join("|")),
    userScore: sfs.object(
      score
        ? {
            uid: sfs.string(text(score, "uid")),
            actId: sfs.string(text(score, "actId")),
            score: sfs.int(num(score, "score")),
            level: sfs.int(num(score, "level")),
            finishFlag: sfs.int(num(score, "finishFlag")),
            rewardFlagList: sfs.string(heroScoreFlags(score)),
          }
        : {},
    ),
  });
}

export function heroEventInfo(
  events: Fields[],
  type: number,
  ranked: readonly { type: number; ranking: number; countries: readonly Row[] }[],
): Fields {
  const info: Fields = {};

  for (const entry of ranked) {
    info.vsCountry = sfs.array(
      entry.countries.map((row) =>
        sfs.object({
          id: sfs.int(num(row, "id")),
          rank: sfs.int(num(row, "rank")),
          ...(row.name === undefined ? {} : { name: sfs.string(text(row, "name")) }),
          ...(row.banner === undefined ? {} : { banner: sfs.string(text(row, "banner")) }),
        }),
      ),
    );
    info[entry.type === 4 ? "rankingAlliance" : "ranking"] = sfs.int(entry.ranking);
  }

  return validateFields(heroEventInfoSchema, {
    ...info,
    eventList: sfs.array(events.map(sfs.object)),
    type: sfs.int(type),
  });
}

export function heroEventReward(
  rewards: Value[],
  ids?: readonly string[],
  levels?: readonly number[],
): Fields {
  return validateFields(heroEventRewardSchema, {
    reward: sfs.array(rewards),
    ...(ids
      ? { rewardArr: sfs.string(ids.join("|")), levelArr: sfs.string(levels!.join("|")) }
      : {}),
  });
}

export function heroPanelView(
  activity: Row,
  panel: Record<string, string>,
  now: bigint,
  reward?: Value,
  merge = false,
): Fields {
  const result: Fields = {
    activityid: sfs.string(text(activity, "activityId")),
    startTime: sfs.long(long(activity, "startTime")),
  };

  if (activity.endTime !== undefined && activity.endTime !== null)
    result.endTime = sfs.long(long(activity, "endTime"));

  if (merge) result.merge = sfs.bool(true);

  result.id = sfs.string(panel.id!);

  if (panel.activityid !== undefined) result.activityid = sfs.string(panel.activityid);

  if (reward) result.reward = reward;

  for (const key of ["exchange", "res_andmd5", "res_iosmd5"])
    if (panel[key] !== undefined) result[key] = sfs.string(panel[key]!);

  result.popup = sfs.string(
    now >= long(activity, "startTime") &&
      (activity.endTime === undefined ||
        activity.endTime === null ||
        now <= long(activity, "endTime"))
      ? (panel.popup ?? "0")
      : "0",
  );

  for (const key of ["androidmd5", "iosmd5"])
    if (panel[key] !== undefined) result[key] = sfs.string(panel[key]!);

  return validateFields(heroPanelSchema, result);
}
