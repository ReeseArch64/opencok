import { and, eq, inArray } from "drizzle-orm";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { ability_page } from "@opencok/drizzle/schema/opencok_kingdom/ability_page";
import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import { text, num, long } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export async function readProgressionEffects(
    tx: MutationTransaction,
    owner: string,
    effects: import("@opencok/contracts/power").PlayerEffectSnapshot,
)
{
    const generals = await tx
        .select()
        .from(user_general)
        .where(eq(user_general.uid, owner))
        .limit(257);
    const states = await tx.select().from(user_state).where(eq(user_state.uid, owner)).limit(4097);
    const [vip] = await tx.select().from(user_vip).where(eq(user_vip.uid, owner));

    if (generals.length > 256 || states.length > 4096)
    {
        throw new Error("Oversized effect aggregate");
    }

    return { ...effects, generals, states, vip };
}

export async function readAbilityPages(tx: MutationTransaction, owner: string)
{
    const pages = await tx.select().from(ability_page).where(eq(ability_page.uid, owner)).limit(4);

    if (pages.length > 3)
    {
        throw new Error("Oversized talent pages");
    }

    return pages;
}

export async function writePlayerEffects(
    tx: MutationTransaction,
    owner: string,
    write: CityProgressionWrite,
)
{
    for (const row of write.generals ?? [])
    {
        if (
            row.uid !== owner
            || (row.ability !== null && !Buffer.isBuffer(row.ability))
            || (Buffer.isBuffer(row.ability) && row.ability.length > 65535)
            || ![1, 2, 3].includes(num(row, "abilityIndex"))
        )
        {
            throw new Error("Invalid talent write");
        }

        const updated = await tx
            .update(user_general)
            .set({ ability: row.ability as Buffer | null, abilityIndex: num(row, "abilityIndex") })
            .where(and(eq(user_general.uid, owner), eq(user_general.uuid, text(row, "uuid"))))
            .returning({ id: user_general.uuid });

        if (updated.length !== 1)
        {
            throw new Error("Foreign talent general");
        }
    }

    for (const row of write.abilityPages ?? [])
    {
        if (
            row.uid !== owner
            || ![1, 2, 3].includes(num(row, "page"))
            || !Buffer.isBuffer(row.ability)
            || row.ability.length > 65535
        )
        {
            throw new Error("Invalid talent page");
        }

        const value = { uid: owner, page: num(row, "page"), ability: row.ability };
        await tx
            .insert(ability_page)
            .values(value)
            .onConflictDoUpdate({ target: [ability_page.uid, ability_page.page], set: value });
    }

    if (write.vip)
    {
        const row = write.vip;

        if (row.uid !== owner)
        {
            throw new Error("Foreign VIP");
        }

        for (const key of ["score", "sPoint", "sLevel", "loginDays"])
        {
            if (!Number.isInteger(num(row, key)) || num(row, key) < 0 || num(row, key) > 2147483647)
            {
                throw new Error("Invalid VIP quantity");
            }
        }

        const value = {
            uid: owner,
            score: num(row, "score"),
            level: num(row, "level"),
            loginDays: num(row, "loginDays"),
            lastLoginTime: long(row, "lastLoginTime"),
            vipEndTime: long(row, "vipEndTime"),
            sPoint: num(row, "sPoint"),
            sLevel: num(row, "sLevel"),
            vip_switch: num(row, "vip_switch"),
            shop_level: num(row, "shop_level"),
            shop_exp: num(row, "shop_exp"),
        };
        await tx
            .insert(user_vip)
            .values(value)
            .onConflictDoUpdate({ target: user_vip.uid, set: value });
    }

    if (write.deletedStates?.length)
    {
        await tx
            .delete(user_state)
            .where(
                and(
                    eq(user_state.uid, owner),
                    inArray(user_state.stateId, [...write.deletedStates]),
                ),
            );
    }

    for (const row of write.states ?? [])
    {
        if (
            row.uid !== owner
            || long(row, "endTime") < long(row, "startTime")
            || long(row, "endTime") > 9223372036854775807n
        )
        {
            throw new Error("Invalid temporary effect");
        }

        const value = {
            uid: owner,
            stateId: num(row, "stateId"),
            startTime: long(row, "startTime"),
            endTime: long(row, "endTime"),
            type: num(row, "type"),
            type2: num(row, "type2"),
            groupType: num(row, "groupType"),
            ranEffId: num(row, "ranEffId"),
            ranEffValue: num(row, "ranEffValue"),
            count: num(row, "count"),
        };
        await tx
            .insert(user_state)
            .values(value)
            .onConflictDoUpdate({ target: [user_state.uid, user_state.stateId], set: value });
    }
}
