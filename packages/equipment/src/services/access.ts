import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

import type {
    EquipmentCatalog,
    EquipmentContext,
    EquipmentRecord as Row,
} from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";

import { invalidEquipment as invalid } from "../validations/invalid";

export class EquipmentAccess<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
>
{
    public constructor(private readonly runtime: EquipmentRuntime<TCatalog, TContext>)
    {}

    public readonly forge = (context: TContext) => {
        const { num } = this.runtime;

        const row = context.state.buildings.find(
            (row) => num(row, "itemId") === 429000 && num(row, "level") > 0,
        );

        if (!row)
        {
            throw new GameError(errors.troopBuilding, "city_progression");
        }

        context.idleBuilding(row);

        return context.rules.building(
            "429000",
            num(row, "level"),
            num(row, "star"),
            num(row, "progress"),
        );
    };

    public readonly own = (context: TContext, id: string) => {
        const row = context.state.equipment.find((row) => row.uuid === id);

        if (!row)
        {
            throw new GameError(errors.missing, "city_progression");
        }

        return row;
    };

    public readonly idle = (row: Row) => {
        const { num } = this.runtime;

        if (num(row, "on") !== 0 || num(row, "generalid") !== 0)
        {
            invalid();
        }
    };
}
