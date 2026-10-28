import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { scoutCost, barbarianCurrentHP } from "@opencok/rules/world-scout";
const rules = await loadRules();
test("native scout costs use actual stronghold level and Java float expenditure, while barbarian prices bypass that effect", () => {
    expect(scoutCost({ pointType: 1, ownerId: "target" }, { level: 20 }, rules, 0)).toBe(900);
    expect(scoutCost({ pointType: 1, ownerId: "target" }, { level: 20 }, rules, 25)).toBe(675);
    expect(scoutCost({ pointType: 1, ownerId: "target" }, { level: 20 }, rules, 200)).toBe(0);
    expect(scoutCost({ pointType: 3, ownerId: "" }, undefined, rules, 25)).toBe(750);
    expect(scoutCost({ pointType: 44, pointItem: "4800000" }, undefined, rules, 100)).toBe(90);
    expect(scoutCost({ pointType: 44, pointItem: "missing" }, undefined, rules, 100)).toBe(1000);
});
test("barbarian scout availability derives only factual stored health and native fire decay without writing it", () => {
    const actor = { configId: "4800000", currentHP: 300 },
        point = { fireTime: 40000n };
    expect(barbarianCurrentHP(point, actor, rules, 10000n)).toBe(300);
    expect(barbarianCurrentHP(point, actor, rules, 20000n)).toBe(200);
    expect(barbarianCurrentHP(point, actor, rules, 39000n)).toBe(10);
    expect(barbarianCurrentHP(point, actor, rules, 40000n)).toBe(0);
    expect(barbarianCurrentHP({ fireTime: 0n }, actor, rules, 100000n)).toBe(300);
    expect(barbarianCurrentHP(point, undefined, rules, 10000n)).toBe(0);
    expect(actor.currentHP).toBe(300);
    expect(point.fireTime).toBe(40000n);
});
