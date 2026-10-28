import { randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { EquipmentCreationContext, EquipmentRecord as Row } from "../contracts/equipment";
import { EquipmentPolicy } from "../rules/equipment";

export class EquipmentFactory
{
    public constructor(private readonly policy: Pick<EquipmentPolicy, "equipmentRule">)
    {}

    public readonly newEquipment = (
        context: EquipmentCreationContext,
        id: string,
    ): Row => {
        this.policy.equipmentRule(context.rules, id);

        if (context.state.equipment.length + (context.write.equipment?.length ?? 0) >= 1000)
        {
            throw new GameError(errors.full, "city_progression");
        }

        return {
            uid: context.owner,
            uuid: randomUUID(),
            itemId: Number(id),
            on: 0,
            generalid: 0,
            cost: "",
            extraProperty: "",
            refineProperty: "",
            strengthLevel: 0,
            reforgeCount: 0,
        };
    };
}
