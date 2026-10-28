import { inventoryItem } from "@opencok/economy/mappings/inventory-item";
import type { InventoryItem } from "@opencok/economy/contracts/inventory";
import type { EquipmentCatalog as Rules, EquipmentRecord as Row } from "../contracts/equipment";
import type { EquipmentProjectionRuntime } from "../contracts/runtime";
import { PublicEquipmentMapper } from "./public-equipment";
import { sfs, type Fields } from "@opencok/messages/sfs";

export class EquipmentMapper
{
    public constructor(
        private readonly runtime: Pick<EquipmentProjectionRuntime, "text" | "num">,
        private readonly publicMapper: PublicEquipmentMapper,
    )
    {}

    public readonly equipment = (row: Row): Fields => {
        const { text, num } = this.runtime;

        return {
            ...this.publicMapper.publicEquipment({
                ...row,
                lockProperty: text(row, "lockProperty") || null,
            }, true),
            ...(num(row, "generalid") > 0 ? { generalid: sfs.string(text(row, "generalid")) } : {}),
        };
    };

    public readonly equipmentItem = (
        id: string,
        count: number,
        item: InventoryItem | undefined,
        rules: Rules,
    ): Fields => {
        return item
            ? inventoryItem({ ...item }, rules)
            : { itemId: sfs.string(id), count: sfs.int(count) };
    };

    public readonly equipmentItems = (
        items: ReadonlyMap<string, number>,
        quantity: (id: string) => number,
        rules: Rules,
        itemState?: (id: string) => InventoryItem | undefined,
    ) => {
        return sfs.array(
            [...items].map(([id, count]) =>
                sfs.object({
                    ...this.equipmentItem(id, quantity(id), itemState?.(id), rules),
                    num: sfs.int(count),
                })
            ),
        );
    };
}
