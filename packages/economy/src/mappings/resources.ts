import { sfs, type Fields } from "@opencok/messages/sfs";
import { validateFields } from "@opencok/messages/validations/fields";
import type { InventorySnapshotRow } from "../contracts/inventory-ledger.ts";
import { resourceSchema } from "../validations/resources.ts";

function serializeResource(row: InventorySnapshotRow): Fields
{
    const result: Fields = {};

    for (const key of ["wood", "stone", "iron", "food"])
    {
        result[key] = sfs.long(
            BigInt(String(row[key] ?? 0)) < 0n ? 0n : BigInt(String(row[key] ?? 0)),
        );
        result[`${key}_bind`] = sfs.long(BigInt(String(row[`${key}bind`] ?? 0)));
    }

    for (
        const key of [
            "silver",
            "chip",
            "diamond",
            "sandstone",
            "diamondstone",
            "marble",
            "granite",
            "limestone",
        ]
    )
    {
        result[key] = sfs.int(Math.max(0, Number(row[key] ?? 0)));
    }

    result.dragonFood = sfs.int(Number(row["dragon_food"] ?? 0));
    result.dragonGold = sfs.int(Number(row["dragon_gold"] ?? 0));

    return result;
}

export function resource(...args: Parameters<typeof serializeResource>): Fields
{
    return validateFields(resourceSchema, serializeResource(...args));
}
