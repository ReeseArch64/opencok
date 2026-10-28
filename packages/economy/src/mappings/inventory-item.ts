import { sfs, type Fields } from "@opencok/messages/sfs";
import { validateFields } from "@opencok/messages/validations/fields";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { InventoryCatalogs } from "../contracts/inventory-catalogs.ts";
import { inventoryItemSchema } from "../validations/inventory.ts";

function serializeInventoryItem(
    row: Readonly<Record<string, unknown>>,
    rules: InventoryCatalogs,
): Fields
{
    const rule = rules.goods.get(String(row["itemId"] ?? "").trim());

    if (!rule)
    {
        throw new GameError(errors.unsupported);
    }

    const out: Fields = {
        uuid: sfs.string(String(row["uuid"] ?? "")),
        itemId: sfs.string(String(row["itemId"] ?? "")),
        count: sfs.int(Number(row["count"] ?? 0)),
        vanishTime: sfs.long(BigInt(String(row["vanishTime"] ?? 0))),
    };

    for (let i = 1; i < 10; i++)
    {
        if (rule[`para${i}`])
        {
            out[`para${i}`] = sfs.string(rule[`para${i}`]!);
        }
    }

    return out;
}

export function inventoryItem(...args: Parameters<typeof serializeInventoryItem>): Fields
{
    return validateFields(inventoryItemSchema, serializeInventoryItem(...args));
}
