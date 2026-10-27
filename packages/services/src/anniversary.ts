import { campaignTriggerView } from "@opencok/mappings/anniversary";
import { encode, sfs, str, int } from "@opencok/messages/sfs";
import { eventTimestamp } from "@opencok/rules/local-events";
import { cityInteger } from "@opencok/rules/city-progression";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { anniversaryStatisticsView, anniversaryView } from "@opencok/mappings/anniversary";
import { CampaignPlanner, campaignVariableFields, refreshCampaignGrants } from "./local-campaign";
import type { CityDomain, CityProgressionContext } from "./city-progression";
import type { AnniversaryResponse } from "@opencok/contracts/responses/anniversary";

function weeks(context: CityProgressionContext) {
  return [...(context.rules.advanced.anniversaryWeeks?.values() ?? [])]
    .map((rule) => ({ rule, start: eventTimestamp(rule.start), end: eventTimestamp(rule.end) }))
    .filter((row) => row.start !== undefined && row.end !== undefined && row.end >= row.start)
    .sort((a, b) => cityInteger(a.rule.id) - cityInteger(b.rule.id));
}
function info(context: CityProgressionContext, planner: CampaignPlanner): AnniversaryResponse {
  let current = 0;
  const tasks = [...(context.rules.advanced.anniversaryTasks?.values() ?? [])];
  const anniversary_array = weeks(context)
    .filter((row) => context.now >= row.start!)
    .map(({ rule, end }) => {
      const week = cityInteger(rule.id),
        n = week % 100;
      if (context.now < end!) current = week;
      return {
        week_id: week,
        box_score: cityInteger(planner.value(`P$long_3th_week${n}_score_count`)),
        box_already_taken: (rule.score_reward ?? "")
          .split("|")
          .filter(Boolean)
          .map((_, i) =>
            cityInteger(planner.value(`P$long_3th_anniversary_week${n}_box_${i + 1}_flag`)),
          ),
        task_data: tasks
          .filter((task) => task.master === "1" && task.parent === rule.id)
          .map((group) => ({
            master_task_id: cityInteger(group.id),
            task_array: tasks
              .filter((task) => task.master !== "1" && task.parent === group.id)
              .map((task) => ({
                task_id: cityInteger(task.id),
                task_score: cityInteger(planner.value(`P$long_${task.value}`)),
                task_score_max: cityInteger(planner.value(`S$long_${task.value_max}`)),
              })),
          })),
      };
    });
  return {
    anniversary_array,
    cake_already_taken: cityInteger(planner.value("P$long_3th_anniversary_cake_taken")),
    curr_week_id: current,
  };
}
export const anniversaryDomain: CityDomain = {
  commands: [
    "1year.info",
    "third.anniversary",
    "third.anniversary.reward",
    "get.activity.value",
    "campaign.init",
    "trigger.activity",
    "campaign.action",
  ],
  types: [],
  async prepare(context, command, params) {
    if (command === "1year.info") {
      if (!context.state.anniversaryStatistics) campaignFailure();
      return {
        response: encode(
          anniversaryStatisticsView(
            context.state.anniversaryStatistics,
            context.state.profile,
            context.rules.items.get("3th_anniversary_achievement") ?? {},
          ),
        ),
        event: null,
      };
    }
    if (command === "trigger.activity") {
      const type = cityInteger(int(params, "type"));
      const target = str(params, "uid", "");
      if (type === 45 && !target.trim()) return { response: encode({}), event: null };
      if (type === 45 && target !== context.owner) campaignFailure();
      new CampaignPlanner(context, {
        uid: context.owner,
        client_para1: int(params, "para1", -1),
      }).event(type === 47 ? 47 : 51, type === 47 ? "" : String(type));
      refreshCampaignGrants(context);
      return { response: encode(campaignTriggerView(type)), event: null };
    }
    if (command === "campaign.init") {
      new CampaignPlanner(context).event(8);
      refreshCampaignGrants(context);
      return { response: encode({}), event: null };
    }
    if (
      !context.rules.advanced.anniversaryWeeks?.size ||
      !context.rules.advanced.campaignVariables?.size
    )
      campaignFailure();
    const planner = new CampaignPlanner(context);
    if (command === "campaign.action") {
      const code = cityInteger(int(params, "event"), 1, 10000),
        selector = str(params, "selector", "");
      new CampaignPlanner(context, {
        key_itemId: str(params, "itemId", ""),
        key_itemNum: int(params, "count", 1),
      }).event(code, selector);
      return { response: encode({}), event: null };
    }
    if (command === "get.activity.value") {
      const keys = str(params, "keys").split(";").filter(Boolean);
      return { response: encode(campaignVariableFields(planner, keys)), event: null };
    }
    if (command === "third.anniversary")
      return { response: encode(anniversaryView(info(context, planner))), event: null };
    const index = cityInteger(int(params, "boxIdx"), 1) - 1;
    const current = weeks(context).filter(
      (row) => context.now >= row.start! && context.now < row.end!,
    );
    if (current.length !== 1) campaignFailure();
    const week = current[0]!.rule,
      n = cityInteger(week.id) % 100;
    const reward = (week.score_reward ?? "").split("|")[index]?.split(";");
    const flag = `P$long_3th_anniversary_week${n}_box_${index + 1}_flag`;
    if (
      !reward ||
      reward.length !== 2 ||
      planner.value(flag) !== 0n ||
      planner.value(`P$long_3th_week${n}_score_count`) < BigInt(cityInteger(reward[0], 1))
    )
      campaignFailure();
    new CampaignPlanner(context, {
      take_or_preview_reward: 1,
      key_rewardId: cityInteger(reward[1], 1),
    }).event(58, `1;${reward[1]}`);
    if (new CampaignPlanner(context).value(flag) !== 1n) campaignFailure();
    return { response: encode({ success: sfs.string("1") }) };
  },
  async apply() {
    campaignFailure();
  },
};
