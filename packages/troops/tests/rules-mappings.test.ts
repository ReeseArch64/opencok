import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { Type, sfs, type Fields } from "@opencok/messages/sfs";
import {
    troopDefinition,
    troopQueueType,
    troopCosts,
    transferTroops,
    healingSelection,
    reserveTroops,
} from "../src/rules/military";
import { progressionBoolean } from "@opencok/validations/city-parameters";
import { MilitaryMapper } from "../src/mappings/military";
import { TrainingDomain } from "../src/services/training";
import { HospitalDomain } from "../src/services/hospital";
import { FortificationDomain } from "../src/services/fortifications";
import { CommandDomain } from "@opencok/base/domain/command-domain";

test("troop definitions and queues reject unsupported identities before a mutation can be planned", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    const rule = { building: "423001", food: "61", silver: "2" };
    rules.arms.set("107000", rule);
    expect(troopDefinition(rules, "107000")).toEqual(rule);
    expect(() => troopDefinition(rules, "10700")).toThrow();
    expect(() => troopDefinition(rules, "107001")).toThrow();
    expect(() => troopDefinition(rules, "107000 ")).toThrow();
    expect(troopQueueType(rule)).toBe(1);
    expect(troopQueueType({ building: "416001" })).toBe(2);
    expect(() => troopQueueType({ building: "411001" })).toThrow();
    expect(troopCosts(rule, 3, 25)).toEqual({
        wood: 0n,
        stone: 0n,
        iron: 0n,
        food: 137n,
        silver: 4n,
    });
    expect(() => troopCosts(rule, 0)).toThrow();
    expect(() => troopCosts(rule, 1, Infinity)).toThrow();
});

test("troop transfers conserve every tested batch and reserve future available capacity", () => {
    for (let available = 0; available <= 20; available++)
    {
        for (let count = 0; count <= available; count++)
        {
            const [source, destination] = transferTroops(available, 5, count);
            expect(source + destination).toBe(available + 5);
            expect(source).toBeGreaterThanOrEqual(0);
            expect(destination).toBe(5 + count);
        }
    }

    expect(() => transferTroops(1, 2147483647, 1)).toThrow();
    expect(() => transferTroops(1, 0, 2)).toThrow();
    expect(() => transferTroops(1, 0, -1)).toThrow();
    const state = {
        armies: [{ armyId: "107000", free: 2147483640, train: 4, march: 99 }],
        hospital: [{ armyId: "107000", dead: 10, heal: 2 }],
    };
    expect(reserveTroops(state, "107000", 1)).toBe(2147483647);
    expect(() => reserveTroops(state, "107000", 2)).toThrow();
});

test("healing selection preserves allowed metadata and enforces identity, type, batch and sum bounds", () => {
    const params: Fields = Object.fromEntries(
        Array.from({ length: 256 }, (_, i) => [String(107000 + i), sfs.int(1)]),
    );
    params.operationId = sfs.string("operation");
    params.isBuyRes = sfs.int(0);
    expect(healingSelection(params, Type.Int).size).toBe(256);
    expect(() => healingSelection({ ...params, "108000": sfs.int(1) }, Type.Int)).toThrow();
    expect(() => healingSelection({ "107000": sfs.long(1n) }, Type.Int)).toThrow();
    expect(() =>
        healingSelection({ "107000": sfs.int(2147483647), "107001": sfs.int(1) }, Type.Int)
    ).toThrow();
    expect(() => healingSelection({ "107000": sfs.int(0) }, Type.Int)).toThrow();
    expect(() => healingSelection({ owner: sfs.int(1) }, Type.Int)).toThrow();
    expect([...healingSelection({ "107001": sfs.int(2), "107000": sfs.int(1) }, Type.Int)]).toEqual(
        [["107000", 1], ["107001", 2]],
    );
});

test("military boolean parameters preserve fallback and reject nonboolean wire values", () => {
    expect(progressionBoolean({}, "gold")).toBe(false);
    expect(progressionBoolean({}, "gold", true)).toBe(true);
    expect(progressionBoolean({ gold: sfs.bool(false) }, "gold", true)).toBe(false);
    expect(progressionBoolean({ gold: sfs.bool(true) }, "gold")).toBe(true);
    expect(() => progressionBoolean({ gold: sfs.int(1) }, "gold")).toThrow();
    expect(() => progressionBoolean({ gold: { type: Type.Bool, value: 1 } }, "gold")).toThrow();
});

test("military mappings preserve exact deadlines, floats, ordering and snapshot bounds", () => {
    const mapper = new MilitaryMapper();
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.arms.set("107900", {
        attack: "3",
        defence: "4",
        stone: "0",
        iron: "0",
        food: "1",
        time: "2",
        power: "1.23456789",
    });
    const deadline = 9007199254740993n;
    const row = { armyId: "107900", num: 2, level: 1, build: 3, finishTime: deadline };
    const before = { ...row };
    const fort = mapper.fortification(row, rules);
    expect(fort.finish).toEqual(sfs.long(deadline));
    expect(fort.power).toEqual({ type: Type.Float, value: Math.fround(1.23456789) });
    expect(Object.keys(fort)).toEqual([
        "id",
        "free",
        "level",
        "train",
        "finish",
        "attack",
        "defen",
        "stone",
        "iron",
        "food",
        "time",
        "power",
    ]);
    expect(mapper.woundedTroops({ armyId: "107000", dead: 2, heal: 3, finishTime: deadline }))
        .toEqual({
            id: sfs.string("107000"),
            dead: sfs.int(2),
            heal: sfs.int(3),
            finish: sfs.long(deadline),
        });
    expect(mapper.woundedTroops({ armyId: "107000", dead: 2, heal: 0, finishTime: deadline }))
        .toEqual({ id: sfs.string("107000"), dead: sfs.int(2) });
    expect(() => mapper.militarySnapshot([], [], [row, row], rules)).toThrow(
        "Duplicate military identity",
    );
    expect(() => mapper.militarySnapshot([], Array.from({ length: 1025 }, () => ({})), [], rules))
        .toThrow("Military snapshot exceeds bound");
    expect(() =>
        mapper.militarySnapshot([{ armyId: "107000" }, { armyId: "107000" }], [], [], rules)
    ).toThrow("Duplicate military identity");
    expect(row).toEqual(before);
});

test("owned domain command matching retains queue identities and the native misspelled destroy alias", () => {
    const unexpected = () => {
        throw new Error("Completion must not run during command selection");
    };
    const training = new TrainingDomain({ target: unexpected, expedition: unexpected });
    const hospital = new HospitalDomain({ target: unexpected });
    const forts = new FortificationDomain({ target: unexpected });
    expect(training).toBeInstanceOf(CommandDomain);
    expect(training.commands.map(String)).toEqual(["army.add", "army.cd", "army.fire"]);
    expect(training.types).toEqual([1, 8, 9, 10, 17]);
    expect(hospital.commands.map(String)).toEqual([
        "hospital.cure",
        "hospital.cd",
        "hospital.fire",
    ]);
    expect(hospital.types).toEqual([3]);
    expect(forts.commands.map(String)).toEqual([
        "fort.build",
        "fort.cd",
        "fort.destory",
        "fort.destroy",
    ]);
    expect(forts.types).toEqual([2]);
    expect(forts.handles("fort.destory")).toBe(true);
    expect(forts.handles("fort.destroy")).toBe(true);
    expect(forts.handles("fort.destroy ")).toBe(false);
    expect(training.handles("hospital.cure")).toBe(false);
});
