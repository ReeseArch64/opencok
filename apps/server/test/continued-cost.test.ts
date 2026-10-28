import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { continuedCostAmount, continuedCostClaims } from "@opencok/rules/continued-cost";
import { continuedCostSpending, readContinuedCostSpending } from "@opencok/mappings/continued-cost";
import { continuedCostOperation } from "@opencok/services/continued-cost";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import type { EconomyPosting } from "@opencok/contracts/mutation";
import { sfs, encode, decode } from "@opencok/messages/sfs";
test("confirmed cost classification counts actual negative gold pools, speed quantities and both resource pools", async () => {
    const rules = await loadRules(),
        posting = (asset: string, before: bigint, after: bigint): EconomyPosting => ({
            account: "owner",
            asset,
            before,
            after,
            reason: "synthetic",
        });
    const entries = [
        posting("profile.gold", 30n, 20n),
        posting("profile.paidGold", 50n, 30n),
        posting("profile.dmmPaidSpecialGold", 40n, 10n),
        posting("resource.wood", 12n, 10n),
        posting("resource.woodbind", 10n, 7n),
        posting("resource.food", 20n, 13n),
        posting("resource.iron", 10n, 6n),
        posting("resource.stone", 10n, 2n),
        posting("profile.gold", 20n, 100n),
        posting("item.speed", 4n, 1n),
        posting("item.ordinary", 1n, 0n),
    ];
    const items = [
        { uuid: "speed", itemId: "200220", count: 1, value: 0, vanishTime: 0n },
        { uuid: "ordinary", itemId: "200001", count: 0, value: 0, vanishTime: 0n },
    ];
    expect(continuedCostAmount(1, entries, items, rules)).toEqual({
        amount: 60n,
        free: 10n,
        paid: 50n,
    });
    expect(
        [2, 3, 4, 5, 6].map((type) => continuedCostAmount(type, entries, items, rules).amount),
    ).toEqual([3n, 5n, 7n, 4n, 8n]);
    expect([...continuedCostClaims(",1,11")]).toEqual([1, 11]);
    expect(() => continuedCostClaims(",1,1")).toThrow();
    expect(() => continuedCostClaims("1,2")).toThrow();
});
test("durable cost evidence retains long quantities, exclusive bounds and deterministic operation identities", () => {
    const value = {
        owner: "owner",
        at: 1000n,
        start: 1000n,
        end: 2000n,
        type: 1,
        amount: 9007199254740993n,
        paid: 9007199254740993n,
        free: 0n,
        face: "",
        tiers: [{ level: 1, point: 1000n, reward: "239301", important: "" }],
    };
    expect(readContinuedCostSpending(continuedCostSpending(value))).toEqual(value);
    const body = decode(Buffer.from(continuedCostSpending(value)));
    expect(() => readContinuedCostSpending(encode({ ...body, at: sfs.long(2000n) }))).toThrow();
    expect(() => readContinuedCostSpending(encode({ ...body, paid: sfs.long(1n) }))).toThrow();
    expect(() => readContinuedCostSpending(encode({ ...body, start: sfs.long(0n) }))).toThrow();
    expect(continuedCostOperation("owner", "x".repeat(128), "event").length).toBeLessThan(128);
    expect(continuedCostOperation("owner", "x", "event")).toBe(
        continuedCostOperation("owner", "x", "event"),
    );
    expect(continuedCostOperation("owner", "x", "event")).not.toBe(
        continuedCostOperation("other", "x", "event"),
    );
});
test("native continued-cost endpoints retain long correlation and cannot submit synthetic spending", async () => {
    const rules = await loadRules(),
        game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
            cityProgression: async () => ({ body: {}, pushes: [] }),
        });
    for (
        const command of [
            "continuedcost.info",
            "continuedcost.reward",
            "continuedcost.hideking",
            "continuedcost.global.reward",
        ]
    )
    {
        expect(
            (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body
                ._cok_,
        ).toEqual(sfs.long(9007199254740993n));
    }
    await expect(
        game.execute("owner", "continuedcost.apply", { amount: sfs.long(999999n) }),
    ).rejects.toThrow();
});
