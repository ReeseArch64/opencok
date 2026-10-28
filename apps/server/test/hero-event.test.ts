import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    heroScoreFlags,
    nextHeroPanel,
    heroEventRewards,
    heroEventBand,
} from "@opencok/hero/rules/hero-event";
import { heroEventInfo } from "@opencok/hero/mappings/hero-event";
import { sfs } from "@opencok/messages/sfs";
test("hero reward bands retain configured thresholds and personal levels while integer claim sets preserve native bucket order", async () => {
    const rules = await loadRules(),
        view = heroEventRewards({ eventId: "9001000" }, 0, rules);
    expect(view.targets).toEqual([3100, 10000, 33600]);
    expect(view.rewards).toHaveLength(3);
    expect(heroScoreFlags({ rewardFlag: "17,1,2,2" })).toBe("17,1,2");
    const state = {
        profile: { uid: "owner", allianceId: "" },
        activities: [],
        events: [],
        scores: [],
        castleLevel: 40,
        alliancePower: 0n,
        scoreManagerRunning: false,
        lastMergeMillis: 0n,
    };
    expect(heroEventBand({ uuid: "event", type: 1 }, state, rules).level).toBe(29);
    expect(heroEventBand({ uuid: "event", type: 2 }, state, rules).level).toBe(-1);
});
test("hero upcoming panels follow the native Sunday-first calendar and preserve mixed-event metadata insertion order", async () => {
    const rules = await loadRules();
    rules.items.set("heroactivity_on", { k1: "all", k2: "1.0.0" });
    rules.advanced.heroActivities!.set("9000000", {
        id: "9000000",
        type: "1",
        date: "1:0|2:0|3:1|4:0|5:0|6:0|7:0",
    });
    expect(nextHeroPanel(rules, 1, 1, BigInt(Date.UTC(2023, 0, 2, 12)))).toEqual({
        activityId: "9000000",
        startTime: BigInt(Date.UTC(2023, 0, 3)),
    });
    const fields = heroEventInfo([], 3, [
        { type: 4, ranking: 2, countries: [] },
        { type: 3, ranking: 3, countries: [] },
    ]);
    expect(Object.keys(fields)).toEqual([
        "vsCountry",
        "rankingAlliance",
        "ranking",
        "eventList",
        "type",
    ]);
    expect(fields.ranking).toEqual(sfs.int(3));
});
