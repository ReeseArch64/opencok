import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    costRankingPeriodId,
    costRankingBands,
    costRankingPlan,
    verifyCostFactCoverage,
} from "@opencok/rules/continued-cost-ranking";
import { costRankingEntry } from "@opencok/mappings/continued-cost-ranking";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs } from "@opencok/messages/sfs";
test("consumption period identities, realm census and prize bands retain exact pinned windows", async () => {
    const rules = await loadRules();
    for (const key of ["continued_cost", "new_rank_cost"])
    {
        rules.features.set(key, { online: "1;2", test: "close", version: "1.0.0" });
    }
    const plan = costRankingPlan(rules, [3, 2, 1, 1])!;
    expect(plan.expectedRealms).toEqual([1, 2]);
    expect(plan.id).toBe(costRankingPeriodId(plan.startTime, plan.endTime, plan.type));
    expect(plan.id).not.toBe(costRankingPeriodId(plan.startTime, plan.endTime + 1n, plan.type));
    expect(costRankingBands(plan.rewards).at(-1)?.max).toBe(100);
    expect(() => costRankingBands("1;10;236039|10;20;236040")).toThrow();
    expect(() => costRankingBands("1;101;236039")).toThrow();
});
test("consumption ranking JSON keeps native long precision and presentation widths without revealing unrelated profile fields", () => {
    const value = costRankingEntry(
            {
                uid: "owner",
                score: 9007199254740993n,
                kingdomId: 2,
                type: 1,
                metadata: JSON.stringify({
                    name: "Synthetic",
                    pic: "icon",
                    picVer: 2,
                    picfraId: 0,
                    hideKing: 1,
                    private: "excluded",
                }),
            },
            1,
        ),
        row = decodeLegacyJsonObject(value);
    expect(row.val).toEqual(sfs.long(9007199254740993n));
    expect(row.sid).toEqual(sfs.string("2"));
    expect(row.hideKing).toEqual(sfs.int(1));
    expect(row.rank).toEqual(sfs.int(1));
    expect(row.private).toBeUndefined();
});
test("consumption evidence must match owned negative postings and its paid and free split", () => {
    const value = {
            owner: "owner",
            at: 2n,
            start: 1n,
            end: 3n,
            type: 1,
            amount: 10n,
            paid: 3n,
            free: 7n,
            face: "",
            tiers: [],
        },
        postings = [
            { accountUid: "owner", asset: "profile.gold", before: 10n, after: 3n },
            { accountUid: "owner", asset: "profile.paidGold", before: 4n, after: 1n },
            { accountUid: "foreign", asset: "profile.gold", before: 999n, after: 0n },
        ];
    expect(() => verifyCostFactCoverage(value, postings)).not.toThrow();
    expect(() => verifyCostFactCoverage({ ...value, amount: 1009n }, postings)).toThrow();
    expect(() => verifyCostFactCoverage({ ...value, paid: 4n, free: 6n }, postings)).toThrow();
    expect(() =>
        verifyCostFactCoverage({ ...value, type: 2, amount: 2n, paid: 0n, free: 0n }, [
            { accountUid: "owner", asset: "item.stack", before: 3n, after: 1n },
        ])
    ).not.toThrow();
});
