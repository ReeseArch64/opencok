import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { createRealmResearchDomain } from "../src/composition/research";
import { ResearchMapper } from "@opencok/research/mappings/research";
import {
    researchCosts,
    checkResearchRequirements,
    researchDefinition,
} from "@opencok/research/rules/research";
import { sfs, fields } from "@opencok/messages/sfs";
import { cityFixture } from "./fixtures/city-progression";

const researchDomain = createRealmResearchDomain();

const rules = await loadRules();
test("login projects legacy research IDs by addition while mutation selection remains strict", () => {
    const saved = [{ itemId: "700101", level: 1 }];
    const snapshot = new ResearchMapper().data(saved, [], rules);
    const records = snapshot.value as import("@opencok/messages/sfs").Value[];
    const row = records.map(fields).find((row) => row.itemId?.value === "700101")!;
    expect(row.itemId).toEqual(sfs.string("700101"));
    expect(row.level).toEqual(sfs.int(1));
    expect(row.para2).toEqual(sfs.string(rules.power.sciences!.get("700102")!.para2!));
    expect(row.nextPara2).toEqual(sfs.string(rules.power.sciences!.get("700103")!.para2!));
    expect(saved).toEqual([{ itemId: "700101", level: 1 }]);
    expect(() => researchDefinition(rules, "700101", 1)).toThrow();
});

test("research rejects unmet science and building prerequisites and prices discounts without negative costs", () => {
    const { state } = cityFixture(rules);
    expect(() => checkResearchRequirements(state, rules, { science_condition: "700101" }))
        .toThrow();
    expect(() => checkResearchRequirements(state, rules, { building_condition: "403001" }))
        .toThrow();
    expect(researchCosts({ research_need: "0;100|3;200" }, (id) => (id === 181 ? 50 : 0))).toEqual({
        wood: 50n,
        food: 100n,
    });
    expect(() => researchCosts({ research_need: "0;100|0;200" }, () => 0)).toThrow();
    expect(() => researchCosts({ research_need: "5;100" }, () => 0)).toThrow();
});
test("research completion advances exactly one level and returns the scalar wire types", async () => {
    const { context, state } = cityFixture(rules);
    state.sciences = [{ uid: "owner", itemId: "700100", level: 0, cd: 1060000n }];
    state.queues = [{
        uuid: "q",
        ownerId: "owner",
        type: 6,
        itemId: "700100",
        updateTime: 1060000n,
    }];
    const result = await researchDomain.apply(context, "finish", {
        id: "a",
        ownerId: "owner",
        queueId: "q",
        type: 6,
        itemId: "700100",
        startedAt: 1000000n,
        dueAt: 1060000n,
        version: 2,
        status: 1,
        data: {
            schema: 1,
            kind: "research",
            costs: {},
            items: {},
            target: { level: 1, star: 0, progress: 0 },
        },
    });
    expect(context.write.sciences![0]!.level).toBe(1);
    expect(result.itemId).toEqual(sfs.string("700100"));
    expect(result.level).toEqual(sfs.int(1));
    expect(result.cd).toEqual(sfs.long(0n));
    expect(context.write.statistics!.power).toBe(1004n);
});
test("research snapshots include locked base technologies and expose only their occupied deadline", () => {
    const value = new ResearchMapper().data(
        [{ uid: "owner", itemId: "700100", level: 1 }],
        [{ type: 6, itemId: "700100", updateTime: 100n }],
        rules,
    );
    const rows = value.value as { value: Record<string, import("@opencok/messages/sfs").Value>; }[];
    const selected = rows.find((row) => row.value.itemId!.value === "700100")!;
    expect(selected.value.cd).toEqual(sfs.long(100n));
    expect(rows.some((row) => fields(sfs.object(row.value)).level!.value === 0)).toBe(true);
});

test("research cannot skip a pinned level or complete against another owned queue", async () => {
    const { context, state } = cityFixture(rules);
    state.sciences = [{ uid: "owner", itemId: "700100", level: 0, cd: 1060000n }];
    state.queues = [{ uuid: "q", ownerId: "owner", type: 6, itemId: "700100" }];
    const activity = {
        id: "a",
        ownerId: "owner",
        queueId: "q",
        type: 6,
        itemId: "700100",
        startedAt: 1000000n,
        dueAt: 1060000n,
        version: 2,
        status: 1,
        data: {
            schema: 1,
            kind: "research",
            costs: {},
            items: {},
            target: { level: 2, star: 0, progress: 0 },
        },
    };
    await expect(researchDomain.apply(context, "finish", activity)).rejects.toThrow();
    await expect(
        researchDomain.apply(context, "finish", { ...activity, queueId: "other" }),
    ).rejects.toThrow();
});
