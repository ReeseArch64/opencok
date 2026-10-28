import type { ActivityLedger } from "../contracts/activity-ledger";
import type { ActivityEconomy } from "../contracts/activity-economy";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { decode } from "@opencok/messages/sfs";

export function debit(ledger: ActivityLedger, amount: bigint, reason: string)
{
    if (amount < 0n || amount > ledger.total())
    {
        throw new GameError(errors.gold, "city_progression");
    }

    for (const key of ledger.pools())
    {
        const before = ledger.balance(key),
            cost = before < amount ? before : amount;

        if (cost)
        {
            ledger.profile[key] = before - cost;
            ledger.post(`profile.${key}`, before, before - cost, reason);
            amount -= cost;
        }
    }
}

export function activityEconomy(ledger: ActivityLedger): ActivityEconomy
{
    const valid = (amount: bigint) => {
        if (amount < 0n || amount > 9223372036854775807n)
        {
            throw new Error("Invalid activity balance");
        }

        return amount;
    };

    return {
        event(event)
        {
            ledger.domainEvents.push(event);
        },
        push(command, body)
        {
            ledger.pushes.push({ command, body: decode(Buffer.from(body)) });
        },
        hasPendingItemGrants()
        {
            return ledger.postings.slice(ledger.campaignPostingCursor).some((posting) =>
                posting.asset.startsWith("item.") && posting.after > posting.before
            );
        },
        takeItemGrants()
        {
            const grants = new Map<string, number>();

            for (const posting of ledger.postings.slice(ledger.campaignPostingCursor))
            {
                if (!posting.asset.startsWith("item.") || posting.after <= posting.before)
                {
                    continue;
                }

                const item = ledger.items.find((row) => `item.${row.uuid}` === posting.asset);

                if (!item)
                {
                    throw new Error("Missing campaign item grant");
                }

                grants.set(
                    item.itemId,
                    (grants.get(item.itemId) ?? 0) + Number(posting.after - posting.before),
                );
            }

            ledger.campaignPostingCursor = ledger.postings.length;

            return [...grants].map(([itemId, count]) => ({ itemId, count }));
        },
        balance(asset)
        {
            return asset === "civilizationSorce" || asset === "crystal"
                ? ledger.balance(asset)
                : asset === "gold"
                ? ledger.total()
                : (ledger.resources[asset] ?? ledger.resourceBalance(asset));
        },
        consumeItem(uuid, count)
        {
            ledger.take(ledger.own(uuid), count);
        },
        ownedItem(uuid)
        {
            const item = ledger.own(uuid);

            return { itemId: item.itemId, count: item.count };
        },
        itemState(itemId)
        {
            const row = ledger.items.find(
                (item) => item.itemId === itemId && item.value === 0 && ledger.valid(item),
            );

            return row ? { ...row } : undefined;
        },
        quantity(itemId)
        {
            return ledger.items
                .filter((item) => item.itemId === itemId && item.value === 0 && ledger.valid(item))
                .reduce((sum, item) => sum + item.count, 0);
        },
        crystal(delta)
        {
            const before = ledger.balance("crystal"),
                after = valid(before + delta);
            ledger.profile.crystal = after;
            ledger.post("profile.crystal", before, after, "activity.crystal");
        },
        civilizationScore(delta)
        {
            const before = ledger.balance("civilizationSorce"),
                after = valid(before + delta);
            ledger.profile.civilizationSorce = after;
            ledger.post("profile.civilizationSorce", before, after, "activity.civilization");
        },
        winPoints(delta)
        {
            const before = ledger.assets.winPoint ?? ledger.assetBalance("winPoint"),
                after = valid(before + delta);
            ledger.assets.winPoint = after;
            ledger.post("assets.winPoint", before, after, "activity.reward");
        },
        gold(delta)
        {
            if (delta < 0n)
            {
                debit(ledger, -delta, "activity.cost");
            }
            else if (delta > 0n)
            {
                const key = ledger.pools()[0]!,
                    before = ledger.balance(key),
                    after = valid(before + delta);
                ledger.profile[key] = after;
                ledger.post(`profile.${key}`, before, after, "activity.credit");
                ledger.total();
            }
        },
        resource(asset, delta)
        {
            if (
                ![
                    "wood",
                    "stone",
                    "iron",
                    "food",
                    "silver",
                    "woodbind",
                    "stonebind",
                    "ironbind",
                    "foodbind",
                    "chip",
                    "diamond",
                    "dragon_food",
                    "dragon_gold",
                    "sandstone",
                    "diamondstone",
                    "marble",
                    "granite",
                    "limestone",
                ].includes(asset)
            )
            {
                throw new Error("Invalid activity resource");
            }

            const before = ledger.resources[asset] ?? ledger.resourceBalance(asset),
                after = valid(before + delta);
            ledger.resources[asset] = after;
            ledger.post(`resource.${asset}`, before, after, "activity.resource");
        },
        item(itemId, delta)
        {
            if (!Number.isInteger(delta) || delta === 0)
            {
                throw new Error("Invalid activity item change");
            }

            if (delta < 0)
            {
                ledger.spendItems(itemId, -delta);
            }
            else
            {
                ledger.add(itemId, delta);
            }
        },
    };
}
