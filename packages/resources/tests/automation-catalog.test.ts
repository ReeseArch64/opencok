import { test, expect } from "bun:test";
import { loadCatalog } from "../src/catalog-definitions";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";

test("anniversary reward gates retain claim flags and grants in the maintained catalog", async () => {
    const catalog = await loadCatalog(GameplayCatalog.TriggerActivity);
    const rule = catalog.rules.find((rule) => rule.id === 2207)!;
    expect(rule.actions[0]!.branch!.conditions[0]!.conditions).toHaveLength(2);
    expect(rule.actions[0]!.branch!.onMatch[0]).toMatchObject({ code: 48, parameters: "250080" });
    expect(rule.actions[1]!.branch!.onMatch[0]).toMatchObject({
        code: 9,
        parameters: "$3th_anniversary_week1_box_1_flag;+;1",
    });
});
