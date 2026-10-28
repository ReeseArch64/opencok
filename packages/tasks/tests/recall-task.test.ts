import { expect, test } from "bun:test";
import { sfs, decode } from "@opencok/messages/sfs";
import type { QuestRule } from "../src/contracts/records";
import type { RecallTaskCatalog, RecallTaskContext } from "../src/contracts/recall-context";
import type { RecallTaskRuntime } from "../src/contracts/recall-runtime";
import type { RecallTaskState } from "../src/contracts/recall-task";
import { RecallTaskDomain } from "../src/services/recall-task";
import { RecallTaskMapper } from "../src/mappings/recall-task";
import { RecallTaskCommand } from "../src/enums/recall-command";

function fixture()
{
    const grants: string[] = [];
    const statuses: string[] = [];
    const bands: number[] = [];
    const rule: QuestRule = {
        k3: "1",
        k4: "1000000000",
        k5: "1",
        k7: "a;b",
        k8: "0;0|1;500",
        k9: "0;0",
        k10: "BR",
        k11: "1",
    };
    const tasks = new Map<string, QuestRule>([
        ["a", { id: "a", type: "26", extend_type: "1", num: "2", rewardall: "reward-a" }],
        ["b", { id: "b", type: "27", extend_type: "1", num: "1", rewardall: "reward-b" }],
    ]);
    const rules: RecallTaskCatalog = {
        kingdomId: 1,
        advanced: { recallActivities: new Map([["event", rule]]), recallTasks: tasks },
        power: { statuses: new Map([["500", {}]]) },
    };
    const state: RecallTaskState = {
        country: "BR",
        notes: { beginTime: 1n, endTime: 1000n, receive_mode: 0 },
        tasks: [{ uid: "owner", id: "a", num: 0, target_num: 2, state: 0, receive: 0 }],
    };
    const context: RecallTaskContext<RecallTaskCatalog> = {
        owner: "owner",
        now: 100n,
        rules,
        state: {
            profile: { appVersion: "12.06.0" },
            buildings: [{ itemId: 400000, level: 1, star: 2 }],
            recallTask: state,
        },
        write: {},
    };
    const runtime: RecallTaskRuntime<RecallTaskCatalog, typeof context> = {
        text: (row, key) => String(row[key] ?? ""),
        num: (row, key) => Number(row[key] ?? 0),
        long: (row, key) => BigInt(String(row[key] ?? 0)),
        cityInteger: (value, minimum = 0, maximum = 2147483647) => {
            const result = Number(value);
            if (!Number.isInteger(result) || result < minimum || result > maximum)
            {
                throw new Error("Out of range");
            }
            return result;
        },
        regionalRecallBand: (_rule, level) => {
            bands.push(level);
            return 0;
        },
        regionalRecallEligible: () => true,
        regionalRecallFailure: () => {
            throw new Error("Invalid recall");
        },
        eventTimestamp: (value) => value === undefined ? undefined : BigInt(value),
        serverFeature: () => true,
        pinProgressionReward: (_context, id) => id,
        grantNativeProgressionReward: (_context, raw) => {
            grants.push(raw);
            return [sfs.string(raw)];
        },
        applyProgressionStatus: (_context, id) => {
            statuses.push(id);
        },
        previewRewards: () => [],
        rewardPreviewArray: () => sfs.array([]),
    };
    return {
        context,
        state,
        rule,
        tasks,
        grants,
        statuses,
        bands,
        runtime,
        domain: new RecallTaskDomain(runtime, new RecallTaskMapper()),
    };
}

test("recall progress includes the expiration instant, preserves pending state and caps bigint counts", () => {
    const { context, state, tasks, domain } = fixture();
    tasks.set("a", { id: "a", type: "16", extend_type: "x;y" });
    const { recordRecallTask } = domain;
    recordRecallTask(context, 16, 1, "other", 1000n);
    expect(context.write.recallTask).toBeUndefined();
    recordRecallTask(context, 16, 1, "y", 1001n);
    expect(context.write.recallTask).toBeUndefined();
    recordRecallTask(context, 16, 0, "y", 1000n);
    expect(context.write.recallTask).toBeUndefined();
    recordRecallTask(context, 16, 1, "y", 1000n);
    expect(context.write.recallTask?.tasks?.[0]?.num).toBe(1);
    recordRecallTask(context, 16, 9007199254740993n, "y", 1000n);
    expect(context.write.recallTask?.tasks?.[0]?.num).toBe(2147483647);
    expect(context.write.recallTask?.tasks?.[0]?.state).toBe(1);
    const pending = context.write.recallTask;
    recordRecallTask(context, 16, 1, "y", 1000n);
    expect(context.write.recallTask).toBe(pending);
    expect(state.tasks[0]?.num).toBe(0);
});

test("recall initialization preserves castle stars and both login counters through the inclusive last instant", async () => {
    const { context, state, domain, bands } = fixture();
    state.notes = undefined;
    const { prepare } = domain;
    await prepare(context, RecallTaskCommand.Initialize, {});
    const initial = context.write.recallTask!;
    expect(initial.reset).toBe(true);
    expect(initial.notes?.opendTime).toBe(100n);
    expect(initial.notes?.version).toBe("12.06.0");
    expect(initial.tasks?.map((row) => [row.id, row.target_num, row.type_level])).toEqual([[
        "a",
        2,
        3,
    ], ["b", 1, 3]]);
    expect(bands).toEqual([3]);
    state.notes = initial.notes;
    state.tasks = initial.tasks!;
    const resumed: typeof context = { ...context, now: 86400100n, write: {} };
    await prepare(resumed, RecallTaskCommand.Initialize, {});
    expect(resumed.write.recallTask?.tasks?.map((row) => [row.id, row.num, row.state])).toEqual([[
        "a",
        1,
        0,
    ], ["b", 1, 1]]);
    expect(resumed.write.recallTask?.notes?.lastLoginTime).toBe(86400100n);
});

test("recall claims apply statuses once and preserve the later milestone reward override", async () => {
    const first = fixture();
    first.state.tasks = [{ uid: "owner", id: "a", num: 2, state: 1, receive: 0 }];
    const result = await first.domain.prepare(first.context, RecallTaskCommand.Receive, {
        id: sfs.string("a"),
    });
    expect(decode(Buffer.from(result.response)).status).toEqual(sfs.string("500"));
    expect(first.grants).toEqual(["reward-a"]);
    expect(first.statuses).toEqual(["500"]);
    await first.domain.prepare(first.context, RecallTaskCommand.Receive, { id: sfs.string("a") });
    expect(first.grants).toEqual(["reward-a"]);
    expect(first.context.write.recallTask?.notes?.receive_mode).toBe(500);
    const second = fixture();
    second.rule.k9 = "0;0|2;600";
    second.state.tasks = [{ uid: "owner", id: "a", num: 2, state: 1, receive: 0 }];
    const overridden = await second.domain.prepare(second.context, RecallTaskCommand.Receive, {
        id: sfs.string("a"),
    });
    expect(second.grants).toEqual(["reward-a", "600"]);
    expect(second.statuses).toEqual([]);
    expect(Object.keys(decode(Buffer.from(overridden.response)))).toEqual([
        "id",
        "reward",
        "receive_reward",
    ]);
    expect(second.context.write.recallTask?.notes?.receive_mode).toBe(600);
});

test("recall native mapping preserves exact long times, optional omission and strict claim shapes", () => {
    const { recallTaskView, recallTaskClaim } = new RecallTaskMapper();
    expect(Object.keys(recallTaskView([]))).toEqual(["targetList"]);
    expect(recallTaskView([], 9007199254740993n).opentime).toEqual(sfs.long(9007199254740993n));
    const claim = { id: sfs.string("a"), reward: sfs.array([]), status: sfs.string("500") };
    expect(Object.keys(recallTaskClaim(claim))).toEqual(["id", "reward", "status"]);
    expect(() => recallTaskClaim({ ...claim, status: sfs.int(500) })).toThrow();
    expect(() => recallTaskClaim({ ...claim, fabricated: sfs.int(1) })).toThrow();
    expect(() => recallTaskView(Array.from({ length: 65 }, () => ({})))).toThrow();
});
