import { expect, test } from "bun:test";
import { Rules, type Rule } from "@opencok/rules/game";
import { researchDefinition, researchCosts } from "../src/rules/research";
import { civilizationScience } from "../src/rules/civilization";
import { ResearchMapper } from "../src/mappings/research";
import { CivilizationResearchMapper } from "../src/mappings/civilization";
import { ResearchDomain } from "../src/services/research";
import { CivilizationScienceDomain } from "../src/services/civilization";
import { ResearchCommand } from "../src/enums/command";
import { sfs, fields, Type, type Value } from "@opencok/messages/sfs";

function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.power.sciences = new Map<string, Rule>([
        ["700100", {
            id: "700100",
            science_lv: "0",
            para2: "10",
            max_lv: "1",
            research_need: "0;100",
        }],
        ["700101", { id: "700101", science_lv: "1", para2: "20", max_lv: "1" }],
        ["700200", { id: "700200", science_lv: "0", para2: "30", max_lv: "1" }],
    ]);
    rules.power.civilizationSciences = new Map<string, Rule>([
        ["800000", { id: "800000", para2: "10" }],
        ["800001", { id: "800001", para2: "25" }],
        ["800003", { id: "800003", para2: "40" }],
    ]);

    return rules;
}

test("research selection retains strict mutation bases while wire snapshots accept saved level IDs", () => {
    const rules = fixture();
    expect(researchDefinition(rules, "700100", 1)).toBe(rules.power.sciences!.get("700101")!);
    for (const id of ["700101", "70010", "bad", "70010000x"])
    {
        expect(() => researchDefinition(rules, id, 0)).toThrow();
    }
    expect(() => researchDefinition(rules, "700100", 100)).toThrow();
    expect(() => researchDefinition(rules, "700100", 2)).toThrow();
    rules.power.sciences!.set("700102", { science_lv: "9" });
    expect(() => researchDefinition(rules, "700100", 2)).toThrow();
    const result = new ResearchMapper().research(
        { itemId: "700101", level: 0 },
        rules,
        9007199254740993n,
    );
    expect(result.itemId).toEqual(sfs.string("700101"));
    expect(result.para2).toEqual(sfs.string("20"));
    expect(result.cd).toEqual(sfs.long(9007199254740993n));
    expect(result.nextPara2).toEqual(sfs.string(""));
});

test("research snapshot merges unsaved level-zero entries without mutating inputs or losing pending deadlines", () => {
    const rules = fixture();
    const rows = [{ itemId: "700100", level: 1 }];
    const queues = [{ type: 6, itemId: "700100", updateTime: 9007199254740995n }];
    const before = structuredClone({ rows, queues });
    const result = new ResearchMapper().data(rows, queues, rules);
    const entries = (result.value as Value[]).map(fields);
    expect(entries.map((row) => row.itemId)).toEqual([sfs.string("700100"), sfs.string("700200")]);
    expect(entries[0]!.cd).toEqual(sfs.long(9007199254740995n));
    expect(entries[1]!.level).toEqual(sfs.int(0));
    expect(entries[1]!.cd).toEqual(sfs.long(0n));
    expect({ rows, queues }).toEqual(before);
});

test("duplicate or oversized research snapshots fail before producing a partial response", () => {
    const rules = fixture();
    const mapper = new ResearchMapper();
    const row = { itemId: "700100", level: 0 };
    const queue = { type: 6, itemId: "700100", updateTime: 1n };
    expect(() => mapper.data([row, row], [], rules)).toThrow("Duplicate saved research");
    expect(() => mapper.data([row], [queue, queue], rules)).toThrow("Duplicate pending research");
    expect(() => mapper.data(Array(4097).fill(row), [], rules)).toThrow(
        "Research snapshot exceeds bound",
    );
    expect(() => mapper.data([], Array(257).fill(queue), rules)).toThrow(
        "Research snapshot exceeds bound",
    );
    rules.power.sciences = new Map(
        Array.from({ length: 4097 }, (_, i) => [String(i), { id: String(i), science_lv: "0" }]),
    );
    expect(() => mapper.data([], [], rules)).toThrow("Research catalog exceeds bound");
});

test("research discounts retain sequential truncation, silver exclusions and invalid-cost rejection", () => {
    const effects = new Map([[181, 10], [757, 15], [180, 20], [2146, 30]]);
    const calls: number[] = [];
    const result = researchCosts({ research_need: "0;101|4;101" }, (id) => {
        calls.push(id);
        return effects.get(id) ?? 0;
    });
    expect(result).toEqual({ wood: 42n, silver: 50n });
    expect(calls).toEqual([181, 757, 180, 2146, 181, 180, 2146]);
    expect(researchCosts({ research_need: "3;100" }, () => 200)).toEqual({ food: 0n });
    for (const research_need of ["0;1|0;2", "5;1", "0;-1", "0;1;2", "0;9007199254740992"])
    {
        expect(() => researchCosts({ research_need }, () => 0)).toThrow();
    }
    expect(() => researchCosts({ research_need: "0;1" }, () => NaN)).toThrow();
});

test("civilization research rejects interior bases and gaps while retaining native float and deadline semantics", () => {
    const rules = fixture();
    expect(civilizationScience(rules, 800000, 1)).toBe(
        rules.power.civilizationSciences!.get("800001")!,
    );
    expect(() => civilizationScience(rules, 800001, 0)).toThrow();
    expect(() => civilizationScience(rules, 800000, 3)).toThrow();
    const mapper = new CivilizationResearchMapper();
    const result = mapper.view(rules, 800000, 0, 9007199254740997n);
    expect(result.para2).toEqual({ type: Type.Float, value: Math.fround(Math.fround(10) / 100) });
    expect(result.nextPara2).toEqual({
        type: Type.Float,
        value: Math.fround(Math.fround(25) / 100),
    });
    expect(result.cd).toEqual(sfs.long(9007199254740997n));
    expect(mapper.view(rules, 800003, 0).nextPara2).toEqual({ type: Type.Float, value: 0 });
    rules.power.civilizationSciences!.set("800003", { id: "800003" });
    expect(mapper.view(rules, 800003, 0).para2).toEqual({ type: Type.Float, value: -1 });
});

test("owned domains retain command and queue identities through the shared domain base without invoking hooks", () => {
    const unexpected = () => {
        throw new Error("Unexpected completion callback");
    };
    const ordinary = new ResearchDomain({ target: unexpected, expedition: unexpected });
    const civilization = new CivilizationScienceDomain();
    expect(ordinary.commands.map(String)).toEqual([
        "science.data.init",
        "science.research",
        "science.directly",
    ]);
    expect(civilization.commands).toEqual([
        "civilization.science.data.init",
        "race.science.research",
        "race.science.directly",
    ]);
    expect(ordinary.types).toEqual([6]);
    expect(civilization.types).toEqual([19]);
    expect(ordinary.handles(ResearchCommand.Start)).toBe(true);
    expect(civilization.handles(ResearchCommand.StartCivilization)).toBe(true);
    expect(ordinary.handles(ResearchCommand.StartCivilization)).toBe(false);
    expect(civilization.handles("forged.command")).toBe(false);
});
