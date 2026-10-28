import { importBuildingCatalog } from "@opencok/building/mappings/legacy-definition";
import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { Rules, type Rule } from "@opencok/rules/game";
import { reconnectUpkeep } from "@opencok/rules/reconnect-upkeep";
import { reconnectMail } from "@opencok/rules/reconnect-mail";

function fixture()
{
    const rules = new Rules(
        importBuildingCatalog(
            new Map<string, Rule>([
                ["404031", { level: "30", para4: "0;100|50;200" }],
                ["439001", { level: "1", unlock_type: "1" }],
                ["441001", { level: "1", para1: "40" }],
            ]),
        ),
        new Map(),
        new Map(),
    );
    rules.items.set("account", { k7: "1" });
    rules.items.set("on_trumpet", { k2: "all" });
    for (const key of ["p6_all", "p6_security_resources", "p6_weak"])
    {
        rules.features.set(key, { version: "2.0.0", online: "all" });
    }
    for (let arm = 1; arm <= 8; arm++)
    {
        rules.arms.set(String(arm), { upkeep: "86400000", new_arms: "1", arm: String(arm) });
    }
    const buildings: Row[] = [
        { uuid: "cellar", itemId: 404000, level: 30, star: 1, progress: 50 },
        { uuid: "templar", itemId: 439000, level: 1, unlockFlag: 1 },
        { uuid: "hospital", itemId: 441000, level: 1 },
    ];
    const context = { kingdomId: 1, version: "12.06.0", now: 1000 };
    const environment = {
        specialServer: false,
        consumptionRatio: 1,
        effect: (id: number) => (id === 38 ? 50 : id === 72 ? 30 : id === 2804 ? 50 : 0),
        cellarGeneralEffect: () => 10,
    };
    return { rules, buildings, context, environment };
}

test("reconnect upkeep restores starred cellar protection, paired troop reductions and weakness gates", () => {
    const { rules, buildings, context, environment } = fixture();
    const armies = Array.from(
        { length: 8 },
        (_, index) => ({ armyId: String(index + 1), free: 1 }),
    );
    const result = reconnectUpkeep(armies, buildings, rules, context, environment);
    expect(result.rates).toEqual({ ordinary: 0, bound: 7 });
    expect(result.options).toEqual({
        protect: true,
        protectedFood: 360,
        separateBound: true,
        consumptionRatio: 1,
    });
    expect(result.weakness).toBe(true);
    expect(result.capacity).toBe(40);
    expect(result.showBound).toBe(true);
    buildings[1]!.unlockFlag = 0;
    expect(reconnectUpkeep(armies, buildings, rules, context, environment).weakness).toBe(false);
    rules.features.delete("p6_all");
    expect(reconnectUpkeep(armies, buildings, rules, context, environment).rates).toEqual({
        ordinary: 7,
        bound: 0,
    });
});

test("bound display has the legacy strict version boundary and is disabled in special realms", () => {
    const { rules, buildings, context, environment } = fixture();
    for (
        const [version, expected] of [
            ["2.0.2", false],
            ["2.0.3", false],
            ["2.0.4", true],
        ] as const
    )
    {
        expect(
            reconnectUpkeep([], buildings, rules, { ...context, version }, environment).showBound,
        ).toBe(expected);
    }
    const special = reconnectUpkeep([], buildings, rules, context, {
        ...environment,
        specialServer: true,
    });
    expect(special.options.separateBound).toBe(false);
    expect(special.showBound).toBe(false);
});

test("reconnect mail records a plain skill repair and localized weakness totals without granting rewards", () => {
    const { rules } = fixture();
    rules.mail.set("12082", { title: "weak-title", message: "weak-message", category: "WK" });
    rules.mail.set("12083", { title: "dead-title", message: "dead-message" });
    let sequence = 0;
    const stem = () => (++sequence).toString(16).padStart(32, "0");
    const plan = reconnectMail(
        "1001",
        1000n,
        ["general"],
        { weakened: 3, dead: 2 },
        rules,
        stem,
        () => {
            throw new Error("Unexpected reward");
        },
    );
    expect(plan).toHaveLength(2);
    expect(plan[0]!.itemIdFlag).toBe(0);
    expect(plan[1]!.itemIdFlag).toBe(1);
    expect(plan[1]!.type).toBe(2);
    expect(Buffer.from(plan[1]!.contents).toString().replace(/\0+$/, "")).toBe(
        "dead-message|5|3|2",
    );
    const weak = reconnectMail(
        "1001",
        1000n,
        [],
        { weakened: 3, dead: 0 },
        rules,
        stem,
        () => null,
    )[0]!;
    expect(weak.uid.endsWith("WK")).toBe(true);
    expect(Buffer.from(weak.contents).toString().replace(/\0+$/, "")).toBe("weak-message|3");
    expect(weak.rewardId).toBeNull();
    expect(
        reconnectMail("1001", 1000n, [], { weakened: 0, dead: 0 }, rules, stem, () => null),
    ).toEqual([]);
});
