import type { Rule } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaFloat } from "./java-float.ts";

export interface KingdomSkill
{
    id: string | null;
    showTab: number;
    tabIndex: number;
    online: string | undefined;
    test: string | undefined;
}

export function restoredKingdomSkills(records: readonly Rule[]): KingdomSkill[]
{
    if (records.length > 4096)
    {
        throw new Error("Too many kingdom skill records");
    }

    const result: KingdomSkill[] = [];

    for (const record of records)
    {
        try
        {
            const category = Number(javaDecimal(record.skillCategory, 32));

            if (category < 0 || category > 4)
            {
                throw new Error("Invalid kingdom skill category");
            }

            for (const field of ["effectType", "cd", "effectTime", "releaseTimes", "useType"])
            {
                javaDecimal(record[field], 32);
            }

            const cost = record.costMaterial;

            if (typeof cost !== "string" || cost.length > 65535)
            {
                throw new Error("Invalid kingdom skill cost");
            }

            if (cost.includes(";"))
            {
                const parts = cost.split(";");

                while (parts.at(-1) === "")
                {
                    parts.pop();
                }

                if (parts.length > 4096)
                {
                    throw new Error("Too many kingdom skill costs");
                }

                for (const part of parts)
                {
                    javaDecimal(part, 32);
                }
            }
            else
            {
                javaDecimal(cost, 32);
            }

            javaFloat(record.sucRatio);
            const showTab = Number(javaDecimal(record.showTab, 32));
            const tabIndex = Number(javaDecimal(record.tabIndex, 32));
            javaDecimal(record.value, 32);
            result.push({
                id: record.id ?? null,
                showTab,
                tabIndex,
                online: record.online,
                test: record.test,
            });
        }
        catch
        {
        }
    }

    return result;
}
