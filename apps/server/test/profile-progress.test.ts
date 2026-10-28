import { expect, test } from "bun:test";
import type { PublicProfileState } from "@opencok/contracts/profile";
import { Rules } from "@opencok/rules/game";
import { publicProfileProgress, publicProfileSocial } from "@opencok/rules/profile";
import { publicProfileBase } from "@opencok/mappings/profile";
import { decode, encode, sfs, Type } from "@opencok/messages/sfs";

const context = { now: 1792756800000, kingdomId: 2, version: "12.06.0" };
function fixture()
{
    const state: PublicProfileState = {
        profile: { uid: "synthetic", name: "Public", level: 5, exp: 12, pic: null, serverId: 2 },
        statistics: undefined,
        vip: { score: 160, vipEndTime: BigInt(context.now + 1), level: 90, sLevel: 10 },
        lord: { medal: "synthetic-medal" },
        mixed: { showEquip: 0, showMedal: 1, marchSoldierShow: 2 },
        military: { militaryRank: 501 },
        office: undefined,
        flowers: undefined,
        alliance: undefined,
        taverns: [{ level: 4 }],
        generals: [],
        skills: [],
        equipment: [{ uuid: "synthetic-equip", itemId: 5001, on: 1, strengthLevel: 2 }],
        honors: [{ id: "synthetic-medal", level: 3 }],
        completedAchievements: 2,
    };
    const rules = new Rules(
        new Map(),
        new Map([["100105", { player_exp: "600" }]]),
        new Map(),
        undefined,
        undefined,
        undefined,
        undefined,
        new Map([["equipment_strengthen", { version: "1", online: "2" }]]),
        2,
        undefined,
        undefined,
        {
            vip: new Map([
                ["800008", { id: "800008", point: "150" }],
                ["800003", { id: "800003", point: "100" }],
                ["800099", { id: "800099", point: "999" }],
            ]),
        },
        {
            achievementCount: 3,
            militaryRanks: new Map([["501", { level: "8" }]]),
            servers: new Map([["2", { name: "Synthetic Kingdom" }]]),
        },
    );
    return { state, rules };
}

test("public progression uses declaration-order VIP scores, exact expiry and stored rank catalogs", () => {
    const { state, rules } = fixture();
    expect(publicProfileProgress(state, rules, context)).toEqual({
        maxExp: 600,
        vip: 4,
        vipEndTime: 1792756800,
        achieveNum: Math.fround(2 / 3),
        armedLevel: 8,
        market: 1,
        serverName: "Synthetic Kingdom",
        equipmentStrengthen: true,
    });
    state.vip = { score: 99, vipEndTime: BigInt(context.now + 1) };
    expect(publicProfileProgress(state, rules, context).vip).toBe(0);
    for (const expiry of [context.now, context.now - 1])
    {
        state.vip = { score: 999, vipEndTime: BigInt(expiry) };
        rules.power.vip!.clear();
        expect(publicProfileProgress(state, rules, context).vip).toBe(0);
    }
    state.vip = undefined;
    state.military = undefined;
    state.taverns = [];
    expect(publicProfileProgress(state, rules, context)).toMatchObject({
        vip: 0,
        vipEndTime: 0,
        armedLevel: 1,
        market: 0,
    });
    state.vip = { score: 0, vipEndTime: -1999n };
    expect(publicProfileProgress(state, rules, context).vipEndTime).toBe(-1);
    state.vip = { score: 0, vipEndTime: 9223372036854775807n };
    rules.power.vip!.set("800000", { id: "800000", point: "0" });
    expect(publicProfileProgress(state, rules, context).vipEndTime).toBe(-1511828489);
});

test("achievement ratio retains Java float rounding, empty catalogs and values above one", () => {
    const { state, rules } = fixture();
    state.completedAchievements = 5;
    expect(publicProfileProgress(state, rules, context).achieveNum).toBe(Math.fround(5 / 3));
    state.completedAchievements = 16777217;
    rules.profile.achievementCount = 16777219;
    expect(publicProfileProgress(state, rules, context).achieveNum).toBe(
        Math.fround(16777216 / 16777220),
    );
    rules.profile.achievementCount = 0;
    expect(publicProfileProgress(state, rules, context).achieveNum).toBe(1);
    rules.profile.achievementCount = 3;
    state.completedAchievements = 0;
    expect(publicProfileProgress(state, rules, context).achieveNum).toBe(0);
});

test("public base fields preserve privacy switches independently from equipment and honor arrays", () => {
    const { state, rules } = fixture();
    const wire = decode(encode(publicProfileBase(state, rules, context, "9007199254740993")));
    expect(wire.showEquip).toEqual(sfs.bool(false));
    expect(wire.showMedal).toEqual(sfs.bool(true));
    expect(wire.showMarchSoldier).toEqual(sfs.bool(false));
    expect(wire.equip?.value).toHaveLength(1);
    expect(wire.medalList?.value).toHaveLength(1);
    expect(wire.achieveNum).toEqual({ type: Type.Float, value: Math.fround(2 / 3) });
    expect(wire.vip).toEqual(sfs.int(4));
    expect(wire.serverName).toEqual(sfs.string("Synthetic Kingdom"));
    expect(wire.serverId).toEqual(sfs.int(2));
    expect(wire.lastUpdateTime).toEqual(sfs.string("9007199254740993"));
    expect(wire.pic).toEqual(sfs.string(""));
    expect(wire.flowerVal).toEqual(sfs.int(0));
    expect(wire).not.toHaveProperty("officer");
    expect(wire).not.toHaveProperty("power");
    expect(wire).not.toHaveProperty("allianceId");
    state.mixed = undefined;
    state.lord = { medal: null };
    const defaults = publicProfileBase(state, rules, context, "");
    expect(defaults.medal).toEqual(sfs.string(""));
    expect(defaults.showMedal).toEqual(sfs.bool(false));
    state.lord = undefined;
    expect(() => publicProfileBase(state, rules, context, "")).toThrow();
});

test("public flower score uses signed flower-minus-egg arithmetic and the legacy empty default", () => {
    const { state, rules } = fixture();
    expect(publicProfileSocial(state, 2)).toEqual({ flowerVal: 0, officer: undefined });
    for (
        const [flowerVal, eggVal, expected] of [
            [90, 15, 75],
            [15, 90, -75],
            [2147483647, -1, -2147483648],
            [-2147483648, 1, 2147483647],
        ]
    )
    {
        state.flowers = { flowerVal: flowerVal!, eggVal: eggVal!, scoreVal: 999, hideKing: 1 };
        const before = { ...state.flowers };
        expect(publicProfileSocial(state, 2).flowerVal).toBe(expected!);
        expect(decode(encode(publicProfileBase(state, rules, context, ""))).flowerVal).toEqual(
            sfs.int(expected!),
        );
        expect(state.flowers).toEqual(before);
    }
    for (const flowerVal of [null, "invalid", 2147483648, 1.5])
    {
        state.flowers = { flowerVal, eggVal: 0 };
        expect(() => publicProfileSocial(state, 2)).toThrow();
    }
});

test("public offices retain enum normalization, ready-king realm rules and optional wire presence", () => {
    const { state, rules } = fixture();
    for (let ordinal = 0; ordinal <= 16; ordinal++)
    {
        state.office = { positionId: String(216000 + ordinal), serverId: 2 };
        expect(publicProfileSocial(state, 2).officer).toBe(String(216000 + ordinal));
        expect(publicProfileBase(state, rules, context, "").officer).toEqual(
            sfs.string(String(216000 + ordinal)),
        );
    }
    state.office = { positionId: "216000000", serverId: 2 };
    expect(publicProfileBase(state, rules, context, "")).not.toHaveProperty("officer");
    state.office = { positionId: "216000000", serverId: 3 };
    expect(publicProfileSocial(state, 2).officer).toBe("216000");
    state.office = { positionId: "0216000000", serverId: 2 };
    expect(publicProfileSocial(state, 2).officer).toBe("216000");
    state.office = { positionId: "999001", serverId: 2 };
    expect(publicProfileSocial(state, 2).officer).toBe("216001");
    for (const positionId of ["216017", "-1", "216099"])
    {
        state.office = { positionId, serverId: 2 };
        expect(publicProfileSocial(state, 2).officer).toBeUndefined();
    }
    for (const positionId of ["", "bad", "2147483648"])
    {
        state.office = { positionId, serverId: 2 };
        expect(() => publicProfileSocial(state, 2)).toThrow();
    }
    expect(() => publicProfileSocial(state, 0)).toThrow();
});

test("active missing catalogs, malformed state and conflicting realm context reject public progression", () => {
    for (
        const change of [
            ({ rules }: ReturnType<typeof fixture>) => rules.roles.clear(),
            ({ rules }: ReturnType<typeof fixture>) => rules.power.vip!.clear(),
            ({ rules }: ReturnType<typeof fixture>) => rules.profile.militaryRanks!.clear(),
            ({ state }: ReturnType<typeof fixture>) => {
                state.taverns = [{ level: 1 }, { level: 2 }];
            },
            ({ state }: ReturnType<typeof fixture>) => {
                state.completedAchievements = -1;
            },
            ({ state }: ReturnType<typeof fixture>) => {
                state.vip = { vipEndTime: 9007199254740992 };
            },
            ({ state }: ReturnType<typeof fixture>) => {
                state.profile = undefined;
            },
        ]
    )
    {
        const data = fixture();
        change(data);
        expect(() => publicProfileProgress(data.state, data.rules, context)).toThrow();
    }
    const { state, rules } = fixture();
    expect(() => publicProfileProgress(state, rules, { ...context, kingdomId: 1 })).toThrow();
    expect(() => publicProfileProgress(state, rules, { ...context, now: NaN })).toThrow();
});
