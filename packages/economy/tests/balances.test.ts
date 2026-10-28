import { expect, test } from "bun:test";
import { createEconomyMutationExecutor } from "../src/repositories/balances";
import type {
    BalanceTransaction,
    BalanceTransactionExecutor,
} from "../src/repositories/balance-transaction";
import type { EconomyPlan } from "../src/contracts/balances";
import type { MutationCommand, MutationResult } from "@opencok/ledger/contracts/mutation";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";

const initial = {
    "profile.gold": 9007199254740993n,
    "profile.paidGold": 2n,
    "profile.paidSpecialGold": 3n,
    "profile.dmmGold": 4n,
    "profile.dmmPaidGold": 5n,
    "profile.dmmPaidSpecialGold": 6n,
    "resource.wood": 7n,
    "resource.stone": 8n,
    "resource.iron": 9n,
    "resource.food": 10n,
    "resource.woodbind": 11n,
    "resource.stonebind": 12n,
    "resource.ironbind": 13n,
    "resource.foodbind": 14n,
};
const command = (): MutationCommand => ({
    owner: "owner",
    requestId: "request",
    command: "purchase",
    request: Buffer.from([0, 128, 255]),
});
const response = Buffer.from([255, 0, 128]);

function fixture(options: { missing?: "profile" | "resource"; nullGold?: boolean; } = {})
{
    const locks: string[] = [];
    const updates: { table: string; fields: Record<string, bigint>; }[] = [];
    let captured: MutationCommand | undefined;
    let result: MutationResult | undefined;
    const name = (table: unknown) => table === userprofile ? "profile" : "resource";
    const tx = {
        select: () => ({
            from: (table: unknown) => ({
                where: () => ({
                    for: async (mode: string) => {
                        const kind = name(table);
                        locks.push(`${kind}:${mode}`);
                        if (options.missing === kind)
                        {
                            return [];
                        }
                        const row = Object.fromEntries(
                            Object.entries(initial).filter(([key]) => key.startsWith(kind)).map((
                                [key, value],
                            ) => [key.split(".")[1], value]),
                        );
                        return [{
                            ...row,
                            ...(kind === "profile" && options.nullGold ? { gold: null } : {}),
                        }];
                    },
                }),
            }),
        }),
        update: (table: unknown) => ({
            set: (fields: Record<string, bigint>) => ({
                where: async () => {
                    updates.push({ table: name(table), fields: { ...fields } });
                },
            }),
        }),
    } as unknown as BalanceTransaction;
    const execute: BalanceTransactionExecutor = async (input, apply) => {
        captured = input;
        result = await apply(tx);
        return Buffer.from(result.response);
    };
    return {
        run: createEconomyMutationExecutor(execute),
        locks,
        updates,
        captured: () => captured,
        result: () => result,
    };
}

test("all fourteen balances keep bigint precision, owner locks and ledger order", async () => {
    const state = fixture();
    const events = [{ id: "event", type: "purchase", payload: Buffer.from([128]) }];
    expect(
        await state.run(command(), async (balances) => {
            expect(balances).toEqual(initial);
            expect(Object.isFrozen(balances)).toBe(true);
            return {
                changes: Object.keys(initial).map((asset) => ({
                    asset: asset as keyof typeof initial,
                    delta: 1n,
                    reason: "reward",
                })),
                response,
                events,
            };
        }),
    ).toEqual(response);
    expect(state.locks).toEqual(["profile:update", "resource:update"]);
    expect(state.result()).toEqual({
        response,
        events,
        postings: Object.entries(initial).map(([asset, before]) => ({
            account: "owner",
            asset,
            before,
            after: before + 1n,
            reason: "reward",
        })),
    });
    expect(state.updates).toEqual(["profile", "resource"].map((table) => ({
        table,
        fields: Object.fromEntries(
            Object.entries(initial).filter(([key]) => key.startsWith(table)).map((
                [key, value],
            ) => [key.split(".")[1], value + 1n]),
        ),
    })));
});

test("a no-change plan retains response/events and skips both table updates", async () => {
    const state = fixture({ nullGold: true });
    expect(
        await state.run(command(), async (balances) => {
            expect(balances["profile.gold"]).toBe(0n);
            return { changes: [], response };
        }),
    ).toEqual(response);
    expect(state.updates).toEqual([]);
    expect(state.result()).toEqual({ response, events: undefined, postings: [] });
});

test("request bytes and top-level command identity are captured before awaiting the executor", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
        release = resolve;
    });
    let captured: MutationCommand | undefined;
    const run = createEconomyMutationExecutor(async (input) => {
        await gate;
        captured = input;
        return response;
    });
    const input = command();
    const pending = run(input, async () => {
        throw new Error("Replay must not plan");
    });
    input.owner = "other";
    input.requestId = "changed";
    input.request.fill(1);
    release();
    expect(await pending).toEqual(response);
    expect(captured).toEqual(command());
});

for (const missing of ["profile", "resource"] as const)
{
    test(`missing ${missing} prevents economic planning or writes`, async () => {
        const state = fixture({ missing });
        let calls = 0;
        await expect(state.run(command(), async () => {
            calls++;
            return { changes: [], response };
        })).rejects.toThrow("Missing economic account");
        expect(calls).toBe(0);
        expect(state.updates).toEqual([]);
    });
}

const invalidPlans = [
    {
        name: "unknown asset",
        changes: [{ asset: "profile.unknown", delta: 1n, reason: "test" }],
        error: "Invalid economic asset",
    },
    {
        name: "duplicate asset",
        changes: [{ asset: "profile.gold", delta: 1n, reason: "test" }, {
            asset: "profile.gold",
            delta: 1n,
            reason: "test",
        }],
        error: "Invalid economic asset",
    },
    {
        name: "numeric delta",
        changes: [{ asset: "profile.gold", delta: 1, reason: "test" }],
        error: "Invalid economic asset",
    },
    {
        name: "negative balance",
        changes: [{ asset: "resource.wood", delta: -8n, reason: "test" }],
        error: "balance",
    },
    {
        name: "overflow",
        changes: [{ asset: "profile.gold", delta: 9223372036854775807n, reason: "test" }],
        error: "balance",
    },
    {
        name: "empty reason",
        changes: [{ asset: "profile.gold", delta: 1n, reason: "" }],
        error: "identity",
    },
    {
        name: "posting count",
        changes: Array.from(
            { length: 257 },
            () => ({ asset: "profile.gold", delta: 1n, reason: "test" }),
        ),
        error: "Economic posting limit exceeded",
    },
];

for (const scenario of invalidPlans)
{
    test(`${scenario.name} rejects before either account row is updated`, async () => {
        const state = fixture();
        await expect(
            state.run(
                command(),
                async () => ({ changes: scenario.changes, response }) as EconomyPlan,
            ),
        ).rejects.toThrow(scenario.error);
        expect(state.updates).toEqual([]);
    });
}

test("a valid earlier posting does not leak when a later posting fails validation", async () => {
    const state = fixture();
    await expect(state.run(command(), async () => ({
        changes: [
            { asset: "profile.gold", delta: 1n, reason: "reward" },
            { asset: "resource.food", delta: -11n, reason: "cost" },
        ],
        response,
    }))).rejects.toThrow("balance");
    expect(state.updates).toEqual([]);
});
