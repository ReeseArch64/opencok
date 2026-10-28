import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import type { ScoutParticipant, WorldScoutTarget } from "@opencok/contracts/world-scout-report";
import type { CityProgressionContext } from "@opencok/city/services/context";
import { scoutDetectReport, scoutBarbarianReport } from "@opencok/services/world-scout-report";
import { scoutApproximate, scoutBarbarianArmy } from "@opencok/rules/world-scout-report";
import { encodeScoutReport } from "@opencok/mappings/world-scout-report";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { decodeJavaIntMap, encodeJavaIntMap } from "@opencok/messages/java-int-map";
import { encodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, fields, Type, type Fields, type Value } from "@opencok/messages/sfs";
const rules = await loadRules();
const rows = (value: Value | undefined) => value!.value as Value[];
function fixture()
{
    const profile = {
        uid: "other",
        name: "Defender",
        serverId: 1,
        crossFightSrcServerId: 0,
        appVersion: "12.06.0",
        level: 8,
        pic: "icon",
        picVer: 3,
        picfraId: 4,
        civilizationType: 2,
        allianceId: "",
    };
    const person: ScoutParticipant = {
        profile,
        world: { uid: "other", worldId: 0, pointId: 100 },
        resources: {
            uid: "other",
            wood: 0n,
            food: 0n,
            stone: 0n,
            iron: 0n,
            lastUpdateTime: 1000000n,
        },
        buildings: [],
        armies: [],
        forts: [],
        sciences: [],
        generals: [],
        dragons: [],
        newGenerals: [],
        production: [],
        marches: [],
        offices: [],
        effects: {
            effects: {
                profile,
                generals: [],
                sciences: [],
                civilizationSciences: [],
                sagaSciences: [],
                foreignSciences: [],
                equipment: [],
                heroes: [],
                dragons: [],
                dragonSkills: [],
                states: [],
                vip: undefined,
                allianceSciences: [],
                prestige: [],
                military: undefined,
                miracle: undefined,
                office: undefined,
                kingdomFights: [],
                territoryTrees: [],
                luckyDay: undefined,
                powerServer: undefined,
                throneRewards: [],
            },
            buildings: [],
            newGenerals: { moved: false, generals: [], statuses: [], equipment: [], offices: [] },
        },
    };
    const target: WorldScoutTarget = {
        point: { id: 100, worldId: 0, pointType: 1, ownerId: "other", pointItem: null },
        participant: person,
        reinforcements: [],
        rallies: [],
        rallyDetails: [],
        cityBosses: [],
    };
    const effects = new Map<number, number>(),
        context = {
            owner: "owner",
            now: 1000000n,
            rules,
            state: { profile: { uid: "owner", appVersion: "12.06.0" }, buildings: [] },
            foreignEffect: (_snapshot: unknown, id: number) => effects.get(id) ?? 0,
        } as unknown as CityProgressionContext;
    return { person, target, context, effects };
}
function army(
    owner: string,
    dragons: { owner: string; uuid: string; itemId: number; level: number; }[] = [],
    count = 42,
)
{
    return encodeWorldMarchArmy({
        owner,
        cachedLoad: 0,
        soldiers: [
            {
                owner,
                armsId: "107000",
                total: count,
                dead: 0,
                loadEffect: 0,
                basicArm: 0,
                level: 4,
            },
        ],
        dragons,
        general: null,
    });
}
test("Source approximate troop counts preserve modulo bias, hundred rounding and signed integer bounds", () => {
    expect(scoutApproximate(5, () => 0)).toBe(4);
    expect(scoutApproximate(5, () => 5)).toBe(6);
    expect(scoutApproximate(1000, () => 0)).toBe(800);
    expect(
        scoutApproximate(-1, () => {
            throw new Error("must not draw");
        }),
    ).toBe(0);
    expect(scoutApproximate(2147483647, (maximum) => maximum - 1)).toBeGreaterThan(0);
    expect(() => scoutApproximate(1, () => 1)).toThrow();
    expect(() => scoutApproximate(1.1, () => 0)).toThrow();
});
test("scout JSON retains exact signed I64 resources and rejects invalid, overlong or excessively nested report data", () => {
    const report = {
        resource: sfs.object({
            wood: sfs.long(9007199254740993n),
            food: sfs.long(-9223372036854775808n),
        }),
        active: sfs.bool(true),
    };
    const bytes = encodeScoutReport(report),
        restored = decodeLegacyJsonObject(bytes.toString("utf8"));
    expect(bytes.toString("utf8")).toContain("9007199254740993");
    expect(fields(restored.resource).wood).toEqual(sfs.long(9007199254740993n));
    expect(fields(restored.resource).food).toEqual(sfs.long(-9223372036854775808n));
    expect(() => encodeScoutReport({ bad: { type: Type.Int, value: NaN } })).toThrow();
    expect(() => encodeScoutReport({ bad: { type: Type.Long, value: 9223372036854775808n } }))
        .toThrow();
    expect(() => encodeScoutReport({ bad: sfs.string("x".repeat(65536)) })).toThrow();
    let nested: Fields = {};
    for (let index = 0; index < 14; index++)
    {
        nested = { next: sfs.object(nested) };
    }
    expect(() => encodeScoutReport(nested)).toThrow();
});
test("watchtower intel uses Source aggregate and detailed shapes, float straw effect, forts key and training-building stars", () => {
    const h = fixture();
    h.person.armies = [{ uid: "other", armyId: "107000", free: 5, level: 99 }];
    h.person.buildings = [
        {
            uuid: "training",
            uid: "other",
            itemId: Number(rules.arms.get("107000")!.building),
            level: 30,
            star: 4,
        },
    ];
    h.person.forts = [{ armyId: "107300", num: 5 }];
    h.effects.set(63, 0.5);
    const aggregate = fields(scoutDetectReport(h.context, h.target, [2], 9, () => 0).defence);
    expect(aggregate).toEqual({ total: sfs.int(6), arms: sfs.array([]), about: sfs.bool(true) });
    const approximate = fields(scoutDetectReport(h.context, h.target, [5, 6], 10, () => 0).defence);
    expect(fields(rows(approximate.arms)[0])).toEqual({
        num: sfs.int(6),
        id: sfs.string("107000"),
        star: sfs.int(4),
    });
    const exact = scoutDetectReport(h.context, h.target, [9, 10], 10, () => 0),
        defence = fields(exact.defence),
        fort = fields(exact.fort);
    expect(defence.total).toEqual(sfs.int(7));
    expect(defence.about).toEqual(sfs.bool(false));
    expect(fort).toEqual({
        total: sfs.int(5),
        forts: sfs.array([sfs.object({ num: sfs.int(5), id: sfs.string("107300") })]),
        about: sfs.bool(false),
    });
    expect(
        fields(
            rows(fields(scoutDetectReport(h.context, h.target, [9], 9, () => 0).defence).arms)[0],
        )
            .star,
    ).toEqual(sfs.int(0));
});
test("city dragon intel resolves actual level catalog and excludes eggs, unused dragons and dragons in saved marches", () => {
    const h = fixture(),
        level = [...rules.power.dragonLevels!.values()].find((row) => Number(row.level) === 1)!;
    for (const id of ["dragon_new", "dragon_battle"])
    {
        rules.features.set(id, { id, version: "1.0.0", online: "all", test: "all" });
    }
    h.person.dragons = [
        {
            uuid: "egg",
            uid: "other",
            itemId: Number(level.base_id),
            lv: 1,
            dragonState: 1,
            useFlag: 1,
            friendly: 1,
        },
        {
            uuid: "marching",
            uid: "other",
            itemId: Number(level.base_id),
            lv: 1,
            dragonState: 3,
            useFlag: 1,
            friendly: 22,
        },
        {
            uuid: "unused",
            uid: "other",
            itemId: Number(level.base_id),
            lv: 1,
            dragonState: 3,
            useFlag: 0,
            friendly: 33,
        },
        {
            uuid: "active",
            uid: "other",
            itemId: Number(level.base_id),
            lv: 1,
            dragonState: 3,
            useFlag: 1,
            friendly: 71,
        },
    ];
    h.person.marches = [
        {
            uuid: "march",
            ownerUid: "other",
            armyInfo: army("other", [{ owner: "other", uuid: "marching", itemId: 1, level: 99 }]),
        },
    ];
    const defence = fields(scoutDetectReport(h.context, h.target, [9], 30, () => 0).defence);
    expect(rows(defence.defDrag)).toEqual([
        sfs.object({
            dragonId: sfs.int(Number(level.id)),
            level: sfs.int(1),
            friendly: sfs.int(71),
        }),
    ]);
    expect(h.person.dragons.find((row) => row.uuid === "active")!.friendly).toBe(71);
    h.person.newGenerals = [{ uid: "other", id: 101, state: 6, level: 9 }];
    h.person.offices = [{ uid: "other", id: 101, officeId: "53833", position: 1, startTime: 1n }];
    expect(
        fields(scoutDetectReport(h.context, h.target, [9], 30, () => 0).defence).generalInfo,
    ).toEqual(
        sfs.array([
            sfs.object({
                userId: sfs.string("other"),
                generalId: sfs.string("101"),
                level: sfs.int(9),
            }),
        ]),
    );
});
test("reinforcement intel preserves native soldierInfo names and reads current dragon friendship instead of nonexistent saved metadata", () => {
    const h = fixture(),
        level = [...rules.power.dragonLevels!.values()].find((row) => Number(row.level) === 1)!;
    h.target.reinforcements = [
        {
            march: {
                uuid: "reinforce",
                ownerUid: "helper",
                worldId: 0,
                state: 1,
                targetId: 100,
                armyInfo: army("helper", [{
                    owner: "helper",
                    uuid: "current",
                    itemId: 1,
                    level: 99,
                }]),
            },
            profile: {
                uid: "helper",
                name: "Ally",
                level: 10,
                pic: "pic",
                picVer: 2,
                picfraId: 3,
                civilizationType: 2,
            },
            statistics: { uid: "helper", power: 9007199254740993n },
            dragons: [
                {
                    uid: "helper",
                    uuid: "current",
                    itemId: Number(level.base_id),
                    lv: 1,
                    friendly: 63,
                },
            ],
            alliance: { abbr: "SYN" },
        },
    ];
    const report = scoutDetectReport(h.context, h.target, [7, 11], 30, () => 0),
        reinforcement = rows(rows(report.rein_about_detail)[0])[0];
    expect(fields(reinforcement)).toEqual({
        armyId: sfs.string("107000"),
        count: sfs.int(42),
        star: sfs.int(4),
        about: sfs.bool(false),
    });
    expect(rows(rows(report.rein_about_detail_pet_dragon)[0])).toEqual([
        sfs.object({
            dragonId: sfs.int(Number(level.id)),
            level: sfs.int(1),
            friendly: sfs.int(63),
        }),
    ]);
    expect(fields(rows(report.rein_detail)[0]).power).toEqual(sfs.long(9007199254740993n));
    expect(fields(rows(report.rein_detail)[0]).abbr).toEqual(sfs.string("SYN"));
});
test("barbarian report derives real army and award regeneration without mutating persisted counter snapshots", () => {
    const h = fixture();
    rules.world.armies!.set("scout-synthetic", { arm: "107000;100|107100;50" });
    rules.world.barbarians!.set("scout-synthetic", {
        id: "scout-synthetic",
        army: "scout-synthetic",
        para1: "300",
        para2: "30",
        para3: "10",
        para11: "10",
        arm_reward: "107000;100|107100;50",
    });
    const at = 1000000n,
        actor = {
            pointId: 100,
            configId: "scout-synthetic",
            currentHP: 250,
            lastBeAttackedTime: at - 100000n,
            lastArmyMapByteArray: encodeJavaIntMap(
                new Map([
                    ["107000", 10],
                    ["107100", 5],
                ]),
            ),
            lastAwardArmyMapByteArray: encodeJavaIntMap(
                new Map([
                    ["107000", 0],
                    ["107100", 0],
                ]),
            ),
        };
    h.target.point = {
        id: 100,
        worldId: 0,
        pointType: 44,
        pointItem: "scout-synthetic",
        fireTime: 0n,
    };
    h.target.barbarian = actor;
    expect(
        scoutBarbarianArmy(actor, rules, at, decodeJavaIntMap(actor.lastArmyMapByteArray)),
    ).toEqual(
        new Map([
            ["107100", 10],
            ["107000", 20],
        ]),
    );
    const before = Buffer.from(actor.lastArmyMapByteArray),
        report = scoutBarbarianReport(h.context, h.target);
    expect(report.barbarionCurrentDef).toEqual(sfs.int(250));
    expect(report.barbarionCurrentArmyCount).toEqual(sfs.int(30));
    expect(report.barbarionTotalArmyCount).toEqual(sfs.int(150));
    expect(actor.lastArmyMapByteArray).toEqual(before);
    expect(
        rows(report.barbarionReward)
            .map((row) => fields(row).v!.value)
            .sort((left, right) => Number(left) - Number(right)),
    ).toEqual([5, 10]);
});
test("ordinary rally intel joins actual team and arrived member facts without fabricating a battle result", () => {
    const h = fixture();
    rules.features.set("tower", { id: "tower", version: "1.0.0", online: "all", test: "all" });
    const march = {
        uuid: "rally",
        ownerUid: "other",
        teamId: "team",
        state: 1,
        worldId: 0,
        type: 4,
        armyInfo: army("other", [], 10),
    };
    h.target.rallies = [march];
    h.target.rallyDetails = [
        {
            march,
            team: { id: "team", leaderUid: "other", worldId: 0 },
            members: [
                {
                    march: { uuid: "member", ownerUid: "helper", armyInfo: army("helper", [], 20) },
                    profile: {
                        uid: "helper",
                        name: "Member",
                        level: 9,
                        pic: "pic",
                        picVer: 1,
                        picfraId: 2,
                    },
                    statistics: { power: 0n },
                    dragons: [],
                },
            ],
        },
    ];
    const report = fields(scoutDetectReport(h.context, h.target, [18], 30, () => 0).aggregation);
    expect(report.total).toEqual(sfs.int(30));
    expect(fields(report.originator).total).toEqual(sfs.int(10));
    expect(fields(rows(report.members)[0]).total).toEqual(sfs.int(20));
    expect(fields(rows(fields(report.originator).armys)[0])).toEqual({
        armyId: sfs.string("107000"),
        count: sfs.int(10),
        star: sfs.int(4),
        about: sfs.bool(false),
    });
});
test("city scout defense reflects factual kingdom fast-repair activation and exact inclusive repair-log boundary", () => {
    const h = fixture(),
        rule = [...rules.configuration.kingdomSkills!.values()].find(
            (row) => Number(row.effectType) === 18,
        )!;
    expect(rule).toBeDefined();
    h.person.buildings = [
        { uid: "other", uuid: "wall", itemId: 419000, level: 1, star: 0, progress: 0 },
    ];
    h.target.point = { ...h.target.point, cityDefValue: 7, fireTime: 0n, startOccupyTime: 0n };
    const ordinary = fields(scoutDetectReport(h.context, h.target, [1], 10, () => 0).resource);
    expect(ordinary.cityDefValue).toEqual(sfs.int(7));
    h.person.kingSkills = [{ uid: "KING_USER", skillId: rule.id!, startTime: 100n }];
    const active = fields(scoutDetectReport(h.context, h.target, [1], 10, () => 0).resource);
    expect(active.cityDefValue).toEqual(active.cityDefMax);
    h.person.kingSkillLogs = [{ uid: "other", skillId: Number(rule.id), logTime: 100n }];
    expect(
        fields(scoutDetectReport(h.context, h.target, [1], 10, () => 0).resource).cityDefValue,
    ).toEqual(active.cityDefMax);
    h.person.kingSkillLogs = [{ uid: "other", skillId: Number(rule.id), logTime: 101n }];
    expect(
        fields(scoutDetectReport(h.context, h.target, [1], 10, () => 0).resource).cityDefValue,
    ).toEqual(sfs.int(7));
});
