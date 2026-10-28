import type { EquipmentCatalog, EquipmentContext } from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";
import { sfs, str, int, type Fields } from "@opencok/messages/sfs";

import { EquipmentMapper } from "../mappings/equipment";
import { invalidEquipment as invalid } from "../validations/invalid";

import { EquipmentCommand } from "../enums/equipment-command";

export class EquipmentMaterials<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: EquipmentRuntime<TCatalog, TContext>,
        private readonly mapper: EquipmentMapper,
    )
    {}

    public readonly material = (context: TContext, command: string, params: Fields) => {
        const { cityInteger, refreshQuests } = this.runtime;

        const { equipmentItem } = this.mapper;

        const id = str(params, "material"),
            count = cityInteger(int(params, "number", 1), 1, 10000),
            rule = context.rules.goods.get(id),
            color = Number(id) % 10,
            create = command === EquipmentCommand.CreateMaterial;

        if (rule?.type !== "7" || color < 0 || color > 5 || (create ? color === 5 : color === 0))
        {
            invalid();
        }

        const target = String(Number(id) + (create ? 1 : -1));

        if (!context.rules.goods.has(target))
        {
            invalid();
        }

        const ratio = cityInteger(context.rules.items.get("equip")?.k6, 1);
        context.spendItem(id, cityInteger(create ? count * ratio : count));
        context.economy.item(target, cityInteger(create ? count : count * ratio));
        refreshQuests(context, { main: 46, daily: 37, legacy: 15, count });

        return {
            dec: sfs.object(
                equipmentItem(
                    id,
                    context.economy.quantity?.(id) ?? 0,
                    context.economy.itemState?.(id),
                    context.rules,
                ),
            ),
            add: sfs.object(
                equipmentItem(
                    target,
                    context.economy.quantity?.(target) ?? 0,
                    context.economy.itemState?.(target),
                    context.rules,
                ),
            ),
        };
    };
}
