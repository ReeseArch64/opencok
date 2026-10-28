import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    heroCountryOrder,
    heroFinalityPeriod,
    heroFinalRankKey,
} from "@opencok/hero/rules/hero-ranking-finality";
import { HeroCalendarService } from "@opencok/hero/services/hero-calendar";
import type { HeroCalendarPlan } from "@opencok/hero/contracts/hero-calendar";
test("hero finality uses real realm cohorts and exact totals while equal country scores retain opponent order", async () => {
    const rules = await loadRules(),
        endTime = BigInt(Date.UTC(2040, 0, 1)),
        event = { type: 3, eventId: "9001024", endTime, serverGroup: "2|1" },
        period = heroFinalityPeriod(event, rules, [1, 2])!;
    expect(period.expectedRealms).toEqual([2, 1]);
    expect(heroFinalRankKey(period, 0)).toContain("_2|1_-");
    expect(
        heroCountryOrder(
            "2|1",
            new Map([
                [1, 9007199254740993n],
                [2, 9007199254740992n],
            ]),
        ),
    ).toBe("1|2|");
    expect(
        heroCountryOrder(
            "2|1",
            new Map([
                [1, 1n],
                [2, 1n],
            ]),
        ),
    ).toBe("2|1|");
    expect(() => heroCountryOrder("2|1", new Map([[1, 1n]]))).toThrow();
    expect(heroFinalityPeriod({ ...event, serverGroup: null }, rules, [1, 2])).toBeUndefined();
    expect(() => heroFinalityPeriod({ ...event, serverGroup: "1|3" }, rules, [1, 2])).toThrow();
});
test("hero calendar admission samples its clock after waiting for the owned calendar transaction", async () => {
    const rules = await loadRules();
    let now = Date.UTC(2023, 0, 2, 1, 59, 59, 900),
        plan: HeroCalendarPlan | undefined;
    const service = new HeroCalendarService(
        {
            reconcile: async (build) => {
                now = Date.UTC(2023, 0, 2, 2, 0, 0, 100);
                plan = build({ activities: [], events: [], blocked: false });
            },
        },
        rules,
        () => now,
    );
    await service.refresh();
    expect(plan!.events.find((event) => event.type === 1)!.readyTime).toBe(
        BigInt(Date.UTC(2023, 0, 2, 2)),
    );
});
