import type { Rules } from "@opencok/rules/game";
import type { ActivityOperatorsSnapshot } from "@opencok/contracts/activity-operators";
export const operatorsNow = Date.UTC(2024, 0, 1, 12);
export function configureOperators(rules: Rules) {
  rules.advanced.activityPages = new Map([
    ["1", { id: "1", Type: "22", call_activity: "0" }],
    ["2", { id: "2", Type: "23", call_activity: "0" }],
    ["3", { id: "3", Type: "27", call_activity: "0" }],
    ["4", { id: "4", Type: "36", call_activity: "0" }],
    ["5", { id: "5", Type: "34", call_activity: "57133" }],
    ["6", { id: "6", Type: "31", call_activity: "57159" }],
    ["7", { id: "7", Type: "6", call_activity: "synthetic" }],
    ["8", { id: "8", Type: "38", call_activity: "combat" }],
    ["9", { id: "9", Type: "31", call_activity: "combat-custom" }],
    ["10", { id: "10", Type: "20", call_activity: "0" }],
    ["11", { id: "11", Type: "21", call_activity: "57083" }],
    ["12", { id: "12", Type: "24", call_activity: "0" }],
    ["13", { id: "13", Type: "26", call_activity: "0" }],
  ]);
  for (const key of ["target_quest", "recall_quest", "alliance_groupbuys", "continued_cost"])
    rules.features.set(key, { id: key, version: "1.0.0", online: "all", test: "all" });
  for (const id of ["69023", "69024"])
    rules.configuration.payControl!.set(id, {
      ...rules.configuration.payControl!.get(id)!,
      k1: "1.0.0",
      k2: "all",
      k5: "1",
      k6: "4",
    });
  rules.advanced.castleLevels!.set("9011501", {
    ...rules.advanced.castleLevels!.get("9011501")!,
    activity_Type: "1;4|2;7",
  });
  rules.advanced.recallActivities = new Map([
    [
      "synthetic",
      { id: "synthetic", k10: "BR", k11: "1", k3: "2024-01-01-00-00", k4: "2024-01-02-00-00" },
    ],
  ]);
  rules.items.set("alliance_groupbuys", {
    ...rules.items.get("alliance_groupbuys")!,
    k1: "0",
    k6: "1",
    k7: "86400",
    k8: "3600",
  });
  rules.items.set("continued_cost", { ...rules.items.get("continued_cost")!, k1: "1" });
  for (const [id, type] of [
    ["57133", "34"],
    ["57159", "31"],
    ["synthetic", "6"],
    ["combat", "38"],
    ["combat-custom", "31"],
  ])
    rules.power.activityPanels!.set(id!, {
      ...rules.power.activityPanels!.get(id!)!,
      id: id!,
      type: type!,
      function_on: "1",
      start: "2024-01-01-00-00",
      end: "2024-01-02-00-00",
      ...(id === "combat-custom" ? { battle_type: "1" } : {}),
    });
}
export function operatorSnapshot(): ActivityOperatorsSnapshot {
  const now = BigInt(operatorsNow);
  return {
    profile: { uid: "owner", serverId: 1, banFlag: 0, banTime: 0n },
    server: { activityTime: now - 86400000n },
    buildings: [{ uid: "owner", itemId: 400000, level: 1 }],
    country: "BR",
    target: { uid: "owner", beginTime: now - 1000n, endTime: now + 3600001n },
    recall: { uid: "owner", country: "BR", beginTime: now - 1000n, endTime: now + 7200001n },
    groupBuys: [],
  };
}
