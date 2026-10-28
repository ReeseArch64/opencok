import {
    createRealmEquipmentDomains,
    createRealmEquipmentPolicy,
} from "../src/composition/equipment";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";

import { cityFixture } from "./fixtures/city-progression";
import { sfs, Type } from "@opencok/messages/sfs";

const { equipment: equipmentDomain } = createRealmEquipmentDomains();
const { equipmentMaterials, equipmentColor, dismantleEquipment } = createRealmEquipmentPolicy();
const rules = await loadRules();
function fixture()
{
    const fixture = cityFixture(rules);
    fixture.state.buildings = [
        ...fixture.state.buildings,
        { uid: "owner", uuid: "forge", itemId: 429000, level: 1 },
    ];
    fixture.items.set("201060", 4);
    fixture.items.set("201070", 4);
    return fixture;
}
test("craft materials derive counts from the recipe and reject substitution", () => {
    const rule = rules.power.equipment!.get("1001010")!;
    expect([...equipmentMaterials(rule, rules, [201060, 201070], 1, false).costs]).toEqual([
        ["201060", 1],
        ["201070", 1],
    ]);
    expect(() => equipmentMaterials(rule, rules, [201010, 201070], 1, false)).toThrow();
    const single = { ...rule };
    delete single.material2;
    expect(() => equipmentMaterials(single, rules, [201010], 1, false)).toThrow();
    expect(
        equipmentColor(
            rules,
            [
                { color: 0, weight: 1 },
                { color: 0, weight: 1 },
            ],
            undefined,
            false,
            1,
            0,
            () => 0,
        ),
    ).toBe(0);
    const items = dismantleEquipment(rule, () => 0);
    expect([...items.values()].reduce((sum, count) => sum + count, 0)).toBe(2);
});
test("craft pins an owned result before the queue runs", async () => {
    const { context, items } = fixture();
    const plan = await equipmentDomain.prepare(context, "equipment.create", {
        itemId: sfs.string("1001010"),
        tools: sfs.array([sfs.int(201060), sfs.int(201070)]),
    });
    expect(plan.type).toBe(11);
    expect(plan.itemId).toBe(String(context.write.equipment?.[0]?.uuid));
    expect(context.write.equipment?.[0]?.itemId).toBe(1001010);
    expect(context.write.equipment?.[0]?.on).toBe(2);
    expect(items.get("201060")).toBe(3);
    expect(context.balance("silver")).toBe(505n);
});
test("equipping enforces ownership, level, and pending state", async () => {
    const { context, state } = fixture();
    state.equipment = [{ uid: "owner", uuid: "item", itemId: 1001010, on: 2 }];
    await expect(
        equipmentDomain.prepare(context, "equip.putOn", { uuid: sfs.string("foreign") }),
    ).rejects.toThrow();
    await expect(
        equipmentDomain.prepare(context, "equip.putOn", { uuid: sfs.string("item") }),
    ).rejects.toThrow();
    state.equipment = [{ uid: "owner", uuid: "item", itemId: 1001010, on: 0 }];
    await equipmentDomain.prepare(context, "equip.putOn", { uuid: sfs.string("item") });
    expect(context.write.equipment?.[0]?.on).toBe(1);
    expect(context.write.statistics?.power).toBe(1060n);
});
test("set selection requires consumed pieces and disallows unearned effects", async () => {
    const { context } = fixture();
    await expect(
        equipmentDomain.prepare(context, "set.suit.decompose.effect", {
            suits: sfs.string("11000000;11000000;11000000"),
        }),
    ).rejects.toThrow();
    const response = await equipmentDomain.prepare(context, "set.suit.decompose.effect", {
        suits: sfs.string("0;0;0"),
    });
    expect(response.response[0]).toBe(Type.Object);
});

test("equipment strengthening pays catalog costs and stops at the maximum", async () => {
    const { context, state, balances, items } = fixture();
    const rule = [...rules.power.equipment!.values()].find((rule) => rule.isStrengthen === "1")!;
    state.equipment = [
        { uid: "owner", uuid: "strong", itemId: Number(rule.id), on: 0, strengthLevel: 0 },
    ];
    balances.set("silver", 100000n);
    items.set("201130", 10);
    items.set("214245", 100);
    await equipmentDomain.prepare(context, "equipment.strength", { uuid: sfs.string("strong") });
    expect(context.write.equipment?.[0]?.strengthLevel).toBe(1);
    expect(balances.get("silver")).toBe(89900n);
    expect(items.get("201130")).toBe(9);
    expect(items.get("214245")).toBe(90);
    state.equipment = [{ ...state.equipment[0]!, strengthLevel: 10 }];
    await expect(
        equipmentDomain.prepare(context, "equipment.strength", { uuid: sfs.string("strong") }),
    ).rejects.toThrow();
});

test("equipment fusion consumes distinct owned pieces and preserves the selected family", async () => {
    const { context, state } = fixture();
    state.equipment = Array.from({ length: 4 }, (_, index) => ({
        uid: "owner",
        uuid: `piece-${index}`,
        itemId: 1001010,
        on: 0,
    }));
    await equipmentDomain.prepare(context, "material.create", {
        equips: sfs.string("piece-0,piece-1,piece-2,piece-3"),
    });
    expect(context.write.deletedEquipment).toHaveLength(4);
    expect(context.write.equipment?.[0]?.itemId).toBe(1001011);
    await expect(
        equipmentDomain.prepare(context, "material.create", {
            equips: sfs.string("piece-0,piece-0,piece-0,piece-0"),
        }),
    ).rejects.toThrow();
});
