import { long, text } from "@opencok/contracts/rows";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    expeditionCalendarPlan,
    expeditionCalendarPhases,
} from "@opencok/rules/expedition-calendar";
import { expeditionPhase } from "@opencok/rules/new-expedition";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
test("expedition bootstrap follows the UTC weekday and includes all nine configured stages", async () => {
    const rules = await loadRules(),
        now = BigInt(Date.UTC(2040, 0, 4, 12)),
        period = expeditionCalendarPlan({ legacy: [] }, rules, [2, 1], now).create!;
    const schedule = expeditionCalendarPhases(period);
    expect(schedule.map((x) => x.stage)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Date(Number(now)).getUTCDay()).toBe(3);
    expect(schedule[0]!.endTime).toBe(BigInt(Date.UTC(2040, 0, 11)));
    expect(period.expectedRealms).toBe("1|2");
    for (const phase of schedule)
    {
        expect(expeditionPhase(period, phase.startTime)?.stage).toBe(phase.stage);
        expect(expeditionPhase(period, phase.endTime)?.stage).not.toBe(phase.stage);
    }
    expect(expeditionPhase(period, long(period, "endTime"))).toBeUndefined();
});
test("expedition recovery pins an active schedule and skips expired cycles without replaying historical activity", async () => {
    const rules = await loadRules(),
        now = BigInt(Date.UTC(2040, 0, 1)),
        prior = expeditionCalendarPlan({ legacy: [] }, rules, [1], now).create!;
    rules.items.delete("17_wk");
    expect(
        expeditionCalendarPlan({ latest: prior, legacy: [] }, rules, [1], now + 1n).current,
    ).toEqual(prior);
    const restored = await loadRules(),
        end = long(prior, "endTime"),
        at = end + 10n * 1209600000n + 1000n,
        next = expeditionCalendarPlan({ latest: prior, legacy: [] }, restored, [1, 2], at);
    expect(next.close).toBe(text(prior, "id"));
    expect(next.create!.startTime).toBe(end + 10n * 1209600000n);
    expect(next.create!.cycle).toBe(12);
    expect(next.create!.expectedRealms).toBe("1|2");
    expect(expeditionPhase(next.create, at)?.stage).toBe(0);
});
test("legacy expedition adoption preserves the current and future stage boundaries and rejects ambiguous inputs", async () => {
    const rules = await loadRules(),
        now = BigInt(Date.UTC(2040, 0, 1)),
        legacy = {
            uuid: "imported",
            state: 4,
            startTime: now - 1000n,
            endTime: now + 1000n,
            count: 9,
        };
    const period = expeditionCalendarPlan({ legacy: [legacy] }, rules, [1], now).create!,
        schedule = expeditionCalendarPhases(period);
    expect(schedule[0]).toEqual({ stage: 4, startTime: legacy.startTime, endTime: legacy.endTime });
    expect(schedule.map((x) => x.stage)).toEqual([4, 5, 6, 7, 8]);
    expect(period.sourceId).toBe("imported");
    expect(period.cycle).toBe(9);
    expect(legacy.endTime).toBe(now + 1000n);
    expect(() =>
        expeditionCalendarPlan({ legacy: [legacy, { ...legacy, uuid: "second" }] }, rules, [1], now)
    ).toThrow();
    expect(() => expeditionCalendarPlan({ legacy: [{ ...legacy, state: 9 }] }, rules, [1], now))
        .toThrow();
});
test("disabled expedition configuration and a reversed clock preserve saved periods without issuing a replacement", async () => {
    const rules = await loadRules(),
        now = BigInt(Date.UTC(2040, 0, 1)),
        prior = expeditionCalendarPlan({ legacy: [] }, rules, [1], now).create!;
    expect(expeditionCalendarPlan({ latest: prior, legacy: [] }, rules, [1], now - 1n)).toEqual({});
    rules.features.set("17_wk", {
        ...rules.features.get("17_wk")!,
        online: "close",
        test: "close",
    });
    expect(expeditionCalendarPlan({ latest: prior, legacy: [] }, rules, [1], now + 1n)).toEqual({});
});
test("expedition admission samples its clock after obtaining the shared calendar transaction", async () => {
    const rules = await loadRules();
    let now = Date.UTC(2040, 0, 4, 23, 59, 59, 999);
    const service = new ExpeditionCalendarService(
        {
            reconcile: async (build) => {
                now++;
                return build({ legacy: [] }).current;
            },
        },
        rules,
        [1],
        () => now,
    );
    const period = await service.refresh();
    expect(expeditionCalendarPhases(period!)[0]!.endTime).toBe(BigInt(Date.UTC(2040, 0, 11)));
    expect(period!.startTime).toBe(BigInt(now));
});
