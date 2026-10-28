import { expect, test } from "bun:test";
import type { PublicProfileState } from "@opencok/player/contracts/public-profile";
import { publicProfileAlliance } from "@opencok/services/profile";
import { Rules } from "@opencok/rules/game";
import { publicAllianceProgress } from "@opencok/rules/profile";
import { decode, encode, fields, sfs } from "@opencok/messages/sfs";

function fixture()
{
    const state: PublicProfileState = {
        profile: { uid: "synthetic", allianceId: "alliance-a" },
        statistics: undefined,
        vip: undefined,
        lord: undefined,
        mixed: undefined,
        military: undefined,
        office: undefined,
        flowers: undefined,
        generals: [],
        skills: [],
        equipment: [],
        honors: [],
        taverns: [],
        completedAchievements: 0,
        alliance: {
            alliance: {
                uid: "alliance-a",
                alliancename: "Synthetic",
                abbr: "SYN",
                giftlevel: 2501,
                maxMember: 50,
                curMember: 99,
                alliancepoint: 9007199254740993n,
                createtime: 1234n,
                wood: 9007199254740995n,
                intro: null,
                permission: "{\"mail\":4,\"position\":\"3\",\"online\":2.0}",
                playerEmail: "must-not-leak",
            },
            leader: { uid: "leader-a", name: "Leader", gold: 100000n },
            totals: { member: "2", fightpower: "9007199254740993" },
            sciences: [{ scienceId: 1000, level: 1 }],
            withEffects: true,
            video: {
                allianceId: "alliance-a",
                vedioURL: "https://example.invalid/video",
                thumbnailURL: "https://example.invalid/thumb",
                vedioH: 720,
                vedioW: 1280,
                vedioSize: 1234,
                vedioLength: 10,
                checkSign: -1,
            },
        },
    };
    const rules = new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        { allianceSciences: new Map([["1001", { para1: "500", para2: "2.9" }]]) },
    );
    const wire = (remote = false) =>
        fields(
            fields(decode(encode(publicProfileAlliance(state, rules, remote))).alliance).alliance,
        );
    return { state, alliance: state.alliance!, rules, wire };
}

test("public alliance presentation retains nested shape, explicit fields, aliases and nullable omission", () => {
    const { wire } = fixture();
    const result = wire();
    expect(result.uid).toEqual(sfs.string("alliance-a"));
    expect(result.alliancename).toEqual(sfs.string("Synthetic"));
    expect(result.alliancepoint).toEqual(sfs.long(9007199254740993n));
    expect(result.wood).toEqual(sfs.long(9007199254740995n));
    expect(result.member).toEqual(sfs.long(2));
    expect(result.curMember).toEqual(sfs.int(99));
    expect(result.maxMember).toEqual(sfs.int(52));
    expect(result.learderUid).toEqual(sfs.string("leader-a"));
    expect(result.learderName).toEqual(sfs.string("Leader"));
    expect(result.permission).toEqual(
        sfs.object({ mail: sfs.int(4), position: sfs.int(3), online: sfs.int(2) }),
    );
    expect(result).not.toHaveProperty("intro");
    expect(result).not.toHaveProperty("playerEmail");
    expect(result).not.toHaveProperty("gold");
    expect(fields(result.allianceVideo)).toEqual({
        allianceid: sfs.string("alliance-a"),
        videoURL: sfs.string("https://example.invalid/video"),
        thumbnailURL: sfs.string("https://example.invalid/thumb"),
        videoH: sfs.int(720),
        videoW: sfs.int(1280),
        videoSize: sfs.int(1234),
        videoLength: sfs.int(10),
        checksign: sfs.byte(-1),
    });
});

test("local decimal aggregates use doubles while remote aggregates narrow to signed longs", () => {
    const { wire, alliance } = fixture();
    expect(wire().currentlevel).toEqual(sfs.double(2));
    expect(wire().nextlevel).toEqual(sfs.double(3000));
    expect(wire().fightpower).toEqual(sfs.double(9007199254740992));
    expect(wire(true).currentlevel).toEqual(sfs.long(2));
    expect(wire(true).nextlevel).toEqual(sfs.long(3000));
    expect(wire(true).fightpower).toEqual(sfs.long(9007199254740993n));
    alliance.totals.fightpower = "9223372036854775808";
    expect(wire(true).fightpower).toEqual(sfs.long(-9223372036854775808n));
    alliance.alliance.giftlevel = -1;
    expect(wire().currentlevel).toEqual(sfs.double(-1));
    expect(wire().nextlevel).toEqual(sfs.double(0));
    alliance.alliance.giftlevel = null;
    alliance.totals.fightpower = null;
    expect(wire()).not.toHaveProperty("currentlevel");
    expect(wire()).not.toHaveProperty("nextlevel");
    expect(wire()).not.toHaveProperty("fightpower");
});

test("same-alliance viewers skip expansion and foreign viewers use float-to-int capacity arithmetic", () => {
    const { alliance, rules, wire } = fixture();
    alliance.withEffects = false;
    rules.power.allianceSciences!.clear();
    expect(wire().maxMember).toEqual(sfs.int(50));
    alliance.withEffects = true;
    expect(wire).toThrow();
    rules.power.allianceSciences!.set("1001", { para1: "500", para2: "-2.9" });
    expect(wire().maxMember).toEqual(sfs.int(48));
    alliance.alliance.maxMember = -2147483648;
    expect(wire().maxMember).toEqual(sfs.int(2147483646));
    alliance.alliance.maxMember = null;
    expect(wire()).not.toHaveProperty("maxMember");
});

test("permissions remain typed objects and malformed persisted data cannot produce partial alliances", () => {
    const { alliance, state, rules, wire } = fixture();
    alliance.alliance.permission = "{\"__proto__\":2,\"constructor\":3}";
    const permission = fields(wire().permission);
    expect(Object.hasOwn(permission, "__proto__")).toBe(true);
    expect(permission.__proto__).toEqual(sfs.int(2));
    for (
        const permission of [
            "",
            "null",
            "[]",
            "{\"a\":null}",
            "{\"a\":1.5}",
            "{\"a\":2147483648}",
            "{\"a\":true}",
        ]
    )
    {
        alliance.alliance.permission = permission;
        expect(wire).toThrow("102192");
    }
    alliance.alliance.permission = null;
    alliance.video = undefined;
    expect(wire()).not.toHaveProperty("permission");
    expect(wire()).not.toHaveProperty("allianceVideo");
    alliance.alliance.uid = "wrong";
    expect(wire).toThrow();
    state.profile = { allianceId: "" };
    expect(publicProfileAlliance(state, rules, false)).toEqual({});
    state.profile = { allianceId: "alliance-a" };
    state.alliance = undefined;
    expect(() => publicProfileAlliance(state, rules, false)).toThrow();
});

test("invalid totals and video state reject and no public projection mutates its inputs", () => {
    const { alliance, rules, wire } = fixture();
    const before = structuredClone(alliance);
    wire();
    expect(alliance).toEqual(before);
    for (const member of ["0", "-1", "1.5", "9223372036854775808"])
    {
        alliance.totals.member = member;
        expect(() => publicAllianceProgress(alliance, rules)).toThrow();
    }
    alliance.totals.member = "2";
    alliance.video!.allianceId = "wrong";
    expect(wire).toThrow();
    alliance.video!.allianceId = "alliance-a";
    alliance.video!.vedioURL = null;
    expect(wire).toThrow();
    alliance.video!.vedioURL = "synthetic";
    alliance.video!.checkSign = 128;
    expect(wire).toThrow();
});
