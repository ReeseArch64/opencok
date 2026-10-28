import type { ProductionAccount, ProductionRate } from "../contracts/production.ts";
import { idleDeadline, activityInstant } from "@opencok/rules/timed-activity";

export const productionScale = 1000000n;

const denominator = 3600000n * productionScale;

export function validateProductionRate(rate: ProductionRate)
{
    activityInstant(rate.at);

    if (
        rate.perHour < 0n
        || rate.perHour > idleDeadline
        || rate.capacity < 0n
        || rate.capacity > idleDeadline
    )
    {
        throw new Error("Invalid production rate");
    }
}

export function settleProduction(account: ProductionAccount, now: bigint): ProductionAccount
{
    activityInstant(now);
    activityInstant(account.settledAt);

    if (
        account.amount < 0n
        || account.amount > idleDeadline
        || account.remainder < 0n
        || account.remainder >= denominator
        || account.rates.length < 1
        || account.rates.length > 256
    )
    {
        throw new Error("Invalid production checkpoint");
    }

    let previous = -1n;

    for (const rate of account.rates)
    {
        validateProductionRate(rate);

        if (rate.at <= previous)
        {
            throw new Error("Unordered production rates");
        }

        previous = rate.at;
    }

    if (account.rates[0]!.at > account.settledAt)
    {
        throw new Error("Missing production rate history");
    }

    if (now <= account.settledAt)
    {
        return { ...account };
    }

    let amount = account.amount,
        remainder = account.remainder,
        cursor = account.settledAt;
    let index = 0;

    while (index + 1 < account.rates.length && account.rates[index + 1]!.at <= cursor)
    {
        index++;
    }

    while (cursor < now)
    {
        const rate = account.rates[index]!;
        const next = account.rates[index + 1]?.at;
        const end = next !== undefined && next < now ? next : now;
        const numerator = remainder + (end - cursor) * rate.perHour;
        const produced = numerator / denominator;
        const room = rate.capacity > amount ? rate.capacity - amount : 0n;

        if (produced >= room)
        {
            amount += room;
            remainder = 0n;
        }
        else
        {
            amount += produced;
            remainder = numerator % denominator;
        }

        cursor = end;

        if (next !== undefined && next <= end)
        {
            index++;
        }
    }

    const rates = account.rates.slice(Math.min(index, account.rates.length - 1));

    return { ...account, amount, remainder, settledAt: now, rates };
}

export function changeProductionRate(
    account: ProductionAccount,
    at: bigint,
    rates: readonly ProductionRate[],
): ProductionAccount
{
    if (at < account.settledAt || rates[0]?.at !== at)
    {
        throw new Error("Retroactive production change");
    }

    const settled = settleProduction(account, at);

    return settleProduction({ ...settled, rates }, at);
}
