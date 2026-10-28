import { expect, test } from "bun:test";
import { nicknameAllianceTask } from "@opencok/rules/nickname-alliance";
import type { NicknameAllianceTask } from "@opencok/contracts/nickname-change";
import type { Rules } from "@opencok/rules/game";

const now = 1792756800123;
function rules(selector = "all", enabled = "1", threshold = "1")
{
    return {
        items: new Map([["function_on6", { k12: selector }]]),
        configuration: {
            allianceTeleport: new Map([["46608", { function_on: enabled, para1: threshold }]]),
        },
    } satisfies Pick<Rules, "items" | "configuration">;
}
function tasks(chat = 0, timer = 0, num = 0n): NicknameAllianceTask[]
{
    return [
        { id: "00000", state: 0, num: 9n },
        { id: "46600", state: chat, num: 7n },
        { id: "46608", state: 0, num: 13n },
        { id: "46609", state: timer, num },
    ];
}

test("nickname alliance event marks only LORDNAME and preserves counters when another task is incomplete", () => {
    const rows = tasks(),
        before = structuredClone(rows);
    expect(nicknameAllianceTask(rows, rules(), 1, now)).toEqual({
        updates: [{ id: "46608", state: 1, num: 13n }],
        complete: false,
    });
    expect(rows).toEqual(before);
});

test("finishing prerequisites starts the timer once in milliseconds without completing it", () => {
    expect(nicknameAllianceTask(tasks(1), rules(), 1, now)).toEqual({
        updates: [
            { id: "46608", state: 1, num: 13n },
            { id: "46609", state: 0, num: BigInt(now) },
        ],
        complete: false,
    });
    for (const num of [-1n, 9n, 9223372036854775807n])
    {
        expect(nicknameAllianceTask(tasks(1, 0, num), rules(), 1, now)).toEqual({
            updates: [{ id: "46608", state: 1, num: 13n }],
            complete: false,
        });
    }
});

test("all tasks including TIME must be complete before the lifecycle terminates", () => {
    expect(nicknameAllianceTask(tasks(1, 1, 7n), rules(), 1, now)).toEqual({
        updates: [
            { id: "46608", state: 1, num: 13n },
            { id: "00000", state: 1, num: 9n },
        ],
        complete: true,
    });
    expect(nicknameAllianceTask(tasks(1, 1), rules(), 1, now)).toEqual({
        updates: [
            { id: "46608", state: 1, num: 13n },
            { id: "46609", state: 1, num: BigInt(now) },
            { id: "00000", state: 1, num: 9n },
        ],
        complete: true,
    });
    const states = [-1, 0, 1, 2];
    for (const chat of states)
    {
        for (const timer of states)
        {
            const result = nicknameAllianceTask(tasks(chat, timer, 5n), rules(), 1, now);
            expect(result.complete).toBe(chat === 1 && timer === 1);
        }
    }
});

test("done lifecycle and disabled realm gates skip later catalog dependencies", () => {
    const done = tasks();
    done[0] = { ...done[0]!, state: 1 };
    expect(nicknameAllianceTask(done, { items: new Map(), configuration: {} }, 1, now)).toEqual({
        updates: [],
        complete: false,
    });
    for (const selector of ["0", "2-4", "2;4", ""])
    {
        expect(
            nicknameAllianceTask(tasks(), { ...rules(selector), configuration: {} }, 1, now),
        ).toEqual({ updates: [], complete: false });
    }
    expect(nicknameAllianceTask([], rules(), 1, now)).toEqual({ updates: [], complete: false });
    for (const selector of ["all", "1", "1-3", "2;1", "1--3", "01"])
    {
        expect(nicknameAllianceTask(tasks(), rules(selector), 1, now).updates[0]?.state).toBe(1);
    }
});

test("enabled already-finished LORDNAME returns after required parsing without scanning completion", () => {
    const rows = tasks(1, 1);
    rows[2] = { ...rows[2]!, state: 1 };
    expect(nicknameAllianceTask(rows, rules(), 1, now)).toEqual({ updates: [], complete: false });
    expect(() => nicknameAllianceTask(rows, rules("all", "1", "broken"), 1, now)).toThrow();
    expect(nicknameAllianceTask(rows, rules("all", "0", "broken"), 1, now).complete).toBe(true);
    expect(nicknameAllianceTask(tasks(), rules("all", "0", "broken"), 1, now).updates).toEqual([
        { id: "46608", state: 1, num: 13n },
    ]);
    expect(nicknameAllianceTask(tasks(), rules("all", "-1", "+7"), 1, now).updates).toEqual([
        { id: "46608", state: 1, num: 13n },
    ]);
});

test("malformed reached rules and unrepresentable lifecycle state reject without inventing tasks", () => {
    for (const raw of ["", " 1", "1 ", "2147483648", "bad"])
    {
        expect(() => nicknameAllianceTask(tasks(), rules("all", raw), 1, now)).toThrow();
        expect(() => nicknameAllianceTask(tasks(), rules("all", "1", raw), 1, now)).toThrow();
    }
    expect(() => nicknameAllianceTask(tasks(), { ...rules(), configuration: {} }, 1, now))
        .toThrow();
    expect(() => nicknameAllianceTask(tasks(), { ...rules(), items: new Map() }, 1, now)).toThrow();
    expect(() => nicknameAllianceTask(tasks().slice(1), rules(), 1, now)).toThrow("lifecycle");
    expect(() => nicknameAllianceTask(tasks(1).slice(0, 3), rules(), 1, now)).toThrow("timer");
    for (
        const bad of [
            { id: "foreign", state: 0, num: 0n },
            { id: "46608", state: 0, num: 0n },
            { id: "46602", state: 2147483648, num: 0n },
            { id: "46602", state: 0, num: 9223372036854775808n },
        ]
    )
    {
        expect(() => nicknameAllianceTask([...tasks(), bad], rules(), 1, now)).toThrow();
    }
    const nullable = tasks();
    nullable[2] = { id: "46608", state: null, num: null };
    expect(nicknameAllianceTask(nullable, rules(), 1, now).updates).toEqual([
        { id: "46608", state: 1, num: 0n },
    ]);
});

test("the shipped alliance mail reward resolves a fixed goods attachment without redeeming it", async () => {
    const { nicknameAllianceReward } = await import("@opencok/rules/nickname-alliance");
    const rules = {
        reconnect: {
            rewards: new Map([
                [
                    "reward",
                    {
                        id: "reward",
                        islink: "0",
                        rate: "10",
                        item: "200008",
                        num: "1",
                        circle: "1",
                    },
                ],
            ]),
        },
    };
    expect(nicknameAllianceReward("reward", rules)).toBe("goods,200008,1");
    expect(() => nicknameAllianceReward("missing", rules)).toThrow();
    rules.reconnect.rewards.get("reward")!.item = "200008;200009";
    expect(() => nicknameAllianceReward("reward", rules)).toThrow();
});
