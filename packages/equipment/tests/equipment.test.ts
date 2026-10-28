import { expect, test } from "bun:test";
import { errors } from "@opencok/constants/game";
import { sfs } from "@opencok/messages/sfs";
import type { EquipmentCatalog, EquipmentCreationContext } from "../src/contracts/equipment";
import type { EquipmentRuleRuntime } from "../src/contracts/runtime";
import { EquipmentPolicy } from "../src/rules/equipment";
import { EquipmentFactory } from "../src/services/factory";
import { PublicEquipmentMapper } from "../src/mappings/public-equipment";
import { EquipmentMapper } from "../src/mappings/equipment";

function fixture()
{
    const weights: number[][] = [];
    const runtime: EquipmentRuleRuntime = {
        text: (row, key) => String(row[key] ?? ""),
        num: (row, key) => Number(row[key] ?? 0),
        cityInteger: Number,
        cityAmount: (value) => BigInt(String(value)),
        chooseWeight: (values) => {
            weights.push([...values]);
            return 0;
        },
    };
    const rules: EquipmentCatalog = {
        goods: new Map([
            ["201060", { type: "7", color: "0" }],
            ["201061", { type: "7", color: "1" }],
            ["201070", { type: "7", color: "0" }],
        ]),
        items: new Map(),
        power: { equipment: new Map([["1001010", { id: "1001010", level: "1" }]]) },
        progression: {},
        building: () => {
            throw new Error("Unexpected building access");
        },
        role: () => {
            throw new Error("Unexpected role access");
        },
    };
    const policy = new EquipmentPolicy(runtime);
    return { runtime, rules, policy, weights };
}

test("recipes preserve accumulated order, material family checks and modern slot validation", () => {
    const { rules, policy } = fixture();
    const { equipmentPairs, equipmentMaterials, equipmentCosts } = policy;
    expect([...equipmentPairs("201060;2|201070;3|201060;4")]).toEqual([["201060", 6], [
        "201070",
        3,
    ]]);
    expect(() => equipmentPairs("201060;1;extra")).toThrow(errors.invalid);
    expect(() => equipmentPairs("word;1")).toThrow(errors.invalid);
    expect(equipmentCosts("0;10|4;20", 25, 2)).toEqual({ wood: 20n, silver: 30n });
    expect(() => equipmentCosts("5;1")).toThrow(errors.invalid);
    const recipe = { material1: "201060;2", material2: "201070;1" };
    expect([...equipmentMaterials(recipe, rules, [201061, 201070], 2, false).costs]).toEqual([
        ["201061", 4],
        ["201070", 2],
    ]);
    expect(() => equipmentMaterials(recipe, rules, [201070], 1, false)).toThrow(errors.invalid);
    expect(() => equipmentMaterials(recipe, rules, [201060, 201070], 1, true)).toThrow(
        errors.invalid,
    );
    expect(() => equipmentMaterials(recipe, rules, [201060, 201070, 1, 0], 1, true)).toThrow(
        errors.invalid,
    );
});

test("property generation retains library filtering and malformed effect rejection", () => {
    const { policy, weights } = fixture();
    const library = {
        rate: "2|8",
        libraryType: "1|2",
        effect: "10;2|11;3",
        value4: "7|9",
        dialog: "5|6",
    };
    expect(policy.randomEquipmentProperty(library, 4, () => 0, 1)).toBe("10@2,7,5");
    expect(weights).toEqual([[2, 0]]);
    expect(() => policy.randomEquipmentProperty(undefined, 4, () => 0)).toThrow(errors.invalid);
    expect(() => policy.randomEquipmentProperty({ ...library, value4: "bad|9" }, 4, () => 0))
        .toThrow(errors.invalid);
});

test("suit dismantling preserves draw limits and ordered accumulation", () => {
    const { policy } = fixture();
    const draws: number[] = [];
    const result = policy.dismantleEquipment({
        suitbreak_down: "0.25",
        suitbreak_up: "0.75",
        suitbreak_k: "2",
        material1: "201060;10",
        material2: "201070;4",
        break_get01: "201060;3",
    }, (limit) => {
        draws.push(limit);
        return 0;
    });
    expect(draws).toEqual([1000000, 100, 1000000, 100]);
    expect([...result]).toEqual([["201060", 6], ["201070", 1]]);
    expect(() =>
        policy.dismantleEquipment(
            { suitbreak_down: "0.8", suitbreak_up: "0.2", suitbreak_k: "2" },
            () => 0,
        )
    ).toThrow(errors.invalid);
});

test("creation includes pending equipment in capacity and validates catalog before capacity", () => {
    const { policy, rules } = fixture();
    const factory = new EquipmentFactory(policy);
    const context: EquipmentCreationContext = {
        owner: "player",
        rules,
        state: { equipment: Array.from({ length: 998 }, () => ({ uuid: "existing" })) },
        write: { equipment: [{ uuid: "pending" }] },
    };
    const { newEquipment } = factory;
    const first = newEquipment(context, "1001010");
    const second = newEquipment(context, "1001010");
    expect(first).toMatchObject({
        uid: "player",
        itemId: 1001010,
        on: 0,
        generalid: 0,
        cost: "",
        strengthLevel: 0,
        reforgeCount: 0,
    });
    expect(first.uuid).not.toBe(second.uuid);
    context.write.equipment = [first, second];
    expect(() => newEquipment(context, "1001010")).toThrow(errors.full);
    expect(() => newEquipment(context, "missing")).toThrow(errors.invalid);
});

test("public and owned projections preserve lock delimiters, omitted fields and bound callbacks", () => {
    const { runtime, rules } = fixture();
    const publicMapper = new PublicEquipmentMapper({ text: runtime.text, integer: runtime.num });
    const mapper = new EquipmentMapper(runtime, publicMapper);
    const row = {
        uuid: "gear",
        itemId: 1001010,
        on: 0,
        generalid: 7,
        lockProperty: "attack,1|defence,0||",
    };
    const { publicEquipment } = publicMapper;
    const preview = publicEquipment(row, false);
    expect(Object.keys(preview)).toEqual([
        "uuid",
        "itemId",
        "on",
        "extraProperty",
        "refineProperty",
        "reforgeCount",
        "lockProperty",
    ]);
    expect(preview.lockProperty).toEqual(sfs.string("attack"));
    expect(preview.strength_level).toBeUndefined();
    expect(() => publicEquipment({ ...row, lockProperty: "broken" }, false)).toThrow(
        errors.unsupported,
    );
    const { equipment, equipmentItem, equipmentItems } = mapper;
    expect(equipment(row).generalid).toEqual(sfs.string("7"));
    expect(equipment({ ...row, generalid: 0, lockProperty: "" }).lockProperty).toBeUndefined();
    expect(equipmentItem("201060", 3, undefined, rules)).toEqual({
        itemId: sfs.string("201060"),
        count: sfs.int(3),
    });
    expect(equipmentItems(new Map([["201060", 2]]), () => 3, rules)).toEqual(sfs.array([
        sfs.object({ itemId: sfs.string("201060"), count: sfs.int(3), num: sfs.int(2) }),
    ]));
});
