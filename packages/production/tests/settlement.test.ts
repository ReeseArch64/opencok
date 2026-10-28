import { expect, test } from "bun:test";
import {
    settleProduction,
    changeProductionRate,
    productionScale,
} from "../src/rules/settlement.ts";
import type { ProductionAccount } from "../src/contracts/production.ts";

const production: ProductionAccount = {
    buildingId: "building",
    ownerId: "owner",
    asset: "wood",
    settledAt: 0n,
    amount: 0n,
    remainder: 0n,
    rates: [{ at: 0n, perHour: 100n * productionScale, capacity: 1000n }],
};
test("production checkpoints conserve fractions and never settle an interval twice", () => {
    const once = settleProduction(production, 3600000n);
    expect(once.amount).toBe(100n);
    expect(settleProduction(once, 3600000n)).toEqual(once);
    expect(settleProduction(once, 1000n)).toEqual(once);
    let split = production;
    for (let i = 1; i <= 1000; i++)
    {
        split = settleProduction(split, BigInt(i) * 3600n);
    }
    expect(split.amount).toBe(once.amount);
    expect(split.remainder).toBe(once.remainder);
    expect(settleProduction(production, 3600000000000n).amount).toBe(1000n);
});
test("rate changes settle the old interval and split boost expiry without retroactive credit", () => {
    const changed = changeProductionRate(production, 1800000n, [
        { at: 1800000n, perHour: 200n * productionScale, capacity: 2000n },
        { at: 3600000n, perHour: 100n * productionScale, capacity: 1000n },
    ]);
    expect(changed.amount).toBe(50n);
    const result = settleProduction(changed, 5400000n);
    expect(result.amount).toBe(200n);
    expect(() =>
        changeProductionRate(result, 1000n, [{
            at: 1000n,
            perHour: productionScale,
            capacity: 10n,
        }])
    ).toThrow();
    expect(() =>
        settleProduction({ ...production, rates: [{ at: 10n, perHour: 1n, capacity: 1n }] }, 100n)
    ).toThrow();
});

test("lower capacity preserves already earned production and rejects corrupt schedules", () => {
    const full = settleProduction(production, 32400000n);
    expect(full.amount).toBe(900n);
    const reduced = changeProductionRate(full, 32400000n, [
        { at: 32400000n, perHour: 100n * productionScale, capacity: 10n },
    ]);
    expect(settleProduction(reduced, 36000000n).amount).toBe(900n);
    expect(settleProduction({ ...reduced, amount: 0n }, 36000000n).amount).toBe(10n);
    expect(() =>
        settleProduction({ ...production, rates: [production.rates[0]!, production.rates[0]!] }, 1n)
    ).toThrow();
    expect(() => settleProduction({ ...production, remainder: 3600000000000n }, 1n)).toThrow();
});
