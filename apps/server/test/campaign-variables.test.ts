import { anniversaryDomain } from "@opencok/services/anniversary";
import { decode, sfs } from "@opencok/messages/sfs";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    CampaignPlanner,
    campaignVariableFields,
} from "../../../packages/services/src/local-campaign";
import type { CityProgressionContext } from "@opencok/city/services/context";
test("every maintained numeric campaign declaration is available by its exact scope without changing stored state", async () => {
    const rules = await loadRules(),
        context = {
            rules,
            owner: "synthetic",
            now: 1900000000000n,
            state: { campaignVariables: [] },
            write: {},
        } as unknown as CityProgressionContext,
        planner = new CampaignPlanner(context);
    expect(rules.advanced.campaignVariables?.size).toBe(384);
    for (const [key, variable] of rules.advanced.campaignVariables!)
    {
        expect(planner.value(key)).toBe(BigInt(variable.initialValue ?? 0));
    }
    expect(planner.value("$kingwar_testitem_sent_2")).toBe(0n);
    expect(planner.value("I$long_sss")).toBe(100n);
    planner.write("I$long_sss", 999n);
    expect(planner.value("I$long_sss")).toBe(100n);
    expect(context.write).toEqual({});
    const server = [...rules.advanced.campaignVariables!.values()].find(
        (variable) => variable.scope === "S",
    )!;
    expect(() => planner.write(`S$${server.id}`, 100n)).toThrow();
    expect(() => planner.value("P$long_unknown_campaign")).toThrow();
    const fields = campaignVariableFields(planner, ["I$long_sss", "$kingwar_testitem_sent_2"]);
    expect(fields.keys?.value).toBe("I$long_sss;$kingwar_testitem_sent_2");
    expect(fields.values?.value).toBe("I$long_sss=100;$kingwar_testitem_sent_2=0");
    rules.advanced.anniversaryWeeks = undefined;
    const queried = await anniversaryDomain.prepare(context, "get.activity.value", {
        keys: sfs.string("I$long_sss"),
    });
    expect(decode(Buffer.from(queried.response)).values?.value).toBe("I$long_sss=100");
    await expect(anniversaryDomain.prepare(context, "third.anniversary", {})).rejects.toThrow();
});
