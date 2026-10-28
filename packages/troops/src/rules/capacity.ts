import type { TroopsContext } from "../contracts/context";
import { cityInteger } from "@opencok/rules/city-progression";
import { totalBuildingParameter } from "./military";

export function trainingCapacity(context: TroopsContext, type: number)
{
    const specific = ({ 1: 761, 8: 762, 9: 763, 10: 764 } as Record<number, number>)[type];
    const building = (
        { 1: 423000, 8: 424000, 9: 425000, 10: 426000, 17: 439000 } as Record<number, number>
    )[type]!;
    let capacity = totalBuildingParameter(context.state, context.rules, 410000, 0)
        + cityInteger(context.rules.items.get("building_base")?.k2 ?? 0)
        + context.effect(131)
        + context.generalEffect(131, building)
        + context.effect(2152);

    if (specific)
    {
        capacity += context.effect(specific) + context.generalEffect(specific, building);
    }

    if (type === 17)
    {
        capacity += totalBuildingParameter(context.state, context.rules, 439000, 1);
    }

    return cityInteger(Math.max(0, Math.ceil(capacity * (1 + context.effect(852) / 100))));
}

export function hospitalCapacity(context: TroopsContext)
{
    const base = totalBuildingParameter(context.state, context.rules, 411000, 0)
        + context.effect(73)
        + context.generalEffect(73);
    const multiplier = 1 + (context.effect(57) + context.generalEffect(57)) / 100;

    return cityInteger(Math.max(0, Math.trunc(base * Math.max(0, multiplier))));
}

export function fortificationCapacity(context: TroopsContext)
{
    return cityInteger(
        Math.max(
            0,
            totalBuildingParameter(context.state, context.rules, 419000, 0) + context.effect(88),
        ),
    );
}
