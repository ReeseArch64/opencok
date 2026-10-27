import type { Rule, Rules } from "@opencok/rules/game";
export const goldEggsNow = Date.UTC(2030, 0, 2, 12);
export function configureGoldEggs(rules: Rules) {
  for (const id of ["golden_egg_open", "golden_egg_all_rank_open"])
    rules.features.set(id, { id, online: "all", test: "all", version: "7.23.0" });
  rules.power.activityPanels!.set("57175", {
    ...rules.power.activityPanels!.get("57175")!,
    start: "2030-01-01-00-00",
    end: "2030-01-04-00-00",
  });
  rules.items.set("golden_egg", {
    ...rules.items.get("golden_egg")!,
    k1: "2",
    k3: "200",
    k10: "5700",
    k4: "1",
    k5: "3",
    k6: "50;100;200",
    k7: "2;990002|4;990003",
    k9: "9051002",
  });
  rules.items.set("golden_rank", {
    ...rules.items.get("golden_rank")!,
    k1: "12196",
    k3: "12197",
    k2: "1-10;990004",
    k4: "1-10;990004",
  });
  rules.advanced.goldenEggs = new Map<string, Rule>([
    ["9051002", { id: "9051002", type: "1", rate: "100", score: "2", reward: "990001" }],
    ["9051005", { id: "9051005", type: "3", rate: "0", score: "4", status: "2;1", max: "1" }],
    ["9051001", { id: "9051001", type: "0", rate: "0", score: "0", max: "1" }],
  ]);
  rules.advanced.goldenEggSteps = new Map<string, Rule>([
    ["9051501", { id: "9051501", step: "0;1;2" }],
  ]);
  rules.reconnect.rewards!.set("990001", {
    id: "990001",
    rate: "50;50",
    item: "200001;200002",
    num: "1;1",
    circle: "1",
  });
  rules.reconnect.rewards!.set("990002", {
    id: "990002",
    gold: "7",
    wood: "11",
    rate: "100",
    item: "200003",
    num: "2",
    circle: "1",
  });
  rules.reconnect.rewards!.set("990003", { id: "990003", gold: "13" });
  rules.reconnect.rewards!.set("990004", {
    id: "990004",
    rate: "100",
    item: "200004",
    num: "3",
    circle: "1",
  });
  rules.advanced.campaignRules = [
    {
      id: "gold-eggs-goods",
      state: 2,
      openType: 2,
      events: [{ code: 40, parameters: "200001" }],
      conditions: [],
      actions: [{ code: 9, parameters: "P$long_gold_egg_grants;+;$key_itemNum" }],
    },
  ];
  rules.advanced.campaignVariables!.set("P$long_gold_egg_grants", {
    scope: "P",
    id: "long_gold_egg_grants",
    initialValue: 0,
  });
}
