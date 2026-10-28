import { expect, test } from "bun:test";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";
import { AllianceGovernanceService } from "../src/services/governance";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import { AllianceGovernanceMapper } from "../src/mappings/governance";
import type { AllianceGovernanceContext } from "../src/contracts/governance";
import type { AllianceRecord } from "../src/contracts/records";

const fail = (code = "invalid"): never => {
    throw new Error(code);
};
const runtime = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
    cityInteger: (value: unknown, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) => {
        const result = Number(value);

        if (!Number.isSafeInteger(result) || result < minimum || result > maximum)
        {
            fail();
        }

        return result;
    },
    allianceFailure: fail,
    unsupportedFailure: (): never => fail("unsupported"),
    errors: { locked: "locked", full: "full" },
};
const policy = new AllianceMembershipPolicy(runtime);

function fixture(owner = "leader", now = 172800001n)
{
    const members: AllianceRecord[] = [
        { uid: "leader", allianceId: "alliance", rank: 5 },
        { uid: "officer", allianceId: "alliance", rank: 4 },
        { uid: "member", allianceId: "alliance", rank: 1 },
    ];
    const profiles = new Map(members.map((row) => [String(row.uid), {
        uid: row.uid,
        offLineTime: 1n,
        crossFightSrcServerId: 0,
    }]));
    let alliance: AllianceRecord = {
        uid: "alliance",
        alliancename: "Original",
        abbr: "OLD",
        abbrRename: 0,
        rallyPoint: 99,
    };
    const charges: string[] = [];
    const removals: string[] = [];
    const events: string[] = [];
    const rankRights = [
        "name",
        "briefname",
        "slogan",
        "announcement",
        "alliancelanguage",
        "flag",
        "recruitment",
        "quest",
        "rankname",
        "rankup",
        "rankdown",
        "transfer",
        "dissolve",
        "kick",
    ];
    const context: AllianceGovernanceContext = {
        owner,
        now,
        allianceId: "alliance",
        rules: {
            alliance: {
                ranks: new Map([
                    ["7105", Object.fromEntries(rankRights.map((right) => [right, "1"]))],
                    ["7104", { quit: "1", kick: "1", rankup: "1", rankdown: "1" }],
                    ["7101", { quit: "1" }],
                ]),
            },
            items: new Map<string, Record<string, string>>([
                ["alliance_cost", { k11: "2", k12: "3", k8: "4", k6: "6", k5: "200" }],
                ["alliance_gift", { k3: "100000" }],
            ]),
        },
        state: { blacklist: [] },
        write: {},
        ledger: {
            total: () => {
                events.push("gold");
                return 9007199254740993n;
            },
        },
        member: (uid = owner) => policy.allianceMember(members, uid, "alliance"),
        alliance: () => alliance,
        profile: (uid = owner) => profiles.get(uid) ?? {},
        list: () => members,
        right: (key) => policy.allianceRight(context.member(), context.rules, key),
        cost: (key) => {
            charges.push(key);
        },
        snapshot: () => {
            events.push("snapshot");

            return {
                permission: sfs.object(
                    Object.fromEntries(
                        Object.entries(
                            policy.alliancePermissions(String(alliance.permission ?? "")),
                        ).map(([key, value]) => [key, sfs.int(value)]),
                    ),
                ),
            };
        },
        remove: (uid) => {
            removals.push(uid);
            return { removed: sfs.string(uid) };
        },
        setMember: (row) => {
            members[members.findIndex((member) => member.uid === row.uid)] = row;
        },
        setAlliance: (row) => {
            alliance = row;
        },
    };

    return {
        context,
        members,
        profiles,
        charges,
        removals,
        events,
        service: new AllianceGovernanceService(
            context,
            runtime,
            policy,
            new AllianceGovernanceMapper(runtime),
        ),
    };
}

test("presentation permissions retain six bounded keys without granting rank capabilities", () => {
    const h = fixture();
    const result = h.service.command("al.permission.modify", {
        rankData: sfs.string("0_1:0;2_2:1"),
    });
    expect(Object.keys(policy.alliancePermissions(String(h.context.alliance().permission))))
        .toHaveLength(6);
    expect(policy.alliancePermissions(String(h.context.alliance().permission))["0_1"]).toBe(0);
    expect(h.service.command("al.permission.get", {})).toEqual(result);
    expect(decode(encode(result))).toEqual(result);
    for (const changes of ["", "invite:1", "0_1:2", "0_1:0;0_1:1", "0_1:1:0", "__proto__:1"])
    {
        expect(() => h.service.command("al.permission.modify", { rankData: sfs.string(changes) }))
            .toThrow("invalid");
    }
    const officer = fixture("officer");
    expect(() => officer.service.command("al.permission.modify", { rankData: sfs.string("0_1:1") }))
        .toThrow("locked");
    expect(() => policy.allianceRight(officer.context.member(), officer.context.rules, "transfer"))
        .toThrow("locked");
    for (const raw of ["{", "null", "[]", "{\"unknown\":1}", "{\"0_1\":\"1\"}"])
    {
        expect(() => policy.alliancePermissions(raw)).toThrow("invalid");
    }
});

test("rank changes cannot promote self, reach own rank or demote a superior", () => {
    const h = fixture("officer");
    const result = h.service.command("al.setrank", {
        playerId: sfs.string("member"),
        rank: sfs.int(3),
    });
    expect(result).toEqual({ uid: sfs.string("member"), rank: sfs.int(3) });
    expect(h.context.member("member").rank).toBe(3);
    for (
        const [uid, rank] of [["officer", 2], ["member", 4], ["leader", 1], ["member", 5]] as const
    )
    {
        expect(() =>
            h.service.command("al.setrank", { playerId: sfs.string(uid), rank: sfs.int(rank) })
        ).toThrow();
    }
    expect(h.context.member("leader").rank).toBe(5);
    expect(h.context.member().rank).toBe(4);
});

test("leadership transfer preserves one leader, rally reset and wire evaluation order", () => {
    const h = fixture();
    const result = h.service.command("al.leader.trans", { playerId: sfs.string("officer") });
    expect(h.members.filter((row) => row.rank === 5).map((row) => row.uid)).toEqual(["officer"]);
    expect(h.context.member("leader").rank).toBe(4);
    expect(h.context.alliance().rallyPoint).toBe(0);
    expect(Object.keys(result)).toEqual(["alliance", "oldLeaderId", "oldLeaderRank", "gold"]);
    expect(result.oldLeaderId).toEqual(sfs.string("leader"));
    expect(result.gold).toEqual(sfs.long(9007199254740993n));
    expect(h.events).toEqual(["snapshot", "gold"]);
    expect(h.charges).toEqual([]);
    expect(decode(encode(result))).toEqual(result);
    for (const change of ["duplicate", "crossLeader", "crossTarget", "self"])
    {
        const rejected = fixture();
        if (change === "duplicate")
        {
            rejected.context.setMember({ ...rejected.context.member("member"), rank: 5 });
        }
        if (change === "crossLeader" || change === "crossTarget")
        {
            rejected.profiles.get(change === "crossLeader" ? "leader" : "officer")!
                .crossFightSrcServerId = 1;
        }
        expect(() =>
            rejected.service.command("al.leader.trans", {
                playerId: sfs.string(change === "self" ? "leader" : "officer"),
            })
        ).toThrow();
        expect(rejected.context.member("leader").rank).toBe(5);
        expect(rejected.charges).toEqual([]);
    }
});

test("inactive leader replacement observes rank-specific exact deadlines and charges once", () => {
    for (const [owner, days] of [["officer", 2], ["member", 3]] as const)
    {
        const deadline = BigInt(days) * 86400000n + 1n;
        const early = fixture(owner, deadline - 1n);
        expect(() => early.service.command("al.leader.replace", {})).toThrow("locked");
        expect(early.charges).toEqual([]);
        const due = fixture(owner, deadline);
        due.service.command("al.leader.replace", {});
        expect(due.context.member().rank).toBe(5);
        expect(due.charges).toEqual(["k7"]);
        const online = fixture(owner, deadline);
        online.profiles.get("leader")!.offLineTime = 0n;
        expect(() => online.service.command("al.leader.replace", {})).toThrow("locked");
    }
});

test("leave, kick and dissolve gate the existing member-removal workflow", () => {
    const member = fixture("member");
    expect(member.service.command("al.leave.v2", {})).toEqual({ removed: sfs.string("member") });
    expect(member.removals).toEqual(["member"]);
    const officer = fixture("officer");
    for (const uid of ["leader", "officer"])
    {
        expect(() => officer.service.command("al.kick", { playerId: sfs.string(uid) })).toThrow(
            "locked",
        );
    }
    officer.service.command("al.kick", { playerId: sfs.string("member") });
    expect(officer.removals).toEqual(["member"]);
    const leader = fixture();
    expect(() => leader.service.command("al.leave", {})).toThrow("locked");
    expect(() => leader.service.command("al.dismiss", {})).toThrow("locked");
    expect(leader.removals).toEqual([]);
    leader.members.splice(1);
    leader.service.command("al.dismiss", {});
    expect(leader.removals).toEqual(["leader"]);
    expect(leader.context.write).toEqual({ alliances: [], deletedAlliances: ["alliance"] });
});

test("attribute updates preserve rename charges, restrictions and native long values", () => {
    const h = fixture();
    const result = h.service.command("al.changeattr", {
        name: sfs.string("  Renamed  "),
        abbr: sfs.string("NEW"),
        icon: sfs.string("icon"),
        recruit: sfs.int(0),
        powerRestriction: sfs.string("100000"),
        castleRestriction: sfs.string("30"),
    });
    expect(h.context.alliance()).toMatchObject({
        alliancename: "Renamed",
        abbr: "NEW",
        abbrRename: 1,
        recruit: 0,
        powerRestriction: 100000n,
        castleRestriction: 30,
    });
    expect(h.charges).toEqual(["k1", "k3"]);
    expect(h.events).toEqual(["snapshot", "gold"]);
    expect(decode(encode(result))).toEqual(result);
    h.service.command("al.attr", { abbr: sfs.string("TWO") });
    expect(h.charges).toEqual(["k1", "k3", "k2"]);
    expect(h.context.alliance().abbrRename).toBe(2);
    for (
        const [key, value] of [
            ["name", "<bad>"],
            ["name", "a\u0000b"],
            ["castleRestriction", "31"],
            ["powerRestriction", "100001"],
            ["powerRestriction", "0.5"],
        ]
    )
    {
        expect(() => fixture().service.command("al.attr", { [key!]: sfs.string(value!) }))
            .toThrow();
    }
    expect(() => fixture("member").service.command("al.attr", { intro: sfs.string("text") }))
        .toThrow("locked");
    expect(() => fixture().service.command("unknown", {})).toThrow("unsupported");
});

test("blacklist changes retain saved identities, reject malformed state and enforce the serialized bound", () => {
    const h = fixture();
    const params: Fields = {
        isBlack: sfs.int(1),
        isAdd: sfs.int(1),
        allianceId: sfs.string("other"),
    };
    const result = h.service.command("al.blacklist.modify", params);
    expect(result).toEqual({ black: sfs.string("[\"other\"]"), white: sfs.string("[]") });
    expect(decode(encode(result))).toEqual(result);
    const restored = fixture();
    restored.context.state.blacklist = h.context.write.blacklist!;
    restored.service.command("al.blacklist.modify", params);
    expect(restored.context.write.blacklist).toEqual(h.context.write.blacklist);
    expect(restored.service.command("al.blacklist.modify", { ...params, isAdd: sfs.int(0) }).black)
        .toEqual(sfs.string("[]"));
    expect(() => fixture("officer").service.command("al.blacklist.modify", params)).toThrow(
        "locked",
    );
    for (
        const black of [
            "{",
            "{}",
            "[1]",
            JSON.stringify(Array.from({ length: 12 }, (_, index) => `${index}${"x".repeat(39)}`)),
        ]
    )
    {
        const invalid = fixture();
        invalid.context.state.blacklist = [{ allianceId: "alliance", black, white: "[]" }];
        expect(() => invalid.service.command("al.blacklist.modify", params)).toThrow();
        expect(invalid.context.write).toEqual({});
    }
});
