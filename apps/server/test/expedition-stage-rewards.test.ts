import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    expeditionStagePrizes,
    expeditionAwardId,
    expeditionAwardOperation,
} from "@opencok/rules/expedition-stage-rewards";
import {
    expeditionHistory,
    expeditionHistorySnapshot,
} from "@opencok/mappings/expedition-stage-rewards";
import { pinProgressionReward } from "../../../packages/services/src/progression-rewards";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
test("maintained expedition target, ranking and kingdom reward catalogs all resolve to claimable funded mail", async () => {
    const rules = await loadRules(),
        ids = new Set<string>();
    for (const row of rules.advanced.expeditionRewards!.values())
    {
        if (row.reward)
        {
            ids.add(row.reward);
        }
    }
    for (const row of rules.advanced.expeditionStages!.values())
    {
        for (const ranges of [row.rankreward, row.statereward])
        {
            for (const pair of (ranges ?? "").split("|").filter(Boolean))
            {
                ids.add(pair.split(";")[1]!);
            }
        }
    }
    expect(ids.size).toBeGreaterThan(0);
    for (const id of ids)
    {
        expect(
            mailRewardEntries(pinProgressionReward({ rules, now: BigInt(Date.now()) }, id)).length,
        ).toBeGreaterThan(0);
    }
});
test("expedition reward boundaries preserve strict guild contribution limits, frozen sciences, claimed tiers and kingdom victory", async () => {
    const rules = await loadRules();
    rules.advanced.expeditionRewards!.clear();
    rules.advanced.expeditionRewards!.set("1", {
        id: "1",
        stage: "7",
        type: "1",
        castle_min: "1",
        castle_max: "40",
        target: "10",
        reward: "249200",
    });
    rules.advanced.expeditionRewards!.set("2", {
        id: "2",
        stage: "7",
        type: "2",
        castle_min: "1",
        castle_max: "40",
        target: "20",
        reward: "249200",
    });
    rules.advanced.expeditionRewards!.set("3", {
        id: "3",
        stage: "7",
        type: "1",
        castle_min: "1",
        castle_max: "40",
        target: "10",
        reward: "249200",
        science_quest: "science",
    });
    rules.items.set("17_wk", { ...rules.items.get("17_wk")!, k1: "10", k2: "10", k12: "science" });
    const closure = { stage: 7, winner: 1 },
        member = {
            score: 10,
            allianceId: "guild",
            takeReward: "",
            eligibility: JSON.stringify({ home: true, level: 1, sciences: [] }),
        };
    expect(
        expeditionStagePrizes(closure, member, { rank: 1, allianceScore: 20 }, rules).claims,
    ).toEqual([1]);
    const earned = expeditionStagePrizes(
        closure,
        {
            ...member,
            score: 11,
            eligibility: JSON.stringify({ home: true, level: 1, sciences: ["science"] }),
        },
        { rank: 1, allianceScore: 20 },
        rules,
    );
    expect(earned.claims).toEqual([1, 2, 3]);
    expect(earned.plans.map((row) => row.template)).toEqual([
        "12057",
        "12055",
        "12076",
        "12056",
        "12055",
        "12076",
        "12061",
    ]);
    expect(
        expeditionStagePrizes(
            { ...closure, winner: 2 },
            { ...member, score: 0 },
            { rank: 1, allianceScore: 999 },
            rules,
        ).plans,
    ).toEqual([]);
    expect(
        expeditionStagePrizes(
            closure,
            { ...member, takeReward: "1|3" },
            { rank: 0, allianceScore: 20 },
            rules,
        ).claims,
    ).toEqual([]);
    expect(() => expeditionStagePrizes(closure, { ...member, takeReward: "malformed" }, {}, rules))
        .toThrow();
    rules.items.set("17_wk", { ...rules.items.get("17_wk")!, k2: "11.5" });
    expect(
        expeditionStagePrizes(
            closure,
            { ...member, score: 11 },
            { rank: 0, allianceScore: 20 },
            rules,
        ).plans.some((row) => row.kind === "kingdom"),
    ).toBe(false);
    expect(
        expeditionStagePrizes(
            closure,
            { ...member, score: 11.5 },
            { rank: 0, allianceScore: 20 },
            rules,
        ).plans.some((row) => row.kind === "kingdom"),
    ).toBe(true);
    expect(expeditionAwardOperation(expeditionAwardId("period", 7, "owner"))).toMatch(
        /^expedition-award:[a-f0-9]{32}$/,
    );
});
test("expedition history preserves native field order, empty missing kingdom metadata and rejects malformed legacy reports", () => {
    const result = {
            stage: 7,
            leader: 1,
            opponent: 2,
            winner: 2,
            finalizedAt: 9007199254740993n,
            ranking: JSON.stringify({
                users: [
                    {
                        uid: "u",
                        metadata: JSON.stringify({
                            name: "N",
                            pic: "p",
                            picVer: 1,
                            picfraId: 0,
                            abbr: "A",
                            serverId: 2,
                        }),
                    },
                ],
            }),
        },
        snapshot = expeditionHistorySnapshot(result),
        body = expeditionHistory([{ history: snapshot }], []),
        row = fields((body.ranklist!.value as Value[])[0]);
    expect(Object.keys(row)).toEqual(["stage", "begintime", "userlist", "kingdomlist"]);
    expect(row.begintime).toEqual(sfs.long(9007199254740993n));
    expect((row.kingdomlist!.value as Value[]).map(fields)).toEqual([{}, {}]);
    expect(() => expeditionHistory([{ stageId: 7, createTime: 1n, users: "invalid" }], []))
        .toThrow();
    expect(() => expeditionHistory([{ stageId: 7, createTime: 1n, users: "" }], [])).toThrow();
});
