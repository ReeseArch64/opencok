import type { ConstructionCatalog, ConstructionContext } from "../contracts/construction";
import type { ConstructionRuntime } from "../contracts/construction-runtime";
import type { BuildingState } from "../contracts/building";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export class ConstructionPolicy<
    TCatalog extends ConstructionCatalog,
    TContext extends ConstructionContext<TCatalog>,
>
{
    public constructor(private readonly runtime: ConstructionRuntime<TCatalog, TContext>)
    {}

    public requirements(context: TContext, rule: BuildingState)
    {
        const { num, cityLevel } = this.runtime;
        const state = context.state;

        if (rule.limit === 1)
        {
            throw new GameError(errors.buildingLimited, "city_progression");
        }

        for (const requirement of rule.requiredBuildings ?? [])
        {
            if (
                !state.buildings.some(
                    (row) =>
                        num(row, "itemId") === requirement.buildingId
                        && cityLevel(row) >= requirement.level,
                )
            )
            {
                throw new GameError(errors.resource, "city_progression");
            }
        }

        for (const requirement of rule.requiredStarBuildings ?? [])
        {
            const base = Math.trunc(requirement.levelId / 100) * 100,
                star = requirement.levelId % 100;

            if (
                state.buildings.filter((row) =>
                    num(row, "itemId") === base && num(row, "star") >= star
                )
                    .length < requirement.quantity
            )
            {
                throw new GameError(errors.resource, "city_progression");
            }
        }

        if (
            (rule.civilizationLevel ?? 0)
                > (num(state.profile, "civilizationType") === 0
                    ? 0
                    : this.runtime.prestige(context))
        )
        {
            throw new GameError(errors.prestige, "city_progression");
        }
    }

    public position(context: TContext, pos: number, itemId: string)
    {
        const { text, cityInteger } = this.runtime;
        const { state, rules } = context;

        cityInteger(pos);
        const rule = [...rules.positions.values()].find((row) => Number(row.position) === pos);

        if (!rule || !(rule.building?.split(";") ?? []).includes(itemId))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const opened = text(state.profile, "openedPos").split(/[;|,]/).includes(String(pos));

        if (rule.unlock !== "1" && !opened)
        {
            throw new GameError(errors.locked, "city_progression");
        }
    }
}
