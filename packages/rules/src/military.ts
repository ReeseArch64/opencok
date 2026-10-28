import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, text, type Row } from "@opencok/contracts/rows";
import type { Rule, Rules } from "./game";
import { cityAmount, cityInteger } from "./city-progression";

export function unitPower(rule: Rule, count: number): bigint
{
    cityInteger(count);
    const raw = rule.power ?? "0";

    if (!/^\d+(?:\.\d{1,8})?$/.test(raw))
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    const [integer, fraction = ""] = raw.split("."),
        scale = 10n ** BigInt(fraction.length);

    return cityAmount(
        ((BigInt(integer!) * scale + BigInt(fraction || "0")) * BigInt(count)) / scale,
    );
}

export function cityBuildingParameter(row: Row, rules: Rules, index: number): number
{
    const definition = rules.building(
            text(row, "itemId"),
            num(row, "level"),
            num(row, "star"),
            num(row, "progress"),
        ),
        parameter = definition.clientParameters?.[index];

    if (!parameter)
    {
        return 0;
    }

    let value = parameter.value;

    for (const step of parameter.steps ?? [])
    {
        if (step.progress <= num(row, "progress"))
        {
            value = step.value;
        }
    }

    return cityInteger(value);
}
