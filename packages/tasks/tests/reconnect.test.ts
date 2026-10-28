import { expect, test } from "bun:test";
import { ReconnectTaskPolicy } from "../src/rules/reconnect-task";
import { ReconnectTaskCounts } from "../src/rules/reconnect-counts";
import { ReconnectTaskMapper } from "../src/mappings/reconnect";
import type { ReconnectTaskContext, ReconnectTaskCountState } from "../src/contracts/reconnect";
import { ReconnectTaskPush } from "../src/enums/reconnect-command";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const context: ReconnectTaskContext = {
    platform: "facebook",
    registrationPlatform: "facebook",
    chinaPlatform: false,
    level: 10,
    castleLevel: 10,
    containsBuildings: () => true,
    initialCount: () => 0,
    random: () => 0,
};
const decimal = (value: unknown) => BigInt(String(value));
const policy = new ReconnectTaskPolicy({
    javaDecimal: decimal,
    javaIntHashMapOrder: (keys) => [...keys].reverse(),
    mailBlank: (value) => !value,
});

test("reconnect preserves injected trigger order and separates accepted, complete and claimed tasks", () => {
    const declarations = ["a", "b", "complete", "claimed"].map((id, index) => ({
        id,
        type2: String(index + 1),
        phase: "0",
    }));
    const rows = declarations.map((rule, index) => ({
        id: rule.id,
        num: index,
        state: index < 2 ? 0 : index - 1,
        type: 1,
    }));
    const before = structuredClone(rows);
    const result = policy.reconnectTaskPlan(rows, declarations, context);
    expect(result.tasks.map((task) => task.id)).toEqual(["b", "a", "complete", "claimed"]);
    expect(ReconnectTaskPolicy.visibleReconnectTasks(result.tasks).map((task) => task.id))
        .toEqual(["b", "a", "complete"]);
    expect(result.inserts).toEqual([]);
    expect(result.updates).toEqual([]);
    expect(result.pushes).toEqual([]);
    expect(rows).toEqual(before);
});

test("reconnect validates catalog bounds before invoking discovery or consuming malformed saved progress", () => {
    expect(() => policy.reconnectTaskPlan(Array(32768).fill({}), [], context))
        .toThrow("Oversized task catalog");
    expect(() => policy.reconnectTaskPlan([], Array(32768).fill({}), context))
        .toThrow("Oversized task catalog");
    const hidden = { id: "hidden", num: "invalid", state: "invalid", type: "invalid" };
    expect(policy.reconnectTaskPlan([hidden], [], context).tasks).toEqual([]);
    expect(() => policy.reconnectTaskPlan([hidden, hidden], [], context))
        .toThrow("Invalid reconnect task");
});

test("reconnect counter arithmetic narrows power but saturates negative narrowed purchase totals", () => {
    const widths: number[] = [];
    const counts = new ReconnectTaskCounts({
        javaDecimal: (value, bits) => {
            widths.push(bits);
            return decimal(value);
        },
    });
    const state: ReconnectTaskCountState = {
        profile: { payTotal: 2147483648n },
        playerInfo: { power: 4294967297n },
        buildings: [],
        armies: [],
        equipment: [],
        scienceLevels: new Map(),
        resourceOutput: new Map(),
        prestigeLevel: 0,
        civilizationCastle: undefined,
    };
    const catalog = { reconnect: {}, building: () => ({}) };
    expect(counts.reconnectTaskInitialCount({ type2: "30", para1: "0" }, state, catalog)).toBe(1);
    expect(counts.reconnectTaskInitialCount({ type2: "33" }, state, catalog)).toBe(2147483647);
    expect(widths).toEqual([32, 32, 64, 32, 64]);
    expect(state.profile.payTotal).toBe(2147483648n);
});

test("reconnect cross completion omits ordinary tasks and previews while snapshots retain rewards", () => {
    let previews = 0;
    const mapper = new ReconnectTaskMapper({
        signed: decimal,
        invalid: () => {
            throw new Error("Invalid reconnect");
        },
        previewRewards: () => {
            previews++;
            return [];
        },
        rewardPreviewArray: () => sfs.array([]),
    });
    const task = {
        id: "cross",
        num: 1,
        state: 1,
        type: 3,
        accepted: false,
        trigger: 35,
        phase: 1,
        predecessor: undefined,
        reward: "reward",
    };
    const plan = {
        tasks: [task],
        inserts: [],
        updates: [],
        pushes: [{ command: ReconnectTaskPush.CrossComplete, tasks: [task] }],
    };
    const result = mapper.reconnectTasks(plan, { items: new Map([["wb_info", { k4: "5" }]]) }, {
        kingdomId: 1,
        version: "12.06.0",
        now: 10,
    }, () => 0);
    expect(previews).toBe(1);
    expect(Object.keys(result.fields)).toEqual(["task", "ckfTask", "taskCompleteNum"]);
    expect(Object.keys(result.pushes[0]!.fields)).toEqual(["ckfTask"]);
    expect(decode(encode(result.pushes[0]!.fields))).toEqual({
        ckfTask: sfs.array([sfs.object({
            id: sfs.string("cross"),
            num: sfs.int(1),
            state: sfs.int(1),
            type: sfs.int(3),
            currPhase: sfs.int(1),
            maxPhase: sfs.int(5),
        })]),
    });
    expect(plan.tasks[0]).toEqual(task);
});
