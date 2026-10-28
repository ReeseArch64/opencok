import { expect, test } from "bun:test";
import {
    reconnectTaskPlan,
    visibleReconnectTasks,
    type ReconnectTaskContext,
} from "@opencok/rules/reconnect-tasks";
import { Rules, type Rule } from "@opencok/rules/game";
import { reconnectTasks } from "@opencok/mappings/reconnect";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const context: ReconnectTaskContext = {
    platform: "market_global",
    registrationPlatform: "facebook",
    chinaPlatform: false,
    level: 10,
    castleLevel: 8,
    containsBuildings: (requirements) => requirements.every((id) => id === "400005"),
    initialCount: () => 0,
    random: () => 0,
};
const rule = (id: string, more: Rule = {}): Rule => ({
    id,
    type1: "1",
    type2: "34",
    para1: "1",
    para2: "1",
    accept1: "1",
    accept2: "400005",
    reward: "synthetic",
    ...more,
});

test("reconnect completes mobile transition once and discovers dependent tasks without granting rewards", () => {
    const declarations = [rule("mobile"), rule("count", { type2: "4", para2: "1", pre: "mobile" })];
    delete declarations[1]!.para1;
    const first = reconnectTaskPlan([], declarations, context);
    expect(first.inserts.map((task) => task.id)).toEqual(["mobile", "count"]);
    expect(first.tasks.map((task) => [task.id, task.state, task.num])).toEqual([
        ["mobile", 1, 1],
        ["count", 1, 1],
    ]);
    expect(first.pushes.map((push) => push.command)).toEqual([
        "push.task.new",
        "push.task.complete",
        "push.task.new",
        "push.task.complete",
    ]);
    expect(first.pushes[0]!.tasks[0]!.state).toBe(0);
    expect(visibleReconnectTasks(first.tasks)).toHaveLength(2);
    const saved = first.tasks.map((task) => ({
        id: task.id,
        state: task.state,
        num: task.num,
        type: task.type,
    }));
    const second = reconnectTaskPlan(saved, declarations, context);
    expect(second.inserts).toEqual([]);
    expect(second.updates).toEqual([]);
    expect(second.pushes).toEqual([]);
});

test("facebook reconnect preserves saved visibility and skips mobile discovery", () => {
    const declarations = [
        rule("root"),
        rule("blocked", { pre: "missing" }),
        rule("cross", { type1: "3", phase: "2", pre: "missing" }),
        rule("rewarded"),
    ];
    const rows = [
        { id: "root", num: 0, state: 0, type: 1 },
        { id: "blocked", num: 1, state: 1, type: 1 },
        { id: "cross", num: 1, state: 1, type: 3 },
        { id: "rewarded", num: 1, state: 2, type: 1 },
    ];
    const plan = reconnectTaskPlan(rows, declarations, { ...context, platform: "FACEBOOK" });
    expect(visibleReconnectTasks(plan.tasks).map((task) => task.id)).toEqual(["root", "cross"]);
    expect(plan.tasks.filter((task) => task.state === 2)).toHaveLength(1);
    expect(plan.inserts).toEqual([]);
    expect(plan.updates).toEqual([]);
});

test("quest discovery honors level, buildings, origin, operator and cross-phase gates", () => {
    const declarations = [
        rule("future", { accept1: "11" }),
        rule("building", { accept2: "400011" }),
        rule("operator", { operator: "cn" }),
        rule("hidden", { accept3: "400005" }),
        rule("mobile"),
        rule("cross-a", { type1: "3", type2: "35", phase: "1", min: "5", max: "10" }),
        rule("cross-b", { type1: "3", type2: "35", phase: "1", min: "5", max: "10" }),
        rule("next-phase", { type1: "3", type2: "35", phase: "2", min: "5", max: "10" }),
    ];
    const plan = reconnectTaskPlan([], declarations, {
        ...context,
        chinaPlatform: true,
        registrationPlatform: null,
        random: (bound) => bound - 1,
    });
    expect(plan.inserts.map((task) => task.id)).toEqual(["cross-b"]);
    expect(plan.tasks[0]!.state).toBe(0);
    expect(() => reconnectTaskPlan([], declarations, { ...context, random: (bound) => bound }))
        .toThrow();
});

test("reconnect validates reached task integers and keeps unrelated quest rows unconsumed", () => {
    expect(() => reconnectTaskPlan([{ id: "blocked_ban", num: 0, type: 1, state: 0 }], [], context))
        .toThrow();
    expect(() => reconnectTaskPlan([{ id: "x", num: 0, type: 1, state: 3 }], [rule("x")], context))
        .toThrow();
    expect(() =>
        reconnectTaskPlan(
            [
                { id: "x", num: 0, type: 1, state: 0 },
                { id: "x", num: 0, type: 1, state: 0 },
            ],
            [rule("x")],
            context,
        )
    ).toThrow();
    expect(
        reconnectTaskPlan([{ id: "unknown", num: "bad", type: "bad", state: "bad" }], [], context)
            .tasks,
    ).toEqual([]);
    expect(() => reconnectTaskPlan([], [rule("x", { para2: "bad" })], context)).toThrow();
});

test("task wire snapshots include reward previews while completion pushes omit rewards", () => {
    const declarations = [
        rule("mobile"),
        rule("rewarded"),
        rule("cross", {
            type1: "3",
            phase: "1",
            min: "1",
            max: "30",
        }),
    ];
    const plan = reconnectTaskPlan(
        [{ id: "rewarded", num: 1, state: 2, type: 1 }],
        declarations,
        context,
    );
    const rules = new Rules(
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map([["wb_info", { k4: "5" }]]),
    );
    rules.reconnect.rewards = new Map([["synthetic", { exp: "12", food: "7" }]]);
    const result = reconnectTasks(
        plan,
        rules,
        { kingdomId: 1, version: "12.06.0", now: 100 },
        () => 0,
    );
    const wire = decode(encode(result.fields));
    expect(wire.taskCompleteNum).toEqual(sfs.int(1));
    expect(wire.task).toEqual(
        sfs.array([
            sfs.object({
                id: sfs.string("mobile"),
                num: sfs.int(1),
                state: sfs.int(1),
                type: sfs.int(1),
                reward: sfs.array([
                    sfs.object({ type: sfs.int(6), value: sfs.int(12) }),
                    sfs.object({ type: sfs.int(3), value: sfs.int(7) }),
                ]),
            }),
        ]),
    );
    expect(result.pushes.map((push) => push.command)).toEqual([
        "push.task.new",
        "push.task.complete",
        "push.ckf.task.complete",
    ]);
    const ordinary = sfs.array([
        sfs.object({
            id: sfs.string("mobile"),
            num: sfs.int(1),
            state: sfs.int(1),
            type: sfs.int(1),
        }),
    ]);
    expect(result.pushes[1]!.fields).toEqual({ task: ordinary });
    expect(result.pushes[2]!.fields).toEqual({
        task: ordinary,
        ckfTask: sfs.array([
            sfs.object({
                id: sfs.string("cross"),
                num: sfs.int(1),
                state: sfs.int(1),
                type: sfs.int(3),
                currPhase: sfs.int(1),
                maxPhase: sfs.int(5),
            }),
        ]),
    });
    expect(() =>
        reconnectTasks(
            plan,
            new Rules(new Map(), new Map(), new Map()),
            {
                kingdomId: 1,
                version: "12.06.0",
                now: 100,
            },
            () => 0,
        )
    ).toThrow();
});
