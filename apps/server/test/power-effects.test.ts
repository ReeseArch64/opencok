import { expect, test } from "bun:test";
import type { PowerSnapshot } from "@opencok/contracts/power";
import { storedPowerEffects } from "@opencok/rules/power-effects";
import { Rules } from "@opencok/rules/game";

const now = 1792756800000;
function fixture()
{
    const state: PowerSnapshot = {
        profile: {},
        statistics: undefined,
        generals: [],
        armies: [],
        walls: [],
        buildings: [],
        sciences: [],
        civilizationSciences: [],
        sagaSciences: [],
        foreignSciences: [],
        equipment: [],
        heroes: [],
        dragons: [],
        dragonSkills: [],
        knight: undefined,
        items: [],
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
    };
    const rules = new Rules(
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
        {
            sciences: new Map(),
            statuses: new Map(),
            civilizationSciences: new Map(),
            sagaSciences: new Map(),
            sagaScienceBases: new Map(),
            foreignSciences: new Map(),
            foreignScienceBases: new Map(),
        },
    );
    return { state, rules };
}

test("power effects combine initial and completed research values in Java float order", () => {
    const { state, rules } = fixture();
    rules.items.set("effect", { id: "effect", k1: "487;16777216|999;50" });
    state.sciences = [
        { itemId: "1000", level: 1 },
        { itemId: "2000", level: 1 },
        { itemId: "3000", level: 0 },
    ];
    rules.power.sciences!.set("1001", { id: "1001", para1: "487", para2: "1" });
    rules.power.sciences!.set("2001", { id: "2001", para1: "999|487", para2: "1" });
    rules.power.sciences!.set("3000", { id: "3000", para1: "487", para2: "100" });
    expect(storedPowerEffects(state, rules, now)).toEqual({
        initialAndScience: 16777216,
        status: 0,
    });
    rules.items.set("effect", { id: "effect", k1: "487;5|487;2" });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(9);
    expect(state.sciences[2]?.level).toBe(0);
});

test("army/trap unlock research and unrelated effects do not contribute to dragon attack", () => {
    const { state, rules } = fixture();
    for (const [index, para1] of ["army", "trap", "999", ""].entries())
    {
        const id = String(1000 + index);
        rules.power.sciences!.set(id, { id, para1, para2: "999" });
        state.sciences = [{ itemId: String(999 + index), level: 1 }];
        expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(0);
    }
});

test("live statuses use configured or persisted random effects and ignore expired entries", () => {
    const { state, rules } = fixture();
    rules.power.statuses!.set("510001", {
        id: "510001",
        effect: "487;5|999;200|487;2",
        random: "0",
    });
    rules.power.statuses!.set("510002", { id: "510002", effect: "999;50", random: "1" });
    rules.power.statuses!.set("510003", { id: "510003" });
    state.states = [
        { stateId: 510001, endTime: BigInt(now + 1), ranEffValue: 300 },
        { stateId: 510002, endTime: BigInt(now + 1), ranEffId: 487, ranEffValue: 25 },
        { stateId: 510002, endTime: BigInt(now + 1), ranEffId: -1, ranEffValue: 999 },
        { stateId: 510003, endTime: BigInt(now + 1), ranEffId: 487, ranEffValue: 999 },
        { stateId: 999999, endTime: BigInt(now), ranEffId: 487, ranEffValue: 999 },
    ];
    const before = structuredClone(state);
    expect(storedPowerEffects(state, rules, now)).toEqual({ initialAndScience: 0, status: 32 });
    expect(state).toEqual(before);
});

test.each([100, 101, 102, 103, 104, 105, 106, 108, 109, 115, 116, 117, 121, 123, 200, 202])(
    "storedPowerEffects_savedSkinType%s_ignoresConfiguredAndRandomBonusesAfterReloadAndExpiry",
    (type) => {
        const { state, rules } = fixture();
        rules.items.set("effect", { id: "effect", k1: "487;3" });
        rules.power.sciences!.set("1001", { id: "1001", para1: "487", para2: "7" });
        rules.power.statuses!.set("1", { id: "1", type2: String(type), effect: "487;100" });
        rules.power.statuses!.set("2", {
            id: "2",
            type2: String(type),
            random: "1",
            effect: "487;200",
        });
        rules.power.statuses!.set("3", { id: "3", type2: "9", effect: "487;25" });
        state.sciences = [{ itemId: 1000, level: 1 }];
        state.states = [
            { stateId: 1, type2: type, endTime: BigInt(now + 100) },
            {
                stateId: 2,
                type2: type,
                endTime: BigInt(now + 100),
                ranEffId: 487,
                ranEffValue: 999,
            },
            { stateId: 3, endTime: BigInt(now + 1000) },
        ];
        const persisted = structuredClone(state);

        expect(storedPowerEffects(state, rules, now)).toEqual({
            initialAndScience: 10,
            status: 25,
        });
        expect(storedPowerEffects(structuredClone(persisted), rules, now + 100))
            .toEqual({ initialAndScience: 10, status: 25 });
        expect(state).toEqual(persisted);
    },
);

test("throne status overrides and integer overflow match the legacy status accumulator", () => {
    const { state, rules } = fixture();
    rules.power.statuses!.set("510152", { id: "510152", effect: "487;1" });
    state.states = [
        { stateId: 510152, endTime: BigInt(now + 1), ranEffValue: 2147483647 },
        { stateId: 510152, endTime: BigInt(now + 1), ranEffValue: 1 },
    ];
    expect(storedPowerEffects(state, rules, now).status).toBe(-2147483648);
});

test("missing or malformed active effect rules cannot become an implicit zero bonus", () => {
    const { state, rules } = fixture();
    state.sciences = [{ itemId: "1000", level: 1 }];
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
    rules.power.sciences!.set("1001", { id: "1001", para1: "487", para2: "1.5" });
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
    state.sciences = [];
    state.states = [{ stateId: 510001, endTime: BigInt(now + 1) }];
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
    rules.power.statuses!.set("510001", { id: "510001", effect: "487;2147483648" });
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
});

test("stored research effects follow initial ordinary saga foreign civilization float accumulation", () => {
    const { state, rules } = fixture();
    rules.items.set("effect", { id: "effect", k1: "487;16777216" });
    state.sciences = [{ itemId: 1000, level: 1 }];
    rules.power.sciences!.set("1001", { id: "1001", para1: "487", para2: "1" });
    state.sagaSciences = [{ itemid: 2000, level: 1 }];
    rules.power.sagaScienceBases!.set("2000", { id: "2000", hide: "0" });
    rules.power.sagaSciences!.set("102001", { id: "102001", effect: "487", value: "-16777216" });
    state.foreignSciences = [{ itemid: 3000, level: 2 }];
    rules.power.foreignScienceBases!.set("3000", { id: "3000", hide: "0" });
    rules.power.foreignSciences!.set("103002", { id: "103002", effect: "487", value: "0.3" });
    state.civilizationSciences = [{ baseItemID: 4000, level: 3 }];
    rules.power.civilizationSciences!.set("4003", { id: "4003", para1: "487", para2: "10" });
    const before = structuredClone(state);
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(Math.fround(0.4));
    expect(state).toEqual(before);
    expect(rules.features.size).toBe(0);
});

test("tower research includes stored level zero and ignores hidden entries without requiring level rules", () => {
    const { state, rules } = fixture();
    state.sagaSciences = [
        { itemid: 2000, level: 0 },
        { itemid: 3000, level: 1 },
    ];
    rules.power.sagaScienceBases!.set("2000", { id: "2000", hide: "0" });
    rules.power.sagaScienceBases!.set("3000", { id: "3000", hide: "1" });
    rules.power.sagaSciences!.set("102000", { id: "102000", effect: "487", value: "2.5" });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(2.5);
    state.foreignSciences = [{ itemid: 4000, level: 0 }];
    rules.power.foreignScienceBases!.set("4000", { id: "4000", hide: "1" });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(2.5);
    rules.power.foreignScienceBases!.get("4000")!.hide = "2";
    rules.power.foreignSciences!.set("104000", { id: "104000", effect: "487", value: "-3.5" });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(-1);
});

test("tower token pairs skip empty tokens and stop when either vector ends", () => {
    const { state, rules } = fixture();
    state.foreignSciences = [{ itemid: 3000, level: 1 }];
    rules.power.foreignScienceBases!.set("3000", { id: "3000", hide: "0" });
    const rule = { id: "103001", effect: ";487;;218;487;999;", value: ";1.25;;8;2.5;" };
    rules.power.foreignSciences!.set(rule.id, rule);
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(3.75);
    expect(storedPowerEffects(state, rules, now, 218).initialAndScience).toBe(8);
    rule.effect = "487";
    rule.value = "4;malformed-unused-tail";
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(4);
    rule.value = " ";
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(0);
});

test("civilization research scales float percentages and replaces duplicate base rows in hash order", () => {
    const { state, rules } = fixture();
    state.civilizationSciences = [
        { baseItemID: 17, level: 0 },
        { baseItemID: 1, level: 0 },
        { baseItemID: 2, level: 0 },
        { baseItemID: 17, level: 1 },
    ];
    rules.power.civilizationSciences!.set("17", { id: "17", para1: "487", para2: "999" });
    rules.power.civilizationSciences!.set("18", { id: "18", para1: "487", para2: "1677721600" });
    rules.power.civilizationSciences!.set("1", { id: "1", para1: "487", para2: "100" });
    rules.power.civilizationSciences!.set("2", { id: "2", para1: "487", para2: "-1677721600" });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(0);
    state.civilizationSciences = [{ baseItemID: 1, level: 0 }];
    rules.power.civilizationSciences!.set("1", {
        id: "1",
        para1: "487|218|487",
        para2: "33.333333",
    });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(
        Math.fround(Math.fround(Math.fround(33.333333) / 100) * 2),
    );
    rules.power.civilizationSciences!.set("1", { id: "1", para1: "487" });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(-1);
});

test("research catalog IDs preserve signed addition before lookup", () => {
    const { state, rules } = fixture();
    state.foreignSciences = [{ itemid: 2147483647, level: 1 }];
    rules.power.foreignScienceBases!.set("2147483647", { id: "2147483647", hide: "0" });
    rules.power.foreignSciences!.set("-2147383648", {
        id: "-2147383648",
        effect: "487",
        value: "5",
    });
    state.civilizationSciences = [{ baseItemID: 2147483647, level: 1 }];
    rules.power.civilizationSciences!.set("-2147483648", {
        id: "-2147483648",
        para1: "487",
        para2: "200",
    });
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(7);
});

test("civilization research skips unavailable levels and preserves recognized bonuses and rows", () => {
    const { state, rules } = fixture();
    state.civilizationSciences = [
        { baseItemID: 4000, level: 10 },
        { baseItemID: 5000, level: 2 },
        { baseItemID: 6000, level: 7 },
    ];
    rules.power.civilizationSciences!.set("5002", { id: "5002", para1: "487", para2: "250" });
    const before = structuredClone(state.civilizationSciences);
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(2.5);
    expect(state.civilizationSciences).toEqual(before);
    rules.power.civilizationSciences!.clear();
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(0);
});

test("missing tower research rules and malformed paired values fail without consuming progression", () => {
    const { state, rules } = fixture();
    state.foreignSciences = [{ itemid: 3000, level: 0 }];
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
    rules.power.foreignScienceBases!.set("3000", { id: "3000", hide: "0" });
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
    rules.power.foreignSciences!.set("103000", { id: "103000", effect: "218;487", value: "NaN;5" });
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
    state.foreignSciences = [];
    state.civilizationSciences = [{ baseItemID: 4000, level: 1 }];
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(0);
    rules.power.civilizationSciences!.set("4001", { id: "4001", para1: "487", para2: "Infinity" });
    expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
});
