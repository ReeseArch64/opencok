import { expect, test } from "bun:test";
import { sfs } from "@opencok/messages/sfs";
import type { QuestCatalog, QuestProgressionState } from "../src/contracts/quest";

import type { QuestRuleRuntime } from "../src/contracts/runtime";
import { QuestKind } from "../src/enums/kind";
import { QuestChanges } from "../src/rules/changes";
import { QuestPolicy } from "../src/rules/progression";
import { QuestMapper } from "../src/mappings/quests";

const readers = {
    text: (row: Record<string, unknown>, key: string) => String(row[key] ?? ""),
    num: (row: Record<string, unknown>, key: string) => Number(row[key] ?? 0),
    long: (row: Record<string, unknown>, key: string) => BigInt(String(row[key] ?? 0)),
};

function fixture()
{
    const runtime: QuestRuleRuntime<QuestCatalog> = {
        ...readers,
        cityInteger: Number,
        reconnectTaskPlan: () => ({ tasks: [], inserts: [], updates: [], pushes: [] }),
        reconnectContainsBuildings: () => true,
        reconnectResourceOutput: () => new Map(),
        reconnectTaskInitialCount: () => 0,
    };
    const rules: QuestCatalog = {
        kingdomId: 1,
        goods: new Map(),
        items: new Map([["dailytasks_info", { k1: "2", k2: "0" }]]),
        mail: new Map(),
        reconnect: {},
        progression: {
            daily: new Map<string, Record<string, string>>([
                ["1", { id: "1", weight: "1", cond: "4;1", type: "7", num: "0;2" }],
                ["2", { id: "2", weight: "3", cond: "4;1", type: "7", num: "0;2" }],
                ["3", { id: "3", weight: "9", cond: "0;99" }],
            ]),
        },
    };
    const state: QuestProgressionState = {
        profile: { uid: "owner", level: 1 },
        tasks: [],
        buildings: [],
        armies: [],
        equipment: [],
        sciences: [],
        statistics: {},
        quests: {
            legacy: [],
            fresh: {},
            lord: { newDailyTaskFlushTime: 86400000n },
            mixed: {},
            signIn: {},
            story: [],
            daily: [{ id: 1, type: 0, state: 2, num: 2 }],
            alliance: { uid: "alliance" },
        },
    };
    return { policy: new QuestPolicy(runtime), rules, state };
}

test("delta keys retain daily types, last duplicate, ordering and numeric normalization", () => {
    const { changedQuestRows } = new QuestChanges(readers);
    expect(changedQuestRows(undefined)).toBeUndefined();
    expect(changedQuestRows([])).toEqual([]);
    const before = [{ uid: "owner", id: "1", type: 0, state: 1, num: 2 }];
    const identical = { uid: "owner", id: 1, type: "0", state: 1n, num: "2" };
    expect(changedQuestRows([identical], before)).toEqual([]);
    const first = { ...before[0]!, state: 2 };
    const second = { ...first, type: 1 };
    const last = { ...first, num: 3 };
    expect(changedQuestRows([first, second, last], before, true)).toEqual([last, second]);
    expect(changedQuestRows([first, second, last], before)).toEqual([last]);
    expect(changedQuestRows([{ ...identical, uid: "other" }], before)).toHaveLength(1);
});

test("bound native mappers preserve field order and main string versus numeric quest IDs", () => {
    const { questTask, questTasks } = new QuestMapper(readers);
    const row = { id: "001", num: 3, state: 2, type: 1 };
    const main = questTask(row, QuestKind.Main);
    expect(Object.keys(main)).toEqual(["id", "num", "state", "type"]);
    expect(main).toEqual({
        id: sfs.string("001"),
        num: sfs.int(3),
        state: sfs.int(2),
        type: sfs.int(1),
    });
    for (const kind of [QuestKind.Daily, QuestKind.Story])
    {
        expect(questTask(row, kind).id).toEqual(sfs.int(1));
        expect(questTasks([row], kind)).toEqual(sfs.array([sfs.object(questTask(row, kind))]));
    }
});

test("daily rollover preserves claimed rows before the boundary and draws eligible rows without replacement", () => {
    const { policy, rules, state } = fixture();
    const { progressQuests } = policy;
    const draws: number[] = [];
    const random = (limit: number) => {
        draws.push(limit);
        return limit - 1;
    };
    const before = progressQuests(state, rules, 173099999n, random, { daily: 7, count: 1 });
    expect(before.resetDaily).toBe(false);
    expect(before.daily).toEqual(state.quests!.daily);
    expect(draws).toEqual([]);
    const after = progressQuests(state, rules, 173100000n, random, { daily: 7, count: 1 });
    expect(after.resetDaily).toBe(true);
    expect(after.daily).toEqual([
        { uid: "owner", id: 2, type: 0, state: 0, num: 1 },
        { uid: "owner", id: 1, type: 0, state: 0, num: 1 },
    ]);
    expect(draws).toEqual([100, 4, 1]);
    expect(after.lord).toEqual({
        newDailyTaskFlushTime: 172800000n,
        newDailyTaskBoxRewardState: 0,
    });
    expect(state.quests!.daily).toEqual([{ id: 1, type: 0, state: 2, num: 2 }]);
});

test("bound policy helpers retain castle stars, completed counts, alliance state and level rewards", () => {
    const { policy, rules, state } = fixture();
    const { castleLevel, questInitial, rewardAtLevel, storySection } = policy;
    expect(
        castleLevel({
            ...state,
            buildings: [{ itemId: 400000, level: 30, star: 3 }, { itemId: 1, level: 99 }],
        }),
    ).toBe(33);
    expect(
        questInitial({ type2: "4" }, {
            ...state,
            tasks: [{ state: 0 }, { state: 1 }, { state: 2 }],
        }, rules),
    ).toBe(2);
    expect(questInitial({ type2: "40" }, { ...state, profile: { allianceId: "a" } }, rules)).toBe(
        1,
    );
    expect(rewardAtLevel("1;a|2;b", 2)).toBe("b");
    expect(rewardAtLevel("1;a|2;b", 3)).toBeUndefined();
    expect(rewardAtLevel("fixed", 1)).toBe("fixed");
    expect(storySection([], rules)).toBe(0);
});
