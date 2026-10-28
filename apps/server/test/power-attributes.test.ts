import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { generalSkillEffects } from "@opencok/hero/rules/general-skill-effects";
import { equipmentEffects, equipmentSetEffects } from "@opencok/rules/power-attributes";
import { Rules } from "@opencok/rules/game";

function fixture()
{
    return new Rules(
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        1,
        new Map(),
        {},
        { generalSkills: new Map(), equipment: new Map(), equipmentSets: new Map() },
    );
}

test("general abilities decode stored trees, ignore selection metadata and retain every general", () => {
    const rows: Row[] = [
        {
            ability: Buffer.from(
                "[{\"id\":\"50000\",\"600001\":2,\"600002\":3},{\"ids\":\"saved\",\"invalid\":null},{\"id\":\"50001\",\"600001\":1}]\0",
            ),
            abilityIndex: 2,
            status: 4,
        },
        { ability: null },
        {},
        { ability: Buffer.from("[{\"600003\":0,\"600004\":-1}]") },
    ];
    const before = rows.map((row) => ({
        ...row,
        ...(Buffer.isBuffer(row.ability) ? { ability: Buffer.from(row.ability) } : {}),
    }));
    expect(generalSkillPoints(rows)).toEqual([
        [
            { id: "600001", points: 2 },
            { id: "600002", points: 3 },
            { id: "600001", points: 1 },
        ],
        [],
        [],
        [
            { id: "600003", points: 0 },
            { id: "600004", points: -1 },
        ],
    ]);
    expect(rows).toEqual(before);
});

test("malformed general abilities fail with sanitized errors instead of losing persisted skills", () => {
    for (
        const raw of [
            "",
            "{}",
            "null",
            "[null]",
            "[[]]",
            "[{\"600001\":\"1\"}]",
            "[{\"600001\":1.5}]",
            "[{\"600001\":1e2}]",
            "[{\"600001\":2147483648}]",
            "[{\"600001\":-2147483649}]",
            "[{\"__proto__\":1}]",
            "[{\"2147483648\":1}]",
        ]
    )
    {
        expect(() => generalSkillPoints([{ ability: Buffer.from(raw) }])).toThrow("102192");
    }
    expect(() => generalSkillPoints([{ ability: "[]" }])).toThrow("102192");
});

test("passive skill effects use points minus one, last repeated effect and per-general sums", () => {
    const rules = fixture();
    rules.power.generalSkills!.set("600001", {
        id: "600001",
        type: "0",
        para1: "487|999|487",
        base: "1.5|2|3.5",
        add: "0.25|2|0.5",
    });
    rules.power.generalSkills!.set("600002", { id: "600002", type: "1" });
    const generals = generalSkillPoints([
        { ability: Buffer.from("[{\"600001\":3,\"600002\":999}]") },
        { ability: Buffer.from("[{\"600001\":0}]") },
    ]);
    expect(generalSkillEffects(generals, rules)).toEqual(
        new Map([
            [487, 7.5],
            [999, 6],
        ]),
    );
});

test("skill calculations round at each Java float operation and wrap integer subtraction", () => {
    const rules = fixture();
    rules.power.generalSkills!.set("600001", {
        id: "600001",
        type: "0",
        para1: "487",
        base: "16777216",
        add: "1",
    });
    expect(generalSkillEffects([[{ id: "600001", points: 2 }]], rules).get(487)).toBe(16777216);
    rules.power.generalSkills!.get("600001")!.base = "0";
    expect(generalSkillEffects([[{ id: "600001", points: -2147483648 }]], rules).get(487)).toBe(
        2147483648,
    );
    rules.power.generalSkills!.get("600001")!.base = "0.1";
    rules.power.generalSkills!.get("600001")!.add = "0.2";
    expect(generalSkillEffects([[{ id: "600001", points: 3 }]], rules).get(487)).toBe(0.5);
});

test("missing skill catalogs and incomplete effect vectors fail explicitly", () => {
    const rules = fixture();
    const generals = [[{ id: "600001", points: 1 }]];
    expect(() => generalSkillEffects(generals, rules)).toThrow("102192");
    for (const add of ["", "1", "1|NaN", "1|Infinity", "1|1e100"])
    {
        rules.power.generalSkills!.set("600001", {
            id: "600001",
            type: "0",
            para1: "487|999",
            base: "1|2",
            add,
        });
        expect(() => generalSkillEffects(generals, rules)).toThrow("102192");
    }
});

test("worn equipment combines indexed and persisted extras with color and position modifiers", () => {
    const rules = fixture();
    rules.power.equipment!.set("1001", {
        id: "1001",
        color: "2",
        site: "0",
        para1: "487|999",
        num1: "10",
        para2: "487",
        num2: "2",
        para4: "487",
        num4: "1000",
    });
    const modifiers = new Map([
        [214, 25],
        [207, 25],
    ]);
    const queried: number[] = [];
    const rows: Row[] = [
        { itemId: 1001, on: 1, extraProperty: "487@999,4,synthetic|487,2" },
        { itemId: 9999, on: 0, extraProperty: "invalid" },
    ];
    const before = structuredClone(rows);
    expect(
        equipmentEffects(rows, rules, (id) => {
            queried.push(id);
            return modifiers.get(id)!;
        }),
    ).toEqual(
        new Map([
            [487, 27],
            [999, 21],
        ]),
    );
    expect(queried).toEqual([214, 207]);
    expect(rows).toEqual(before);
});

test("dragon equipment pairs vector values and requires persisted refinement when configured", () => {
    const rules = fixture();
    rules.power.equipment!.set("1001", {
        id: "1001",
        color: "5",
        site: "6",
        para1: "487|999|487",
        num1: "4|8|2",
        para2: "9001",
    });
    const modifiers = new Map([
        [217, 25],
        [213, 75],
    ]);
    const effectValue = (id: number) => modifiers.get(id)!;
    expect(
        equipmentEffects([{ itemId: 1001, on: 1, extraProperty: "487,3" }], rules, effectValue),
    ).toEqual(
        new Map([
            [487, 18],
            [999, 16],
        ]),
    );
    for (const extraProperty of [null, ""])
    {
        expect(() => equipmentEffects([{ itemId: 1001, on: 1, extraProperty }], rules, effectValue))
            .toThrow("102192");
    }
    rules.power.equipment!.get("1001")!.num1 = "4|8";
    expect(() =>
        equipmentEffects([{ itemId: 1001, on: 1, extraProperty: "487,3" }], rules, effectValue)
    ).toThrow("102192");
});

test("all equipment colors and positions select their own additive modifiers", () => {
    const rules = fixture();
    for (let color = 0; color <= 5; color++)
    {
        for (const [site, siteEffect] of [207, 209, 208, 210, 211, 212, 213].entries())
        {
            rules.power.equipment!.set("1001", {
                id: "1001",
                color: String(color),
                site: String(site),
                para1: "487",
                num1: "100",
            });
            const queried: number[] = [];
            const effect = equipmentEffects([{ itemId: 1001, on: 1 }], rules, (id) => {
                queried.push(id);
                return 50;
            });
            expect(queried).toEqual(color >= 2 ? [212 + color, siteEffect] : [siteEffect]);
            expect(effect.get(487)).toBe(color >= 2 ? 200 : 150);
        }
    }
});

test("equipment accumulation preserves Java float grouping and requires resolved modifiers", () => {
    const rules = fixture();
    rules.power.equipment!.set("1001", {
        id: "1001",
        color: "0",
        site: "0",
        para1: "487",
        num1: "16777216",
    });
    const rows = [{ itemId: 1001, on: 1, extraProperty: "487,1|487,1" }];
    expect(equipmentEffects(rows, rules, () => 0).get(487)).toBe(16777218);
    expect(() => equipmentEffects(rows, rules, () => NaN)).toThrow("102192");
    expect(() => equipmentEffects(rows, rules, () => Infinity)).toThrow("102192");
    expect(() => equipmentEffects([{ itemId: 9999, on: 1 }], rules, () => 0)).toThrow("102192");
    for (const extraProperty of ["487", "487,NaN", "487,0x10", "487,1e100", "bad,1"])
    {
        expect(() => equipmentEffects([{ itemId: 1001, on: 1, extraProperty }], rules, () => 0))
            .toThrow("102192");
    }
});

test("equipment contributions clamp after each item and expose previously loaded modifiers", () => {
    const rules = fixture();
    rules.power.equipment!.set("1001", { id: "1001", para1: "207", num1: "-10" });
    rules.power.equipment!.set("1002", { id: "1002", para1: "207", num1: "50" });
    rules.power.equipment!.set("1003", {
        id: "1003",
        color: "0",
        site: "0",
        para1: "487",
        num1: "10",
    });
    const effect = equipmentEffects(
        [
            { itemId: 1001, on: 1 },
            { itemId: 1002, on: 1 },
            { itemId: 1003, on: 1 },
        ],
        rules,
        (id, equipped) => equipped.get(id) ?? 0,
    );
    expect(effect).toEqual(
        new Map([
            [207, 50],
            [487, 15],
        ]),
    );
});

const context = { kingdomId: 1, version: "12.06.0", now: 1792756800000 };
function setFixture()
{
    const rules = fixture();
    rules.features.set("suit", { id: "suit", version: "12.06.0", online: "1" });
    rules.features.set("equipment_strengthen", {
        id: "equipment_strengthen",
        version: "99.0.0",
        online: "1",
    });
    rules.power.equipment!.set("1001", { id: "1001", suit_id: "9001" });
    rules.power.equipmentSets!.set("9001", {
        id: "9001",
        suit_para1: "487|999",
        suit_num1: "2|999",
        suit_para2: "487",
        suit_num2: "4",
        suit_para3: "487",
        suit_num3: "6",
        suit_effect: "2-487#4-487#6-487#8-487#10-487",
        suit_value: "2-10#4-20#6-30#8-40#10-50",
    });
    const equipment: Row[] = Array.from({ length: 6 }, () => ({
        itemId: 1001,
        on: 1,
        strengthLevel: 4,
    }));
    return { rules, equipment };
}

test("equipment set thresholds share the first value and strengthen only complete six-piece sets", () => {
    const { rules, equipment } = setFixture();
    for (
        const [count, expected] of [
            [1, 0],
            [2, 2],
            [3, 2],
            [4, 6],
            [5, 6],
            [6, 42],
        ]
    )
    {
        const effects = equipmentSetEffects(
            equipment.slice(0, count),
            null,
            rules,
            context,
            new Map([[487, 1]]),
        );
        expect(effects.get(487)).toBe(expected! + 1);
        expect(effects.get(999) ?? 0).toBe(count! >= 2 ? 2 : 0);
    }
    equipment[0]!.strengthLevel = 3;
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(22);
    equipment[0]!.strengthLevel = 0;
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(12);
    for (const row of equipment)
    {
        row.strengthLevel = 99;
    }
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(162);
    equipment.push({ ...equipment[0]! });
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(12);
});

test("hero-only set effects are excluded and refinement is server-gated independently of client version", () => {
    const { rules, equipment } = setFixture();
    rules.power.equipmentSets!.get("9001")!.suit_hero1 = "";
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(40);
    rules.features.get("equipment_strengthen")!.online = "2";
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(10);
    const olderClient = { ...context, version: "12.05.0" };
    expect(equipmentSetEffects(equipment, null, rules, olderClient, new Map()).size).toBe(0);
    rules.features.get("suit")!.start = "2026-10-24-00-00";
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).size).toBe(0);
});

test("selected decomposed set bonuses apply independently of worn sets and preserve slot order", () => {
    const { rules } = setFixture();
    rules.features.clear();
    const base = new Map([[487, 10]]);
    expect(equipmentSetEffects([], "9001;9001;9001", rules, context, base)).toEqual(
        new Map([
            [487, 22],
            [999, 2],
        ]),
    );
    expect(base).toEqual(new Map([[487, 10]]));
    rules.power.equipmentSets!.get("9001")!.suit_num1 = "-20";
    expect(equipmentSetEffects([], "9001;9001;9001", rules, context, base).get(487)).toBe(10);
    expect(() => equipmentSetEffects([], "9001;0", rules, context, base)).toThrow("102192");
    expect(() => equipmentSetEffects([], "9002;0;0", rules, context, base)).toThrow("102192");
});

test("incomplete strengthen entries are skipped individually while known set bonuses remain", () => {
    const { rules, equipment } = setFixture();
    rules.power.equipmentSets!.get("9001")!.suit_value = "2-10#4-invalid";
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(22);
    rules.power.equipmentSets!.get("9001")!.suit_effect = "";
    expect(equipmentSetEffects(equipment, null, rules, context, new Map()).get(487)).toBe(12);
    rules.power.equipmentSets!.clear();
    expect(() => equipmentSetEffects(equipment, null, rules, context, new Map())).toThrow("102192");
});
