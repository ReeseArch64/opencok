import { and, eq, inArray } from "drizzle-orm";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { suit_decompose_effect } from "@opencok/drizzle/schema/opencok_kingdom/suit_decompose_effect";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { text, num, long } from "@opencok/contracts/rows";
import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import type { MutationTransaction } from "./mutation";

export async function readSuitDecompositions(tx: MutationTransaction, owner: string)
{
    return tx
        .select()
        .from(suit_decompose_effect)
        .where(eq(suit_decompose_effect.owner, owner))
        .limit(257);
}

export async function writeEquipment(
    tx: MutationTransaction,
    owner: string,
    write: CityProgressionWrite,
)
{
    for (const row of write.equipment ?? [])
    {
        if (
            row.uid !== owner
            || ![0, 1, 2].includes(num(row, "on"))
            || num(row, "strengthLevel") < 0
            || num(row, "strengthLevel") > 10
        )
        {
            throw new Error("Invalid equipment write");
        }

        const [before] = await tx
            .select()
            .from(user_equip)
            .where(eq(user_equip.uuid, text(row, "uuid")));

        if (before && before.uid !== owner)
        {
            throw new Error("Foreign equipment write");
        }

        const value = {
            uid: owner,
            uuid: text(row, "uuid"),
            itemId: num(row, "itemId"),
            on: num(row, "on"),
            generalid: num(row, "generalid"),
            cost: text(row, "cost"),
            extraProperty: text(row, "extraProperty"),
            refineProperty: text(row, "refineProperty"),
            lockProperty: text(row, "lockProperty") || null,
            crystalCharge: num(row, "crystalCharge"),
            darkCrystalCharge: num(row, "darkCrystalCharge"),
            chargeType: num(row, "chargeType"),
            showSign: num(row, "showSign") || 1,
            reforgeCount: num(row, "reforgeCount"),
            strengthLevel: num(row, "strengthLevel"),
        };
        await tx
            .insert(user_equip)
            .values(value)
            .onConflictDoUpdate({
                target: user_equip.uuid,
                set: value,
                setWhere: eq(user_equip.uid, owner),
            });
    }

    if (write.deletedEquipment?.length)
    {
        const removed = await tx
            .delete(user_equip)
            .where(
                and(
                    eq(user_equip.uid, owner),
                    inArray(user_equip.uuid, [...write.deletedEquipment]),
                ),
            )
            .returning({ id: user_equip.uuid });

        if (removed.length !== new Set(write.deletedEquipment).size)
        {
            throw new Error("Foreign equipment removal");
        }
    }

    for (const row of write.suitDecompositions ?? [])
    {
        if (row.owner !== owner)
        {
            throw new Error("Foreign suit decomposition");
        }

        const value = {
            owner,
            suitid: text(row, "suitid"),
            item1: text(row, "item1"),
            item2: text(row, "item2"),
            item3: text(row, "item3"),
            item4: text(row, "item4"),
            item5: text(row, "item5"),
            item6: text(row, "item6"),
        };
        await tx
            .insert(suit_decompose_effect)
            .values(value)
            .onConflictDoUpdate({
                target: [suit_decompose_effect.owner, suit_decompose_effect.suitid],
                set: value,
            });
    }

    if (write.equipmentSelection !== undefined)
    {
        await tx
            .update(userprofile)
            .set({ decomposesuiteffect: write.equipmentSelection })
            .where(eq(userprofile.uid, owner));
    }

    if (write.materialAcceleration)
    {
        await tx
            .insert(user_mixed_info)
            .values({ uid: owner, mdata: "", ...write.materialAcceleration })
            .onConflictDoUpdate({ target: user_mixed_info.uid, set: write.materialAcceleration });
    }

    if (write.materialBackup !== undefined)
    {
        await tx
            .insert(user_mixed_info)
            .values({ uid: owner, mdata: "", materialBackup: write.materialBackup })
            .onConflictDoUpdate({
                target: user_mixed_info.uid,
                set: { materialBackup: write.materialBackup },
            });
    }

    for (const row of write.queueUpdates ?? [])
    {
        if (row.ownerId !== owner || num(row, "type") !== 12 || text(row, "itemId").length > 255)
        {
            throw new Error("Invalid material queue update");
        }

        const result = await tx
            .update(queue)
            .set({
                itemId: text(row, "itemId"),
                para: num(row, "para"),
                updateTime: long(row, "updateTime"),
            })
            .where(
                and(
                    eq(queue.ownerId, owner),
                    eq(queue.uuid, text(row, "uuid")),
                    eq(queue.type, 12),
                ),
            )
            .returning({ id: queue.uuid });

        if (result.length !== 1)
        {
            throw new Error("Missing material queue");
        }
    }
}
