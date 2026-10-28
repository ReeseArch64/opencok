import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    expeditionCalendarPlan,
    expeditionCalendarPhases,
} from "@opencok/rules/expedition-calendar";
import { expeditionPhaseView } from "@opencok/rules/expedition-phase";
import { expeditionPanels } from "@opencok/mappings/new-expedition";
import { publishExpeditionPhaseNotification } from "@opencok/services/expedition-phase";
import { recordExpeditionScore } from "@opencok/services/new-expedition";
import { sfs, fields, encode, type Fields } from "@opencok/messages/sfs";
import type { CityProgressionContext } from "@opencok/city/services/context";
test("unmatched expedition views retain waiting or matching while validated owned manifests supply active stages", async () => {
    const rules = await loadRules(),
        now = BigInt(Date.UTC(2040, 0, 1)),
        period = expeditionCalendarPlan({ legacy: [] }, rules, [1, 2], now).create!,
        phases = expeditionCalendarPhases(period),
        matching = phases[1]!,
        collecting = phases.find((row) => row.stage === 3)!;
    expect(expeditionPhaseView(period, {}, now).stage).toBe(0);
    expect(expeditionPhaseView(period, {}, matching.startTime).stage).toBe(0);
    expect(
        expeditionPhaseView(period, { admission: { periodId: period.id! } }, collecting.startTime),
    ).toMatchObject({ stage: 1, opponent: 0, endTime: matching.endTime });
    const schedule = phases.slice(2);
    expect(
        expeditionPhaseView(
            period,
            {
                manifest: {
                    periodId: period.id!,
                    matchServerId: 2,
                    startTime: schedule[0]!.startTime,
                    endTime: schedule.at(-1)!.endTime,
                    schedule: JSON.stringify(
                        schedule.map((x) => ({
                            ...x,
                            startTime: String(x.startTime),
                            endTime: String(x.endTime),
                        })),
                    ),
                },
            },
            collecting.startTime,
        ),
    ).toMatchObject({ stage: 3, opponent: 2 });
});
test("native expedition panels hide personal values, avoid a nonexistent opponent and retain historical and merge gates", async () => {
    const rules = await loadRules(),
        now = BigInt(Date.UTC(2040, 0, 1)),
        original = rules.power.activityPanels!.get("57155")!,
        profile = { uid: "owner", serverId: 1, expeditionCrossCount: 3 },
        state = {
            period: { matchServerId: 0 },
            phase: { stage: 1, startTime: now - 1000n, endTime: now + 1000n },
            progress: [{ stage: 1, score: 999, takeReward: "7" }],
            allianceScore: 123,
            kingdomScore: 50,
            rank: 4,
        };
    expect(expeditionPanels(state, profile, rules, now)).toEqual([]);
    rules.power.activityPanels!.set("57155", {
        ...original,
        start: "2030-01-01-00-00",
        end: "2100-01-01-00-00",
    });
    const [panel] = expeditionPanels(state, profile, rules, now);
    expect(panel!.score).toEqual(sfs.string("0"));
    expect(panel!.alliancescore).toEqual(sfs.double(0));
    expect(panel!.rank).toEqual(sfs.int(0));
    expect(panel!.count).toEqual(sfs.int(3));
    expect(panel!.kingdominfolist!.value).toHaveLength(1);
    expect(panel!.rewardlist).toBeUndefined();
    expect(panel!.type).toBeUndefined();
    expect(panel!.exchange).toEqual(sfs.string("0"));
    rules.power.activityPanels!.set("57155", original);
    rules.power.mergeActivities!.set("synthetic", {
        activityId: "57155",
        merge_start: "0",
        merge_end: "2",
    });
    expect(
        expeditionPanels({ ...state, lastMergeMillis: now - 60000n }, profile, rules, now)[0]!
            .merge,
    ).toEqual(sfs.bool(true));
    expect(
        expeditionPanels({ ...state, lastMergeMillis: now - 120000n }, profile, rules, now),
    ).toEqual([]);
});
test("expedition publication discards obsolete revisions exactly above Number precision and preserves the native command", async () => {
    const sent: { owner: string; command: string; body: Fields; }[] = [],
        body = { activity: sfs.array([sfs.object({ id: sfs.string("57155") })]) },
        revision = 9007199254740993n,
        payload = encode({
            owner: sfs.string("owner"),
            revision: sfs.string(String(revision)),
            body: sfs.object(body),
        }),
        publish = async (owner: string, command: string, body: Fields) => {
            sent.push({ owner, command, body });
        };
    expect(await publishExpeditionPhaseNotification(payload, "owner", revision + 1n, publish)).toBe(
        false,
    );
    expect(sent).toHaveLength(0);
    expect(await publishExpeditionPhaseNotification(payload, "owner", revision, publish)).toBe(
        true,
    );
    expect(sent[0]!.command).toBe("push.activity.update");
    expect(
        fields((sent[0]!.body.activity!.value as import("@opencok/messages/sfs").Value[])[0]).id,
    ).toEqual(sfs.string("57155"));
    await expect(
        publishExpeditionPhaseNotification(payload, "other", revision, publish),
    ).rejects.toThrow();
});
test("a display-only expedition phase cannot supply economic scoring even when it resembles an active training phase", () => {
    const write = {};
    recordExpeditionScore(
        {
            state: {
                expedition: {
                    projectionOnly: true,
                    phase: { stage: 7, startTime: 1n, endTime: 100n },
                },
            },
            write,
            now: 50n,
        } as unknown as CityProgressionContext,
        5,
        107000,
        5,
    );
    expect(write).toEqual({});
});
