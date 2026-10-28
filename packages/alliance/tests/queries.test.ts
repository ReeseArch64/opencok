import { expect, test } from "bun:test";
import { decode, encode, fields, sfs } from "@opencok/messages/sfs";
import { AllianceQueryService } from "../src/services/queries";
import { AllianceSnapshotService } from "../src/services/snapshot";
import { AllianceQueryMapper } from "../src/mappings/queries";
import { AllianceSnapshotMapper } from "../src/mappings/snapshot";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import type { AllianceQueryContext } from "../src/contracts/queries";
import type { AllianceSnapshotContext } from "../src/contracts/snapshot";
import type { AllianceRecord } from "../src/contracts/records";

const fail = (): never => {
    throw new Error("invalid");
};
const runtime = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
    allianceFailure: fail,
    unsupportedFailure: (): never => {
        throw new Error("unsupported");
    },
};
const policy = new AllianceMembershipPolicy({
    ...runtime,
    cityInteger: Number,
    errors: { locked: "locked", full: "full" },
});

function fixture()
{
    const alliance: AllianceRecord = {
        uid: "guild",
        alliancename: "Guild",
        abbr: "GLD",
        maxMember: 10,
        curMember: 99,
        alliancepoint: 9007199254740993n,
        giftlevel: 2500,
        targetScience: "[\"100\",\"200\"]",
        rankone: "Recruit",
        rankfive: "Leader",
        recruit: 1,
    };
    const members: AllianceRecord[] = [
        { uid: "owner", allianceId: "guild", rank: 1, point: 7, jointime: 9007199254740993n },
        { uid: "leader", allianceId: "guild", rank: 5 },
    ];
    const profiles: AllianceRecord[] = [
        { uid: "owner", name: "Owner", allianceId: "guild", picVer: 1, picfraId: 2 },
        { uid: "leader", name: "Leader", allianceId: "guild" },
        { uid: "new", name: "New", allianceId: "guild" },
    ];
    const events: string[] = [];
    let permitInvite = true;
    const context: AllianceQueryContext & AllianceSnapshotContext = {
        owner: "owner",
        allianceId: "guild",
        state: {
            selection: {},
            directory: [],
            candidates: [],
            directoryTotal: 0n,
            profiles,
            alliances: [alliance],
            applications: [],
            lords: [],
            members,
        },
        write: {},
        alliance: (id = "guild") => {
            if (id !== "guild")
            {
                fail();
            }

            return alliance;
        },
        list: (id = "guild") => context.state.members.filter((row) => row.allianceId === id),
        profile: (uid) => {
            events.push(`profile:${uid}`);

            return profiles.find((row) => row.uid === uid) ?? fail();
        },
        right: () => {
            if (!permitInvite)
            {
                throw new Error("locked");
            }
        },
        power: (uid) => {
            events.push(`power:${uid}`);

            return uid === "owner" ? 9007199254740993n : 2n;
        },
        scienceEffect: (effect, id) => {
            expect([effect, id]).toEqual([500, "guild"]);

            return 1.9;
        },
        scienceSnapshots: (id) => {
            events.push(`science:${id}`);

            return sfs.array([]);
        },
        snapshot: (row) => snapshot.snapshot(row),
    };
    const snapshot = new AllianceSnapshotService(
        context,
        runtime,
        new AllianceSnapshotMapper(runtime, policy),
    );

    return {
        context,
        alliance,
        events,
        snapshot,
        queries: new AllianceQueryService(context, runtime, new AllianceQueryMapper(runtime)),
        denyInvite: () => {
            permitInvite = false;
        },
    };
}

test("snapshot projects pending membership and leadership without mutating saved rows", () => {
    const h = fixture();
    h.context.write.removedMembers = ["leader"];
    h.context.write.members = [
        { uid: "owner", allianceId: "guild", rank: 5, point: 20, jointime: 9007199254740993n },
        { uid: "new", allianceId: "guild", rank: 1 },
        { uid: "outsider", allianceId: "elsewhere", rank: 5 },
    ];
    const result = h.snapshot.snapshot();
    expect(result.member).toEqual(sfs.int(2));
    expect(result.maxMember).toEqual(sfs.int(11));
    expect(result.rank).toEqual(sfs.int(5));
    expect(result.point).toEqual(sfs.int(20));
    expect(result.learderUid).toEqual(sfs.string("owner"));
    expect(result.fightpower).toEqual(sfs.long(9007199254740995n));
    expect(result.alliancepoint).toEqual(sfs.long(9007199254740993n));
    expect(result.jointime).toEqual(sfs.long(9007199254740993n));
    expect(result.alliancename).toBe(result.name);
    expect(result.curMember).toBe(result.member);
    expect(result.currentlevel).toEqual(sfs.int(2));
    expect(result.nextlevel).toEqual(sfs.int(3000));
    expect(result.targetScience).toEqual(sfs.string("100;200"));
    expect(h.events).toEqual(["profile:owner", "power:owner", "power:new", "science:guild"]);
    expect(h.context.state.members[0]!.rank).toBe(1);
    expect(h.alliance.curMember).toBe(99);
    expect(decode(encode(result))).toEqual(result);
});

test("snapshot enforces one projected leader and retains native defaults and field order", () => {
    const h = fixture();
    const result = h.snapshot.snapshot();
    expect(Object.keys(result)).toEqual([
        "uid",
        "name",
        "abbr",
        "intro",
        "announce",
        "language",
        "member",
        "maxMember",
        "recruit",
        "rank",
        "point",
        "accPoint",
        "learderUid",
        "learderName",
        "fightpower",
        "alliancename",
        "curMember",
        "alliancepoint",
        "icon",
        "bannerStyle",
        "permission",
        "donateCDTime",
        "donateAvailable",
        "jointime",
        "currentlevel",
        "nextlevel",
        "allianceScience",
        "rankone",
        "ranktwo",
        "rankthree",
        "rankfour",
        "rankfive",
        "targetScience",
    ]);
    expect(result.donateAvailable).toEqual(sfs.int(1));
    expect(Object.keys(fields(result.permission!))).toEqual([
        "0_1",
        "0_2",
        "1_1",
        "1_2",
        "2_1",
        "2_2",
    ]);
    const outside = h.snapshot.snapshot(h.alliance, {});
    expect(outside.rank).toEqual(sfs.int(0));
    expect(outside.jointime).toEqual(sfs.long(0n));
    const absent = fixture();
    absent.context.write.removedMembers = ["leader"];
    expect(() => absent.snapshot.snapshot()).toThrow("invalid");
    const duplicate = fixture();
    duplicate.context.write.members = [{ uid: "owner", allianceId: "guild", rank: 5 }];
    expect(() => duplicate.snapshot.snapshot()).toThrow("invalid");
    const malformed = fixture();
    malformed.alliance.permission = "{\"unknown\":1}";
    expect(() => malformed.snapshot.snapshot()).toThrow("invalid");
});

test("initialization checks actual membership while view and rank retain selected alliance scope", () => {
    const h = fixture();
    expect(fields(h.queries.command("alliance.init").alliance!).uid).toEqual(sfs.string("guild"));
    const absent = fixture();
    absent.context.state.members = [{ uid: "leader", allianceId: "guild", rank: 5 }];
    expect(absent.queries.command("alliance.init")).toEqual({ alliance: sfs.object({}) });
    expect(absent.events).toEqual([]);
    const missing = fixture();
    missing.context.state.alliances = [];
    expect(missing.queries.command("alliance.init")).toEqual({ alliance: sfs.object({}) });
    h.context.state.selection.allianceId = "elsewhere";
    expect(() => h.queries.command("al.view")).toThrow("invalid");
    expect(() => h.queries.command("al.rank")).toThrow("invalid");
});

test("name and abbreviation availability keep their distinct native boolean meanings", () => {
    const h = fixture();
    h.context.state.directory = [h.alliance];
    h.context.state.selection.key = "gUiLd";
    expect(h.queries.command("al.name").result).toEqual(sfs.bool(true));
    expect(h.queries.command("al.checkname").result).toEqual(sfs.bool(false));
    h.context.state.selection.key = "Other";
    expect(h.queries.command("al.name").result).toEqual(sfs.bool(false));
    expect(h.queries.command("al.checkname").result).toEqual(sfs.bool(true));
    expect(h.queries.command("al.abbr").result).toEqual(sfs.bool(true));
    h.context.state.selection.key = "gld";
    expect(h.queries.command("al.abbr").result).toEqual(sfs.bool(true));
    h.context.state.selection.key = "NEW";
    expect(h.queries.command("al.abbr").result).toEqual(sfs.bool(false));
    h.context.state.selection.key = "ab";
    expect(h.queries.command("al.name").result).toEqual(sfs.bool(true));
});

test("candidate queries preserve rights, application filtering, language preference and second pagination", () => {
    const h = fixture();
    h.context.state.candidates = [{ uid: "a", lang: "en-US", power: 9007199254740993n }, {
        uid: "b",
        lang: "pt",
    }, { uid: "c", lang: "en" }];
    h.context.state.applications = [{ userId: "a", allianceId: "guild", type: 2 }, {
        userId: "c",
        allianceId: "guild",
        type: 1,
    }];
    h.context.state.selection.language = "en";
    let result = h.queries.command("al.searchuser");
    expect(result.total).toEqual(sfs.long(1n));
    expect(result.list).toEqual(
        sfs.array([
            sfs.object({
                uid: sfs.string("b"),
                name: sfs.string(""),
                pic: sfs.string(""),
                picVer: sfs.int(0),
                picfraId: sfs.int(0),
                lang: sfs.string("pt"),
                power: sfs.long(0n),
                offLineTime: sfs.long(0n),
                online: sfs.bool(false),
            }),
        ]),
    );
    h.context.state.selection.key = "a";
    result = h.queries.command("al.searchuser");
    expect(result.total).toEqual(sfs.long(1n));
    expect(decode(encode(result))).toEqual(result);
    h.context.state.selection.page = 2;
    result = h.queries.command("al.searchuser");
    expect(result.list).toEqual(sfs.array([]));
    expect(result.total).toEqual(sfs.long(1n));
    expect(result.page).toEqual(sfs.int(2));
    h.denyInvite();
    expect(() => h.queries.command("al.searchuser")).toThrow("locked");
});

test("directory, profile lookup and first-join queries preserve saved fields and defaults", () => {
    const h = fixture();
    h.context.state.directory = [h.alliance];
    h.context.state.directoryTotal = 9007199254740993n;
    const result = h.queries.command("al.search");
    expect(result.total).toEqual(sfs.long(9007199254740993n));
    expect(result.page).toEqual(sfs.int(1));
    expect(decode(encode(result))).toEqual(result);
    h.context.state.selection.playerId = "owner";
    expect(h.queries.command("al.check")).toEqual({ allianceId: sfs.string("guild") });
    h.context.state.selection.playerId = "unknown";
    expect(h.queries.command("al.check")).toEqual({ allianceId: sfs.string("") });
    expect(h.queries.command("al.get.firstjoin")).toEqual({ firstJoin: sfs.int(1) });
    h.context.state.lords = [{ uid: "owner", firstJoinAllianceFlag: 0 }];
    expect(h.queries.command("al.get.firstjoin")).toEqual({ firstJoin: sfs.int(0) });
    expect(() => h.queries.command("unknown")).toThrow("unsupported");
});

test("rank projection sorts rank then uid and reads each profile before its exact power", () => {
    const h = fixture();
    h.context.state.members = [{ uid: "owner", allianceId: "guild", rank: 1 }, {
        uid: "new",
        allianceId: "guild",
        rank: 1,
    }, { uid: "leader", allianceId: "guild", rank: 5 }];
    const result = h.queries.command("al.rank");
    expect(h.events).toEqual([
        "profile:leader",
        "power:leader",
        "profile:new",
        "power:new",
        "profile:owner",
        "power:owner",
    ]);
    expect(decode(encode(result))).toEqual(result);
    expect(h.context.state.members.map((row) => row.uid)).toEqual(["owner", "new", "leader"]);
});
