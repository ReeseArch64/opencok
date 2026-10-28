import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    generalDrawState,
    generalDrawPurchase,
    generalDrawScore,
} from "@opencok/hero/rules/general-draws";
import { loadGeneralDrawRanking } from "@opencok/hero/storage/general-draws";
const rules = await loadRules();
rules.power.activityPanels!.set("57153", { start: "1970-01-01-00-00", end: "2100-01-01-00-00" });
test("draw thresholds, free cooldowns, discounted batches, and score conservation", () => {
    const state = generalDrawState(rules, undefined, "owner", 1000000n),
        normal = generalDrawPurchase(rules, state, 0, 10, 100, 1000000n);
    expect(normal.gold).toBe(855n);
    expect(normal.row).toMatchObject({
        normal_total: 10,
        normal_free: 0,
        silver_usable: 2,
        gold_usable: 1,
    });
    const silver = generalDrawPurchase(rules, normal.row, 1, 3, 100, 1000000n);
    expect(silver.gold).toBe(200n);
    expect(silver.row.silver_usable).toBe(0);
    expect(generalDrawScore(rules, silver.row)).toBe(16);
    expect(() => generalDrawPurchase(rules, silver.row, 1, 1, 100, 1000000n)).toThrow();
    expect(generalDrawState(rules, silver.row, "owner", 1000001n).normal_free).toBe(0);
    expect(generalDrawState(rules, silver.row, "owner", 87400000n).normal_free).toBe(1);
});
test("ranking publications are bounded, stop at gaps, and preserve native key order", async () => {
    const rows = await loadGeneralDrawRanking(async (name, ...keys) => {
        expect(name).toBe("MGET");
        expect(keys[0]).toBe("GOLD_WHEEL_RANK_1");
        expect(keys.at(-1)).toBe("GOLD_WHEEL_RANK_1000");
        return ["{}", null, ...Array(998).fill("ignored")];
    });
    expect(rows).toEqual(["{}"]);
    await expect(loadGeneralDrawRanking(async () => [])).rejects.toThrow();
});
