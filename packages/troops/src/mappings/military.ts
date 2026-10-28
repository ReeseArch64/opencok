import { Type, sfs, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { troopDefinition } from "../rules/military";
import { woundedTroopsSchema, fortificationSchema } from "../validations/military";
import { validateFields } from "@opencok/messages/validations/fields";
import { armySnapshot } from "@opencok/mappings/bootstrap";

export class MilitaryMapper
{
    public woundedTroops(row: Row): Fields
    {
        const result: Fields = {
            id: sfs.string(text(row, "armyId")),
            dead: sfs.int(cityInteger(num(row, "dead"))),
        };

        if (num(row, "heal") > 0)
        {
            result.heal = sfs.int(cityInteger(num(row, "heal")));
            result.finish = sfs.long(long(row, "finishTime"));
        }

        return validateFields(woundedTroopsSchema, result);
    }

    public fortification(row: Row, rules: Rules): Fields
    {
        const rule = troopDefinition(rules, text(row, "armyId"));
        const result: Fields = {
            id: sfs.string(text(row, "armyId")),
            free: sfs.int(cityInteger(num(row, "num"))),
            level: sfs.int(cityInteger(num(row, "level"))),
        };

        if (num(row, "build") > 0)
        {
            result.train = sfs.int(cityInteger(num(row, "build")));
            result.finish = sfs.long(long(row, "finishTime"));
        }

        for (
            const [field, source] of [
                ["attack", "attack"],
                ["defen", "defence"],
                ["range", "range"],
                ["move", "move"],
                ["wood", "wood"],
                ["stone", "stone"],
                ["iron", "iron"],
                ["food", "food"],
                ["time", "time"],
                ["load", "load"],
            ]
        )
        {
            if (rule[source!] !== undefined)
            {
                result[field!] = sfs.int(cityInteger(rule[source!]));
            }
        }

        result.power = { type: Type.Float, value: Math.fround(Number(rule.power ?? 0)) };

        return validateFields(fortificationSchema, result);
    }

    private initialUnits(rules: Rules, ids: readonly number[], parameter: number): string[]
    {
        const result = new Set<string>();

        for (const id of ids)
        {
            for (
                const item of rules.buildings
                    .get(id)
                    ?.clientParameters?.[parameter]?.value.split(";")
                    .filter(Boolean) ?? []
            )
            {
                troopDefinition(rules, item);
                result.add(item);
            }
        }

        return [...result];
    }

    public militarySnapshot(
        armies: readonly Row[],
        hospital: readonly Row[],
        forts: readonly Row[],
        rules: Rules,
    ): Fields
    {
        if (armies.length > 1024 || hospital.length > 1024 || forts.length > 1024)
        {
            throw new Error("Military snapshot exceeds bound");
        }

        const soldiers = new Map(armies.map((row) => [text(row, "armyId"), row])),
            defenses = new Map(forts.map((row) => [text(row, "armyId"), row]));

        if (soldiers.size !== armies.length || defenses.size !== forts.length)
        {
            throw new Error("Duplicate military identity");
        }

        for (const armyId of this.initialUnits(rules, [423000, 424000, 425000, 426000], 0))
        {
            if (!soldiers.has(armyId))
            {
                soldiers.set(armyId, { armyId, level: 0, free: 0, march: 0 });
            }
        }

        for (const armyId of this.initialUnits(rules, [416000], 3))
        {
            if (!defenses.has(armyId))
            {
                defenses.set(armyId, { armyId, level: 1, num: 0 });
            }
        }

        return {
            army: sfs.array(
                [...soldiers.values()]
                    .sort((a, b) => Number(a.armyId) - Number(b.armyId))
                    .map((row) => sfs.object(armySnapshot(row, rules))),
            ),
            hospital: sfs.array(hospital.map((row) => sfs.object(this.woundedTroops(row)))),
            fort: sfs.array(
                [...defenses.values()]
                    .sort((a, b) => Number(a.armyId) - Number(b.armyId))
                    .map((row) => sfs.object(this.fortification(row, rules))),
            ),
        };
    }
}
