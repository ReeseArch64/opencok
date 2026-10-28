import { expect, test } from "bun:test";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";
import { AllianceScienceService } from "../src/services/science";
import { AllianceSciencePolicy } from "../src/rules/science";
import { AllianceScienceMapper } from "../src/mappings/science";
import type { AllianceScienceContext, AllianceScienceState } from "../src/contracts/science";
import type { AllianceScienceRule } from "../src/contracts/science-catalog";
import type { AllianceRecord } from "../src/contracts/records";

const fail = (): never => {
    throw new Error("Unavailable alliance science");
};
const readers = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
};
const cityInteger = (value: unknown, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) => {
    const result = Number(value);

    if (!Number.isSafeInteger(result) || result < minimum || result > maximum)
    {
        fail();
    }

    return result;
};
const policy = new AllianceSciencePolicy({ num: readers.num, cityInteger, allianceFailure: fail });
const mapper = new AllianceScienceMapper(readers, policy);

function fixture(changes: Partial<AllianceScienceState> = {}, now = 1000n)
{
    const charges: [string, bigint][] = [];
    const draws: number[] = [];
    const rights: string[] = [];
    const ledger = {
        pushes: [] as { command: string; body: Fields; }[],
        total: () =>
            100n
            + charges.filter(([asset]) => asset === "gold").reduce(
                (sum, [, value]) => sum + value,
                0n,
            ),
    };
    const base: AllianceScienceRule = {
        id: "1000",
        science_lv: "0",
        value: "10;20",
        schedule: "5",
        contribution: "2",
        resource: "0;1",
        donate: "8;12",
        time: "10",
        max_lv: "1",
        power: "0",
        para1: "500",
        para2: "1",
        points: "3",
    };
    const rules = {
        power: {
            allianceSciences: new Map([
                ["1000", base],
                ["1001", { ...base, id: "1001", science_lv: "1", power: "30", para2: "2" }],
            ]),
        },
        items: new Map<string, AllianceScienceRule>([
            ["alliance_science", {
                k1: "1000",
                k2: "1000",
                k3: "10",
                k4: "1",
                k5: "2",
                k6: "10",
                k7: "2",
                k8: "2",
                k9: "1000",
                k10: "1000",
                k11: "2",
                k12: "3",
            }],
            ["alliance_science1", { k1: "2", k2: "3", k3: "50", k4: "100" }],
        ]),
    };
    let member: AllianceRecord = {
        uid: "owner",
        jointime: 0n,
        donateTime: 0n,
        donateCDTime: 0n,
        point: 7,
        accPoint: 12,
        progress: 0,
        todaydonate: 0,
        todayprogress: 0,
    };
    let alliance: AllianceRecord = { uid: "alliance", alliancepoint: 10n, targetScience: "[]" };
    const context: AllianceScienceContext<typeof ledger> = {
        owner: "owner",
        allianceId: "alliance",
        now,
        rules,
        ledger,
        state: {
            sciences: [policy.allianceScienceRow("alliance", 1000)],
            research: [],
            donations: [],
            history: [],
            inventory: { resource: { woodbind: 3n } },
            lords: [{ uid: "owner", firstJoinAllianceFlag: 1 }],
            ...changes,
        },
        write: {},
        productionOwners: new Set<string>(),
        member: () => member,
        alliance: () => alliance,
        list: () => [{ uid: "owner" }, { uid: "other" }],
        right: (key) => {
            rights.push(key);
        },
        scienceEffect: () => 0,
        setMember: (row) => {
            member = row;
        },
        setAlliance: (row) => {
            alliance = row;
        },
    };
    const runtime = {
        ...readers,
        cityInteger,
        allianceFailure: fail,
        randomInt: (maximum: number) => {
            draws.push(maximum);

            return 0;
        },
        rankingCalendar: () => ({ nextMonday: 604800000n }),
        activityEconomy: () => ({
            gold: (delta: bigint) => {
                charges.push(["gold", delta]);
            },
            resource: (asset: string, delta: bigint) => {
                charges.push([asset, delta]);
            },
        }),
    };

    return {
        context,
        rules,
        charges,
        draws,
        rights,
        service: new AllianceScienceService(context, runtime, policy, mapper),
    };
}

test("science policy preserves base identities, capped stages and pending rows", () => {
    const h = fixture();
    const rule = policy.allianceScienceRule(h.rules, 1000);
    expect(policy.allianceScienceStage(rule, 10)).toEqual({
        stage: 1,
        current: 0,
        required: 20,
        total: 30,
    });
    expect(policy.allianceScienceStage(rule, 35)).toEqual({
        stage: 1,
        current: 20,
        required: 20,
        total: 30,
    });
    expect(() => policy.allianceScienceRule(h.rules, 1001)).toThrow();
    expect(() => policy.allianceScienceRule(h.rules, 1000, 2)).toThrow();
    const row = h.context.state.sciences[0]!;
    expect(policy.allianceScienceRow("alliance", 1000, row)).toBe(row);
    expect(policy.allianceDonationCount({ point: 2 }, "point", 3)).toBe(5);
    expect(() => policy.allianceDonationCount({}, "point", -1)).toThrow();
});

test("opening saved donation offers does not reroll or replace their pinned costs", async () => {
    const h = fixture();
    const offer = h.service.offers(1000);
    expect(h.draws).toEqual([10000, 10000, 1000, 1000]);
    expect(offer).toMatchObject({
        lowres: "wood",
        lownum: 8,
        midnum: 16,
        highnum: 24,
        higprogress: 15,
    });
    const restart = fixture({ donations: [offer] });
    const result = await restart.service.command("al.science.fresh", { scienceId: sfs.int(1000) });
    expect(result).toEqual(mapper.options(offer));
    expect(restart.draws).toEqual([]);
    expect(restart.context.write).toEqual({});
    const refreshed = await h.service.command("al.science.fresh", { scienceId: sfs.int(1000) });
    expect(h.context.write.donations).toHaveLength(1);
    expect(decode(encode(refreshed))).toEqual(refreshed);
});

test("donation debits bound resources first and updates counters, cooldown, weekly history and quest action", async () => {
    const offer = fixture().service.offers(1000);
    const h = fixture({
        donations: [offer],
        history: [{
            uid: "owner",
            allianceId: "alliance",
            donateTime: -1n,
            donate: 100,
            progress: 100,
        }],
    });
    const result = await h.service.command("al.science.donate", {
        scienceId: sfs.int(1000),
        option: sfs.int(0),
    });
    expect(h.charges).toEqual([["woodbind", -3n], ["wood", -5n]]);
    expect(h.context.write.sciences?.[0]).toMatchObject({ donateprogress: 5, donatefinish: 0 });
    expect(h.context.member()).toMatchObject({
        point: 9,
        accPoint: 14,
        donateCDTime: 3000n,
        donateAvailable: 1,
        todaydonate: 2,
    });
    expect(h.context.alliance().alliancepoint).toBe(12n);
    expect(h.context.write.history).toEqual([{
        uid: "owner",
        allianceId: "alliance",
        donate: 2,
        progress: 5,
        donateTime: 1000n,
    }]);
    expect(h.context.write.actions).toEqual([{ uid: "owner", kind: "alliance.donate", count: 1 }]);
    expect(result.resourceCostType).toEqual(sfs.int(0));
    expect(result.resourceCostValue).toEqual(sfs.int(8));
    expect(decode(encode(result))).toEqual(result);
});

test("research pins target power and duration, then completion clears the queue and marks every production owner", async () => {
    const row = {
        ...policy.allianceScienceRow("alliance", 1000),
        donateprogress: 30,
        donatefinish: 1,
    };
    const h = fixture({ sciences: [row] });
    const result = await h.service.command("al.science.research", { scienceId: sfs.int(1000) });
    expect(h.rights).toEqual(["alliancescience"]);
    expect(result.startTime).toEqual(sfs.long(1000n));
    expect(result.finishTime).toEqual(sfs.long(11000n));
    expect([...h.context.productionOwners]).toEqual(["owner", "other"]);
    const saved = h.context.write.research![0]!;
    expect(JSON.parse((saved.accelerate as Buffer).toString())).toEqual({
        version: 1,
        from: 0,
        to: 1,
        power: 30,
    });
    const early = fixture({ sciences: h.context.write.sciences!, research: [saved] }, 10999n);
    expect(early.service.complete()).toEqual({});
    expect(early.context.write).toEqual({});
    const restarted = fixture({ sciences: h.context.write.sciences!, research: [saved] }, 12000n);
    restarted.rules.power.allianceSciences.get("1001")!.power = "99";
    const completed = restarted.service.complete();
    expect(restarted.context.write.sciences?.[0]).toMatchObject({
        level: 1,
        power: 30,
        donateprogress: 0,
    });
    expect(restarted.context.write.deletedResearch).toEqual(["alliance"]);
    expect(restarted.context.productionAt).toBe(12000n);
    expect([...restarted.context.productionOwners]).toEqual(["owner", "other"]);
    expect(completed.startTime).toBeUndefined();
    expect(restarted.context.ledger.pushes).toEqual([{
        command: "push.al.science",
        body: completed,
    }]);
});

test("legacy research recovery requires matching start time and rejects malformed generations", () => {
    const row = { ...policy.allianceScienceRow("alliance", 1000), researchstarttime: 1000n };
    const queue = {
        allianceId: "alliance",
        scienceId: 1000,
        startTime: 1000n,
        needTime: 1n,
        accelerate: Buffer.alloc(0),
    };
    const h = fixture({ sciences: [row], research: [queue] }, 1001n);
    expect(h.service.complete().level).toEqual(sfs.int(1));
    for (
        const changed of [
            { ...queue, startTime: 999n },
            {
                ...queue,
                accelerate: Buffer.from("{\"version\":2,\"from\":0,\"to\":1,\"power\":30}"),
            },
            {
                ...queue,
                accelerate: Buffer.from("{\"version\":1,\"from\":1,\"to\":2,\"power\":30}"),
            },
        ]
    )
    {
        const stale = fixture({ sciences: [row], research: [changed] }, 1001n);
        expect(() => stale.service.complete()).toThrow("Unavailable alliance science");
        expect(stale.context.write).toEqual({});
    }
});

test("cooldown clearing and target selection preserve costs and native representations", async () => {
    const h = fixture();
    h.context.setMember({ ...h.context.member(), donateCDTime: 3500n, donateAvailable: 0 });
    expect(await h.service.command("al.science.donate.cd", {})).toEqual({
        gold: sfs.long(98n),
        donateCDTime: sfs.long(0n),
    });
    expect(h.charges).toEqual([["gold", -2n]]);
    expect(h.context.member().donateAvailable).toBe(1);
    const result = await h.service.command("al.targetscience.set", {
        scienceId: sfs.string("1000"),
        isuse: sfs.int(1),
    });
    expect(result).toEqual({ targetScience: sfs.string("1000") });
    expect(h.context.alliance().targetScience).toBe("[\"1000\"]");
    expect(h.rights).toEqual(["alliancescience"]);
    await expect(h.service.command("al.science.donate.cd", {})).rejects.toThrow();
});

test("publication retains research times and the same science projection as initialization", () => {
    const research = {
        allianceId: "alliance",
        scienceId: 1000,
        startTime: 9007199254740993n,
        needTime: 10000n,
    };
    const h = fixture({ research: [research] });
    const row = h.context.state.sciences[0]!;
    const result = mapper.publication(row, h.rules, [research]);
    expect(result).toEqual(h.service.snapshot(row));
    expect(Object.keys(result)).toEqual([
        "scienceId",
        "level",
        "currentPro",
        "totalPro",
        "needPro",
        "star",
        "para1",
        "para2",
        "points",
        "nextPara2",
        "startTime",
        "finishTime",
    ]);
    expect(decode(encode(result)).finishTime).toEqual(sfs.long(9007199254750993n));
});
