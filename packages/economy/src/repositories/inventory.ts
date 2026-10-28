import { user_assets } from "@opencok/drizzle/schema/opencok_kingdom/user_assets";
import { and, asc, eq } from "drizzle-orm";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_item_cd } from "@opencok/drizzle/schema/opencok_kingdom/user_item_cd";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import type {
    InventoryExecutor,
    InventoryCommandState,
    InventoryPlan,
} from "../contracts/inventory-planning.ts";
import type { EconomyPosting, MutationResult } from "@opencok/ledger/contracts/mutation";
import { validatePosting } from "@opencok/ledger/posting";
import type {
    InventoryPreparation,
    InventoryTransaction,
    InventoryTransactionExecutor,
    InventoryTransactionRuntime,
} from "./inventory-transaction.ts";

export function createInventoryExecutor<State extends InventoryCommandState>(
    execute: InventoryTransactionExecutor,
    runtime: InventoryTransactionRuntime<State>,
    now = Date.now,
    preparation?: InventoryPreparation,
): InventoryExecutor<State>
{
    return (input, plan) => {
        const command = { ...input, request: Buffer.from(input.request) };

        return execute(command, async (tx) => {
            const at = BigInt(now());
            await preparation?.before?.(tx, command.owner, at);

            return executeInventoryTransaction(
                tx,
                runtime,
                command.owner,
                plan,
                command.command,
                preparation?.useEffect
                    ? (itemId, count, economy) =>
                        preparation.useEffect!(tx, command.owner, itemId, count, at, economy)
                    : undefined,
                preparation?.recordAction
                    ? (kind, itemId, count, economy) =>
                        preparation.recordAction!(
                            tx,
                            command.owner,
                            kind,
                            itemId,
                            count,
                            at,
                            economy,
                        )
                    : undefined,
            );
        });
    };
}

export async function executeInventoryTransaction<State extends InventoryCommandState>(
    tx: InventoryTransaction,
    runtime: InventoryTransactionRuntime<State>,
    owner: string,
    plan: Parameters<InventoryExecutor<State>>[1],
    reason: string,
    useEffect?: InventoryCommandState["useEffect"],
    recordAction?: InventoryCommandState["recordAction"],
    confirmed?: (
        plan: InventoryPlan,
    ) => Promise<MutationResult | undefined>,
)
{
    const [assets] = await tx.select().from(user_assets).where(eq(user_assets.uid, owner));
    const [profile] = await tx.select().from(userprofile).where(eq(userprofile.uid, owner));
    const [resource] = await tx
        .select()
        .from(user_resource)
        .where(eq(user_resource.uid, owner))
        .for("update");

    if (!profile || !resource)
    {
        throw new Error("Missing inventory account");
    }

    const items = await tx
        .select()
        .from(user_item)
        .where(eq(user_item.ownerId, owner))
        .orderBy(asc(user_item.uuid))
        .for("update");
    const cooldowns = await tx.select().from(user_item_cd).where(eq(user_item_cd.uid, owner));
    const buildings = await tx.select().from(user_building).where(eq(user_building.uid, owner));
    const result = await plan(runtime.extendState(tx, profile, {
        profile: Object.freeze({ ...profile }),
        assets: assets ?? {},
        resource: Object.freeze({ ...resource }),
        items: items.map((item) =>
            Object.freeze({ ...item, value: item.value ?? 0, vanishTime: item.vanishTime ?? 0n })
        ),
        cooldowns: new Map(cooldowns.map((row) => [row.itemId, row.useTime])),
        buildings,
        useEffect,
        recordAction,
    }));

    if (result.items.length > 128 || result.cooldowns.size > 128)
    {
        throw new Error("Inventory mutation too large");
    }

    const expected = new Map<string, EconomyPosting>();
    const posting = (asset: string, before: bigint, after: bigint) => {
        const entry = { account: owner, asset, before, after, reason: reason };
        validatePosting(entry);
        expected.set(asset, entry);
    };
    const seen = new Set<string>();

    for (const item of result.items)
    {
        if (
            seen.has(item.uuid)
            || !item.uuid
            || item.uuid.length > 40
            || !item.itemId
            || item.itemId.length > 255
            || !Number.isInteger(item.count)
            || item.count < 0
            || item.count > 2147483647
            || !Number.isInteger(item.value)
            || item.value < 0
            || item.value > 2147483647
            || item.vanishTime < 0n
            || item.vanishTime > 9223372036854775807n
        )
        {
            throw new Error("Invalid inventory item");
        }

        seen.add(item.uuid);
        const before = items.find((row) => row.uuid === item.uuid);

        if (before && (before.itemId !== item.itemId || (before.value ?? 0) !== item.value))
        {
            throw new Error("Inventory identity changed");
        }

        posting(`item.${item.uuid}`, BigInt(before?.count ?? 0), BigInt(item.count));

        if (before)
        {
            await tx
                .update(user_item)
                .set({ count: item.count, vanishTime: item.vanishTime })
                .where(and(eq(user_item.uuid, item.uuid), eq(user_item.ownerId, owner)));
        }
        else
        {
            await tx.insert(user_item).values({ ...item, ownerId: owner });
        }
    }

    const profileKeys = [
        "civilizationSorce",
        "gold",
        "paidGold",
        "paidSpecialGold",
        "dmmGold",
        "dmmPaidGold",
        "dmmPaidSpecialGold",
        "crystal",
    ];
    const resourceKeys = [
        "wood",
        "stone",
        "iron",
        "food",
        "sandstone",
        "diamondstone",
        "marble",
        "granite",
        "limestone",
        "woodbind",
        "stonebind",
        "ironbind",
        "foodbind",
        "silver",
        "chip",
        "diamond",
        "dragon_food",
        "dragon_gold",
    ];

    for (
        const [kind, changes, before, allowed] of [
            ["profile", result.profile, profile, profileKeys],
            ["resource", result.resource, resource, resourceKeys],
            ["assets", result.assets ?? {}, assets ?? {}, ["winPoint"]],
        ] as const
    )
    {
        for (const [key, value] of Object.entries(changes))
        {
            if (!(allowed as readonly string[]).includes(key) || typeof value !== "bigint")
            {
                throw new Error("Invalid inventory balance");
            }

            if (
                kind === "resource"
                && [
                    "silver",
                    "chip",
                    "diamond",
                    "dragon_food",
                    "dragon_gold",
                    "sandstone",
                    "diamondstone",
                    "marble",
                    "granite",
                    "limestone",
                ].includes(key)
                && value > 2147483647n
            )
            {
                throw new Error("Inventory resource overflow");
            }

            posting(
                `${kind}.${key}`,
                BigInt(((before as Record<string, unknown>)[key] as bigint) ?? 0n),
                value,
            );
        }
    }

    if (result.assets?.winPoint !== undefined)
    {
        await tx
            .insert(user_assets)
            .values({ uid: owner, winPoint: result.assets.winPoint })
            .onConflictDoUpdate({
                target: user_assets.uid,
                set: { winPoint: result.assets.winPoint },
            });
    }

    if (Object.keys(result.profile).length)
    {
        await tx.update(userprofile).set(result.profile).where(eq(userprofile.uid, owner));
    }

    if (Object.keys(result.resource).length)
    {
        await tx.update(user_resource).set(result.resource).where(eq(user_resource.uid, owner));
    }

    for (const [itemId, useTime] of result.cooldowns)
    {
        if (
            !itemId
            || itemId.length > 255
            || typeof useTime !== "bigint"
            || useTime < 0n
            || useTime > 9223372036854775807n
        )
        {
            throw new Error("Invalid item cooldown");
        }

        await tx
            .insert(user_item_cd)
            .values({ uid: owner, itemId, useTime })
            .onConflictDoUpdate({
                target: [user_item_cd.uid, user_item_cd.itemId],
                set: { useTime },
            });
    }

    if (result.postings.length > 256)
    {
        throw new Error("Inventory posting limit exceeded");
    }

    const current = new Map([...expected].map(([asset, entry]) => [asset, entry.before]));

    for (const entry of result.postings)
    {
        validatePosting(entry);

        if (entry.account !== owner || current.get(entry.asset) !== entry.before)
        {
            throw new Error("Inventory posting chain mismatch");
        }

        current.set(entry.asset, entry.after);
    }

    for (const [asset, entry] of expected)
    {
        if (current.get(asset) !== entry.after)
        {
            throw new Error("Inventory posting balance mismatch");
        }
    }

    const spending = result.confirmedSpending?.(result.postings);
    const base = {
            response: result.response,
            events: [...(result.events ?? []), ...(spending ? [spending] : [])],
            postings: result.postings,
        },
        observed = await confirmed?.(result);

    return observed ? runtime.mergeConfirmation(base, observed) : base;
}
