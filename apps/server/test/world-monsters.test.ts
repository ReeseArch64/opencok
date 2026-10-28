import { expect, test } from "bun:test";
import { Rules, type Rule } from "@opencok/rules/game";
import {
    worldMonsterConfiguration,
    worldMonsterSpawn,
    worldMonsterProp,
    worldMonsterAreaRanges,
    reusableWorldMonster,
    chooseWorldMonsterCells,
    spawnWorldMonsterCells,
} from "@opencok/rules/world-monsters";
function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.world.fieldMonsters = new Map<string, Rule>([
        ["100", { id: "100", boss: "0", army: "a" }],
        ["101", { id: "101", boss: "2", num: "4", NPC: "1", Gift: "20" }],
    ]);
    rules.world.armies = new Map([["a", { id: "a", arm: "1;8|2;12" }]]);
    rules.items.set("monster_time", { k1: "10800" });
    return rules;
}
test("field monster configurations produce factual type9/15 with zero persisted HP and exact Source prop timestamps", () => {
    const rules = fixture();
    expect(worldMonsterConfiguration(rules, "101")).toEqual({ id: "101", boss: true, four: true });
    expect(() => worldMonsterConfiguration(rules, "999")).toThrow();
    const row = { id: 6, worldId: 0, pointType: 0 };
    expect(worldMonsterSpawn(rules, row, "100", 10000n, 86400, false)).toMatchObject({
        pointType: 9,
        pointItem: "100",
        startTime: 10000n,
        flushTime: 86410000n,
        monsterCurrHP: 0,
        flushFlag: 0,
    });
    expect(worldMonsterProp(rules, [row], 6, "100", 4, 10000n)[0]).toMatchObject({
        startTime: 5000n,
        flushTime: 10805000n,
        flushFlag: 1,
    });
    expect(() => worldMonsterProp(rules, [row], 6, "101", 4, 10000n)).toThrow();
});
test("Source monster reuse derives health from existing catalogs and applies strict TTL and point-type checks", () => {
    const rules = fixture(),
        row = { pointType: 9, pointItem: "100", flushTime: 1000n, monsterCurrHP: 0 };
    expect(reusableWorldMonster(row, "100", 100n, 899n, rules)).toBe(true);
    expect(reusableWorldMonster(row, "100", 100n, 900n, rules)).toBe(false);
    expect(reusableWorldMonster({ ...row, pointType: 15 }, "100", 0n, 0n, rules)).toBe(false);
    expect(worldMonsterAreaRanges(1, 35, 1201)).toEqual([[0, 34, 0, 34]]);
    expect(worldMonsterAreaRanges(0, 35, 1201)).toEqual([[-35, -1, 1155, 1189]]);
});
test("four-cell natural spawns consume a complete native footprint and populate actual Source range metadata", () => {
    const rules = fixture(),
        rows = [1, 2, 5, 6].map((id) => ({ id, worldId: 0, pointType: 0 })),
        cells = chooseWorldMonsterCells(rows, true, 4, (maximum) => maximum - 1);
    expect(cells.map((row) => row.id)).toEqual([6, 5, 2, 1]);
    expect(
        spawnWorldMonsterCells(rules, cells, "101", 100n, 20)
            .slice(1)
            .every((row) =>
                row.pointType === 17 && row.monsterCurrHP === 0 && row.flushTime === 20100n
            ),
    ).toBe(true);
    expect(chooseWorldMonsterCells(rows.slice(0, 3), true, 4, () => 0)).toEqual([]);
});
