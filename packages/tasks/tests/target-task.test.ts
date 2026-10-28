import { expect, test } from "bun:test";
import { sfs, encode, type Fields } from "@opencok/messages/sfs";
import type { QuestRule } from "../src/contracts/records";
import type { TargetTaskCatalog, TargetTaskContext } from "../src/contracts/target-context";
import type { TargetTaskRuntime } from "../src/contracts/target-runtime";
import { TargetTaskPolicy } from "../src/rules/target-task";
import { TargetTaskPaymentIdentity } from "../src/rules/target-payment";
import { TargetTaskAccess } from "../src/services/target-access";
import { TargetTaskRewards } from "../src/services/target-rewards";
import { TargetTaskProgression } from "../src/services/target-progression";
import { TargetTaskPublicationService } from "../src/services/target-publication";
import { TargetTaskMapper } from "../src/mappings/target-task";

function integer(value: unknown, minimum = 0, maximum = 2147483647)
{
    const result = Number(value);

    if (!Number.isInteger(result) || result < minimum || result > maximum)
    {
        throw new Error("Out of range");
    }

    return result;
}

function fixture()
{
    let enabled = true;
    const recall: unknown[][] = [];
    const rules: TargetTaskCatalog = {
        kingdomId: 1,
        items: new Map(),
        mail: new Map(),
        advanced: {
            targetTasks: new Map<string, QuestRule>([
                ["a", { id: "a", type: "16", extend_type: "x;y", accept: "1;3", rate: "1" }],
                ["b", { id: "b", type: "2", extend_type: "1", accept: "1;3", rate: "3" }],
                ["unsupported", { id: "unsupported", type: "6", accept: "1;3", rate: "9" }],
                ["locked", { id: "locked", type: "2", accept: "9;10", rate: "9" }],
            ]),
        },
    };
    const unexpected = (): never => {
        throw new Error("Unexpected integration call");
    };
    const runtime: TargetTaskRuntime<TargetTaskCatalog, TargetTaskContext<TargetTaskCatalog>> = {
        text: (row, key) => String(row[key] ?? ""),
        num: (row, key) => Number(row[key] ?? 0),
        long: (row, key) => BigInt(String(row[key] ?? 0)),
        cityInteger: integer,
        serverFeature: () => enabled,
        recordRecallTask: (...args) => {
            recall.push(args);
        },
        javaMailBytes: unexpected,
        pinProgressionReward: unexpected,
        mailRewardEntries: unexpected,
        grantNativeProgressionReward: unexpected,
        previewRewards: unexpected,
        rewardPreviewArray: unexpected,
    };
    const context: TargetTaskContext<TargetTaskCatalog> = {
        owner: "owner",
        now: 1000000n,
        rules,
        state: {
            buildings: [],
            targetTask: {
                openedAt: 0n,
                notes: { beginTime: 1n, endTime: 86400001n, receive_mode: 0 },
                tasks: [{
                    uid: "owner",
                    id: "a",
                    type_level: 0,
                    num: 3,
                    target_num: 2147483647,
                    state: 0,
                }],
            },
        },
        write: {},
        economy: { gold: unexpected, resource: unexpected, item: unexpected },
    };
    const policy = new TargetTaskPolicy<TargetTaskCatalog>(runtime);
    const access = new TargetTaskAccess(runtime);
    const rewards = new TargetTaskRewards(runtime, access);
    const progression = new TargetTaskProgression(runtime, access, rewards, policy);
    return {
        context,
        policy,
        progression,
        recall,
        disable: () => {
            enabled = false;
        },
    };
}

test("target selection preserves eligibility, weighted order and no-replacement constraints", () => {
    const { context, policy } = fixture();
    const { selectTargetTasks } = policy;
    const draws: number[] = [];
    expect(
        selectTargetTasks(context.rules, { k3: "2" }, 2, (limit) => {
            draws.push(limit);
            return limit - 1;
        }).map((row) => row.id),
    ).toEqual(["b", "a"]);
    expect(draws).toEqual([4, 1]);
    expect(
        selectTargetTasks(context.rules, { k6: "1", k7: "2-1" }, 2, () => 0).map((row) => row.id),
    ).toEqual(["b"]);
    expect(() => selectTargetTasks(context.rules, { k6: "1", k7: "2-1|2-1" }, 2, () => 0))
        .toThrow();
    expect(() => selectTargetTasks(context.rules, { k3: "1" }, 2, (limit) => limit)).toThrow();
});

test("target progress calls recall before gating and caps bigint counts without rewriting claimed or expired rows", () => {
    const { context, progression, recall, disable } = fixture();
    const { recordTargetTask } = progression;
    recordTargetTask(context, 16, 9007199254740993n, "y");
    expect(context.write.targetTask?.tasks?.[0]).toEqual({
        uid: "owner",
        id: "a",
        type_level: 0,
        num: 2147483647,
        target_num: 2147483647,
        state: 1,
    });
    expect(context.state.targetTask?.tasks[0]?.num).toBe(3);
    const pending = context.write.targetTask!.tasks;
    recordTargetTask(context, 16, 1, "y");
    expect(context.write.targetTask!.tasks).toBe(pending);
    context.write.targetTask = undefined;
    recordTargetTask(context, 16, 1, "y", 86400001n);
    expect(context.write.targetTask).toBeUndefined();
    recordTargetTask(context, 16, 1, "other");
    expect(context.write.targetTask).toBeUndefined();
    disable();
    recordTargetTask(context, 16, 1, "y");
    expect(context.write.targetTask).toBeUndefined();
    expect(recall).toHaveLength(5);
    expect(recall[0]?.slice(1)).toEqual([16, 9007199254740993n, "y", 1000000n]);
    expect(recall[2]?.at(-1)).toBe(86400001n);
});

test("canonical paid identities isolate owners and reject invalid or oversized event IDs", () => {
    const { targetTaskPurchaseOperationId } = new TargetTaskPaymentIdentity();
    const id = targetTaskPurchaseOperationId("owner", "event:1");
    expect(id).toMatch(/^targetpaid:[a-f0-9]{64}$/);
    expect(targetTaskPurchaseOperationId("owner", "event:1")).toBe(id);
    expect(targetTaskPurchaseOperationId("other", "event:1")).not.toBe(id);
    expect(targetTaskPurchaseOperationId("owner", "event:2")).not.toBe(id);
    expect(targetTaskPurchaseOperationId("owner", "x".repeat(128))).toHaveLength(75);
    for (const event of ["", "x".repeat(129), "bad/event", "bad\0event"])
    {
        expect(() => targetTaskPurchaseOperationId("owner", event)).toThrow();
    }
});

test("bound target mapping preserves field order, optional day omission and wire validation", () => {
    const { targetTaskView } = new TargetTaskMapper();
    const view = targetTaskView([], "exchange", 5, undefined, false);
    expect(Object.keys(view)).toEqual(["targetList", "exchangeid", "day_sum", "receive_mode"]);
    expect(targetTaskView([], "exchange", 5, 0, true).day_now).toEqual(sfs.int(0));
    expect(() => targetTaskView([], "exchange", 1.5, undefined, false)).toThrow();
    const row: Fields = {
        reward: sfs.array([]),
        num: sfs.int(0),
        target_num: sfs.int(1),
        state: sfs.bool(false),
        day_type: sfs.int(0),
        taskid: sfs.string("a"),
        rewardDouble: sfs.int(0),
    };
    expect(() => targetTaskView(Array.from({ length: 65 }, () => row), "exchange", 5, 0, false))
        .toThrow();
});

test("owned publication rejects malformed paid events before delivery and preserves owner and native payload", async () => {
    const { publishTargetTaskMutation } = new TargetTaskPublicationService();
    const sent: unknown[][] = [];
    const publish = async (...args: [string, string, Fields]) => {
        sent.push(args);
    };
    const body = { rewardlist: sfs.array([]), receive_mode: sfs.bool(true) };
    await publishTargetTaskMutation(
        encode({ owner: sfs.string("owner"), body: sfs.object(body) }),
        publish,
    );
    expect(sent).toEqual([["owner", "push.target.task", body]]);
    for (const owner of ["", "x".repeat(41)])
    {
        await expect(
            publishTargetTaskMutation(
                encode({ owner: sfs.string(owner), body: sfs.object(body) }),
                publish,
            ),
        ).rejects.toThrow();
    }
    await expect(
        publishTargetTaskMutation(
            encode({
                owner: sfs.string("owner"),
                body: sfs.object({ ...body, receive_mode: sfs.bool(false) }),
            }),
            publish,
        ),
    ).rejects.toThrow();
    await expect(
        publishTargetTaskMutation(
            encode({
                owner: sfs.string("owner"),
                body: sfs.object({ ...body, rewardlist: sfs.string("bad") }),
            }),
            publish,
        ),
    ).rejects.toThrow();
    expect(sent).toHaveLength(1);
});
