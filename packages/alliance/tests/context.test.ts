import { expect, test } from "bun:test";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { AllianceContext } from "../src/services/context";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import type { AllianceContextCatalog } from "../src/contracts/context-catalog";
import type { AllianceContextState } from "../src/contracts/context-state";
import type { AllianceContextFactories } from "../src/contracts/context-factories";
import type { AllianceRecord } from "../src/contracts/records";

function fixture()
{
    const profile: AllianceRecord = { uid: "owner", allianceId: "guild" };
    const state: AllianceContextState = {
        now: 9007199254740993n,
        inventory: { profile, resource: {} },
        selection: {},
        profiles: [profile, { uid: "other", allianceId: "guild" }],
        alliances: [{ uid: "guild", maxMember: 10 }],
        members: [{ uid: "owner", allianceId: "guild", rank: 5 }, {
            uid: "other",
            allianceId: "guild",
            rank: 1,
        }],
        powers: [{ uid: "owner", power: 9007199254740993n }],
        cities: [{ uid: "owner", itemId: 400000, level: 9 }],
        helps: [],
        queues: [],
        activities: [],
        gifts: [],
        sharedGifts: [],
        sciences: [],
        research: [],
        donations: [],
        history: [],
        blacklist: [],
        applications: [],
        mails: [],
        lords: [],
        points: [],
        marches: [],
        directory: [],
        directoryTotal: 0n,
        candidates: [],
    };
    const rules: AllianceContextCatalog = {
        kingdomId: 1,
        mail: new Map(),
        items: new Map([["alliance_cost", { rename: "123" }]]),
        alliance: { ranks: new Map([["7105", { invite: "1" }], ["7101", { invite: "0" }]]) },
        power: {
            allianceSciences: new Map([
                ["101", { para1: "500;142", para2: "1.9" }],
                ["202", { para1: "500", para2: "2.1" }],
            ]),
        },
    };
    const calls: string[] = [], seen: unknown[] = [], gold: bigint[] = [];
    const ledger = {
        pushes: [] as { command: string; body: Fields; }[],
        total: () => 17n,
        add: () => undefined,
    };
    const result = (name: string): Fields => {
        calls.push(name);
        return { operation: sfs.string(name) };
    };
    const factories: AllianceContextFactories<AllianceContextCatalog, typeof ledger> = {
        help: (c) => {
            seen.push(c);

            return { command: async (name) => result("help:" + name) };
        },
        gifts: (c) => {
            seen.push(c);

            return {
                command: (name) => result("gift:" + name),
                publish: () => result("gift:publish"),
            };
        },
        science: (c) => {
            seen.push(c);

            return {
                command: async (name) => result("science:" + name),
                complete: () => result("complete"),
                snapshots: (id) => sfs.string(id),
            };
        },
        governance: (c) => {
            seen.push(c);

            return { command: (name) => result("governance:" + name) };
        },
        applicationsFactory: (c) => {
            seen.push(c);

            return {
                command: (name) => result("application:" + name),
                queries: (name) => result("application-query:" + name),
            };
        },
        membershipFactory: (c) => {
            seen.push(c);

            return {
                create: () => result("create"),
                join: (uid, row, rank) => result(`join:${uid}:${row.uid}:${rank}`),
                remove: (uid) => result("remove:" + uid),
            };
        },
        queriesFactory: (c) => {
            seen.push(c);

            return { command: (name) => result("query:" + name) };
        },
        snapshotFactory: (c) => {
            seen.push(c);

            return {
                snapshot: (row, member) => result(`snapshot:${row?.uid}:${member?.uid}`),
            };
        },
    };
    let effect = 4.5, rejectEffect = false;
    const runtime = {
        text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
        num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
        long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
        errors: { locked: "locked", full: "full" },
        allianceFailure: (code = "invalid"): never => {
            throw new Error(code);
        },
        cityInteger: (value: unknown) => {
            const n = Number(value);

            if (!Number.isSafeInteger(n))
            {
                throw new Error("invalid integer");
            }

            return n;
        },
        activityEconomy: (value: typeof ledger) => {
            expect(value).toBe(ledger);

            return {
                gold: (delta: bigint) => {
                    gold.push(delta);
                },
            };
        },
        effect: async (id: number) => {
            calls.push("effect:" + id);

            if (rejectEffect)
            {
                throw new Error("effect unavailable");
            }

            return effect;
        },
    };
    const context = new AllianceContext(
        "owner",
        state,
        rules,
        ledger,
        runtime,
        new AllianceMembershipPolicy(runtime),
        factories,
    );

    return {
        context,
        state,
        rules,
        calls,
        seen,
        gold,
        setEffect: (value: number) => {
            effect = value;
        },
        rejectEffect: () => {
            rejectEffect = true;
        },
    };
}

test("context overlays pending members and alliances without changing saved rows", () => {
    const h = fixture();
    const savedMember = h.context.member(), savedAlliance = h.context.alliance();
    h.context.setMember({ uid: "owner", allianceId: "guild", rank: 2 });
    h.context.setMember({ uid: "owner", allianceId: "guild", rank: 3 });
    h.context.setAlliance({ uid: "guild", maxMember: 20 });
    expect(h.context.member().rank).toBe(3);
    expect(h.context.write.members).toHaveLength(1);
    expect(h.context.alliance().maxMember).toBe(20);
    expect(savedMember.rank).toBe(5);
    expect(savedAlliance.maxMember).toBe(10);
    expect(h.context.list()[0]).toBe(savedMember);
    expect(h.context.allianceId).toBe("guild");
    expect(h.context.now).toBe(9007199254740993n);
    expect(h.context.write).not.toBe(fixture().context.write);
    expect(h.context.productionOwners.size).toBe(0);
    h.context.productionOwners.add("owner");
    h.context.productionAt = 77n;
    expect(h.context.productionAt).toBe(77n);
    expect(h.state.now).toBe(9007199254740993n);
});

test("membership binds profiles, rejects cleared or foreign pending rows and enforces rank rights", () => {
    const h = fixture();
    expect(() => h.context.right("invite")).not.toThrow();
    h.context.setMember({ uid: "owner", allianceId: "guild", rank: 1 });
    expect(() => h.context.right("invite")).toThrow("locked");
    h.context.setMember({ uid: "owner", allianceId: "elsewhere", rank: 5 });
    expect(() => h.context.member()).toThrow("locked");
    h.context.setMember({ uid: "owner", allianceId: "", rank: 0 });
    expect(() => h.context.member()).toThrow("locked");
    const foreign = fixture();
    foreign.state.profiles[0]!.allianceId = "elsewhere";
    expect(() => foreign.context.member()).toThrow("locked");
    expect(() => foreign.context.member("missing")).toThrow("invalid");
    expect(() => foreign.context.member("owner", "")).toThrow("locked");
});

test("context readers and costs retain exact power, castle identity and failure behavior", () => {
    const h = fixture();
    expect(h.context.power("owner")).toBe(9007199254740993n);
    expect(h.context.power("unknown")).toBe(0n);
    expect(h.context.castle("owner")).toBe(9);
    expect(h.context.castle("unknown")).toBe(0);
    expect(() => h.context.alliance("unknown")).toThrow("invalid");
    expect(() => h.context.profile("unknown")).toThrow("invalid");
    h.context.cost("rename");
    expect(h.gold).toEqual([-123n]);
    expect(() => h.context.cost("unknown")).toThrow("invalid integer");
    expect(h.gold).toEqual([-123n]);
});

test("context keeps local science arithmetic separate from injected player effects", async () => {
    const h = fixture();
    h.state.sciences = [
        { allianceId: "guild", scienceId: 100, level: 1 },
        { allianceId: "guild", scienceId: 200, level: 2 },
        { allianceId: "guild", scienceId: 300, level: 1 },
        { allianceId: "elsewhere", scienceId: 100, level: 1 },
    ];
    expect(h.context.scienceEffect(500)).toBe(4);
    expect(h.context.scienceEffect(142)).toBe(1.9);
    expect(h.context.scienceEffect(500, "elsewhere")).toBe(1.9);
    expect(h.context.scienceEffect(999)).toBe(0);
    expect(await h.context.effect(142)).toBe(4.5);
    expect(h.calls).toEqual(["effect:142"]);
    for (const value of [NaN, Infinity, -Infinity])
    {
        h.setEffect(value);
        await expect(h.context.effect(142)).rejects.toThrow("invalid");
    }
    h.rejectEffect();
    await expect(h.context.effect(142)).rejects.toThrow("effect unavailable");
});

test("initialization, creation and query/application dispatch precede membership admission", async () => {
    const h = fixture();
    h.state.members = [];
    const cases: readonly [string, string][] = [
        ["alliance.tick", "complete"],
        ["alliance.init", "query:alliance.init"],
        ["al.create", "create"],
        ["al.check", "query:al.check"],
        ["al.apply", "application:al.apply"],
        ["al.acceptinvite", "application:al.acceptinvite"],
        ["al.applylist", "application-query:al.applylist"],
        ["al.apply.message", "application-query:al.apply.message"],
    ];
    for (const [command, expected] of cases)
    {
        expect(await h.context.command(command!, {})).toEqual({ operation: sfs.string(expected!) });
    }
    expect(h.calls).toEqual(cases.map((entry) => entry[1]));
    expect(h.seen.every((value) => value === h.context)).toBe(true);
    await expect(h.context.command("al.callhelp", {})).rejects.toThrow("locked");
    expect(h.calls).toHaveLength(cases.length);
});

test("specialized commands and governance share the current membership gate", async () => {
    const h = fixture();
    const cases: readonly [string, string][] = [
        ["al.science.donate", "science:al.science.donate"],
        ["al.targetscience.set", "science:al.targetscience.set"],
        ["al.callhelp", "help:al.callhelp"],
        ["al.opengift", "gift:al.opengift"],
        ["al.attr", "governance:al.attr"],
    ];
    for (const [command, expected] of cases)
    {
        expect(await h.context.command(command!, {})).toEqual({ operation: sfs.string(expected!) });
    }
    h.state.members = [];
    for (const [command] of cases)
    {
        await expect(h.context.command(command!, {})).rejects.toThrow("locked");
    }
    expect(h.calls).toHaveLength(cases.length);
    expect(h.seen.every((value) => value === h.context)).toBe(true);
});

test("snapshot, science and membership ports forward the same context and preserve defaults", () => {
    const h = fixture();
    const row = h.context.alliance(), member = h.context.member();
    expect(h.context.snapshot(row, member)).toEqual({
        operation: sfs.string("snapshot:guild:owner"),
    });
    expect(h.context.snapshot()).toEqual({ operation: sfs.string("snapshot:undefined:undefined") });
    expect(h.context.scienceSnapshots("guild")).toEqual(sfs.string("guild"));
    expect(h.context.join("other", row)).toEqual({ operation: sfs.string("join:other:guild:1") });
    expect(h.context.join("other", row, 5)).toEqual({
        operation: sfs.string("join:other:guild:5"),
    });
    expect(h.context.remove("other")).toEqual({ operation: sfs.string("remove:other") });
    expect(h.seen.every((value) => value === h.context)).toBe(true);
});
