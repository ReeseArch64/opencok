import type { Row } from "@opencok/contracts/rows";
import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { activityOperators } from "@opencok/rules/activity-operators";
import { activityOperatorsView } from "@opencok/mappings/activity-operators";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { encode, decode, fields, sfs, type Value } from "@opencok/messages/sfs";
import { configureOperators, operatorSnapshot, operatorsNow } from "./fixtures/activity-operators";
const context = { kingdomId: 1, version: "12.06.0", now: operatorsNow };
test("native operator projections use owned windows, actual opening facts and maintained module gates without enabling combat or unavailable backends", async () => {
    const rules = await loadRules();
    configureOperators(rules);
    const snapshot = operatorSnapshot();
    const entries = activityOperators(rules, snapshot, context);
    expect(entries.map((row) => row.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(entries.find((row) => row.id === 1)?.endTime).toBe(
        BigInt(operatorsNow - 86400000 + 4 * 86400000) / 1000n,
    );
    expect(entries.find((row) => row.id === 3)?.endTime).toBe(
        (BigInt(operatorsNow) + 3600001n) / 1000n,
    );
    expect(entries.find((row) => row.id === 4)?.endTime).toBe(
        (BigInt(operatorsNow) + 7200001n) / 1000n,
    );
    const wire = decode(encode(activityOperatorsView(entries)));
    expect((wire.activityList!.value as Value[]).map((row) => fields(row).id)).toEqual(
        [1, 2, 3, 4, 5, 6, 7].map(sfs.int),
    );
    expect(
        (wire.activityList!.value as Value[]).every(
            (row) => fields(row).endTime?.type === sfs.long(0).type,
        ),
    ).toBe(true);
    expect(snapshot.target?.endTime).toBe(BigInt(operatorsNow) + 3600001n);
    expect(
        activityOperators(
            rules,
            { ...snapshot, profile: { ...snapshot.profile!, crossFightSrcServerId: 2 } },
            context,
        ),
    ).toEqual([]);
});
test("operators reject foreign/banned principals and corrupt owned state, and missing/future opening facts never start relative events", async () => {
    const rules = await loadRules();
    configureOperators(rules);
    const snapshot = operatorSnapshot();
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "owner", serverId: 2 },
        { uid: "owner", serverId: 1, banFlag: 1 },
        { uid: "owner", serverId: 1, banTime: BigInt(operatorsNow) + 1n },
    ];
    for (const profile of profiles)
    {
        expect(() => activityOperators(rules, { ...snapshot, profile }, context)).toThrow();
    }
    expect(() =>
        activityOperators(
            rules,
            { ...snapshot, target: { ...snapshot.target!, uid: "other" } },
            context,
        )
    ).toThrow();
    expect(() =>
        activityOperators(
            rules,
            { ...snapshot, target: { ...snapshot.target!, beginTime: 10n, endTime: 9n } },
            context,
        )
    ).toThrow();
    for (const opening of [0n, BigInt(operatorsNow) + 1n])
    {
        const entries = activityOperators(
            rules,
            { ...snapshot, server: { activityTime: opening } },
            context,
        );
        expect(entries.some((row) => [1, 2, 5].includes(row.id))).toBe(false);
        expect(entries.some((row) => row.id === 3)).toBe(true);
    }
    rules.features.set("target_quest", {
        id: "target_quest",
        online: "all",
        test: "all",
        version: "13.0.0",
    });
    expect(activityOperators(rules, snapshot, context).some((row) => row.id === 3)).toBe(false);
    rules.advanced.activityPages = new Map(
        Array.from({ length: 4097 }, (_, index) => [
            String(index),
            { id: String(index + 1), Type: "6", call_activity: "synthetic" },
        ]),
    );
    expect(() => activityOperators(rules, snapshot, context)).toThrow();
});
test("operator window edges honor expired notes, country/castle eligibility, feature closure and seconds conversion", async () => {
    const rules = await loadRules();
    configureOperators(rules);
    const snapshot = operatorSnapshot();
    rules.features.set("continued_cost", {
        id: "continued_cost",
        version: "1.0.0",
        online: "close",
        test: "close",
    });
    expect(activityOperators(rules, snapshot, context).some((row) => row.id === 6)).toBe(false);
    expect(
        activityOperators(rules, { ...snapshot, country: "US" }, context).some((row) =>
            row.id === 4
        ),
    ).toBe(false);
    expect(
        activityOperators(
            rules,
            { ...snapshot, buildings: [{ itemId: 400000, level: 0 }] },
            context,
        ).some((row) => row.id === 4),
    ).toBe(false);
    const end = Date.UTC(2024, 0, 2);
    const entries = activityOperators(
        rules,
        {
            ...snapshot,
            target: { ...snapshot.target!, endTime: BigInt(end) },
            recall: { ...snapshot.recall!, endTime: BigInt(end) },
        },
        { ...context, now: end },
    );
    expect(entries.some((row) => [4, 5, 6, 7].includes(row.id))).toBe(false);
    rules.configuration.payControl!.set("69023", {
        k1: "1.0.0",
        k2: "all",
        k5: "0",
        k7: "2024-01-01-00-00",
        k8: "2024-01-02-00-00",
    });
    expect(
        activityOperators(rules, { ...snapshot, server: {} }, context).find((row) => row.id === 1)
            ?.endTime,
    ).toBe(BigInt(end) / 1000n);
});
test("activity.operators reaches its read-only owned snapshot, preserves native correlation and never calls gameplay mutations", async () => {
    const rules = await loadRules();
    configureOperators(rules);
    const calls: { owner: string; now: number; }[] = [];
    const game = createRealmGameService(
        {
            async activityOperators(owner: string, now: number)
            {
                calls.push({ owner, now });
                return operatorSnapshot();
            },
        } as unknown as GameStore,
        rules,
        { kingdomId: 1 },
        () => operatorsNow,
        {
            async reconcileAlliance()
            {
                throw new Error("Operator query attempted alliance mutation");
            },
            async cityProgression()
            {
                throw new Error("Operator query attempted a mutation");
            },
        },
    );
    const result = await game.execute("owner", "activity.operators", {
        _cok_: sfs.string("opaque"),
        cmdBaseTime: sfs.string("clock"),
    });
    expect(calls).toEqual([{ owner: "owner", now: operatorsNow }]);
    expect(result.body._cok_).toEqual(sfs.string("opaque"));
    expect(result.body.cmdBaseTime).toEqual(sfs.string("clock"));
    expect(result.pushes).toEqual([]);
    await expect(game.execute("other", "activity.operators", {})).rejects.toThrow();
});

test("group-buy operators use the matching saved round and reject corrupt or ambiguous persisted calendars", async () => {
    const { groupBuyPeriod } = await import("@opencok/rules/groupbuy");
    const rules = await loadRules();
    configureOperators(rules);
    const snapshot = operatorSnapshot(),
        period = groupBuyPeriod(rules)!;
    const row = {
        id: "synthetic",
        startTime: period.start,
        endTime: period.end,
        curRound: 1,
        roundInfo: JSON.stringify(period.rounds),
    };
    expect(
        activityOperators(rules, { ...snapshot, groupBuys: [row] }, context).find(
            (entry) => entry.id === 5,
        )?.endTime,
    ).toBe(period.end / 1000n);
    expect(() =>
        activityOperators(rules, { ...snapshot, groupBuys: [{ ...row, roundInfo: "{}" }] }, context)
    ).toThrow();
    expect(() =>
        activityOperators(
            rules,
            { ...snapshot, groupBuys: [row, { ...row, id: "other" }] },
            context,
        )
    ).toThrow();
    const closed = { ...period.rounds[0]!, cTime: operatorsNow - 1000, eTime: operatorsNow };
    expect(
        activityOperators(
            rules,
            { ...snapshot, groupBuys: [{ ...row, roundInfo: JSON.stringify([closed]) }] },
            context,
        ).some((entry) => entry.id === 5),
    ).toBe(false);
});

test("today-sale and overseas panels retain their separate backend gates and actual opening deadline", async () => {
    const rules = await loadRules(),
        snapshot = operatorSnapshot();
    rules.advanced.activityPages = new Map([
        ["sale", { id: "24", Type: "24" }],
        ["overseas", { id: "26", Type: "26" }],
    ]);
    expect(activityOperators(rules, snapshot, context)).toEqual([]);
    rules.configuration.payControl!.set("69026", {
        k1: "3.9.0",
        k2: "all",
        k4: "0",
        k5: "2016-01-01-00-00",
        k6: "2016-01-02-00-00",
    });
    rules.configuration.payControl!.set("69027", { k1: "3.9.0", k2: "all", k6: "7" });
    expect(activityOperators(rules, snapshot, context)).toEqual([
        { id: 24, endTime: 0n },
        { id: 26, endTime: (BigInt(operatorsNow) + 6n * 86400000n) / 1000n },
    ]);
    for (
        const activityTime of [0n, BigInt(operatorsNow) + 1n, BigInt(operatorsNow) - 7n * 86400000n]
    )
    {
        expect(activityOperators(rules, { ...snapshot, server: { activityTime } }, context))
            .toEqual([
                { id: 24, endTime: 0n },
            ]);
    }
    rules.configuration.payControl!.set("69026", { k1: "13.0.0", k2: "all" });
    expect(activityOperators(rules, snapshot, context).map((row) => row.id)).toEqual([26]);
    rules.configuration.payControl!.set("69027", { k1: "3.9.0", k2: "close", k6: "7" });
    expect(activityOperators(rules, snapshot, context)).toEqual([]);
});
