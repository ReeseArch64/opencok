import { inventoryEvent, mergeInventoryResponses } from "@opencok/economy/mappings/inventory";
import { readContinuedCostSpending, continuedCostSpending } from "@opencok/mappings/continued-cost";
import { cityAmount } from "@opencok/rules/city-progression";
import type { MutationResult, MutationEvent } from "@opencok/ledger/contracts/mutation";

export function mergeInventoryConfirmation(
    base: MutationResult,
    confirmed: MutationResult,
): MutationResult
{
    const postings = [...(base.postings ?? []), ...(confirmed.postings ?? [])],
        events = new Map<string, MutationEvent>();

    for (const event of [...(base.events ?? []), ...(confirmed.events ?? [])])
    {
        const previous = events.get(event.id);

        if (!previous)
        {
            events.set(event.id, event);
            continue;
        }

        if (event.type === "inventory.changed" && previous.type === event.type)
        {
            events.set(event.id, { ...event, payload: inventoryEvent(postings) });
            continue;
        }

        if (event.type === "continuedcost.spend" && previous.type === event.type)
        {
            const left = readContinuedCostSpending(previous.payload),
                right = readContinuedCostSpending(event.payload),
                signature = (value: typeof left) =>
                    JSON.stringify([
                        value.owner,
                        String(value.at),
                        String(value.start),
                        String(value.end),
                        value.type,
                        value.tiers.map((tier) => [tier.level, String(tier.point), tier.reward]),
                    ]);

            if (event.id !== "continued-cost" || signature(left) !== signature(right))
            {
                throw new Error("Conflicting chained consumption evidence");
            }

            events.set(event.id, {
                ...event,
                payload: continuedCostSpending({
                    ...left,
                    amount: cityAmount(left.amount + right.amount),
                    paid: cityAmount(left.paid + right.paid),
                    free: cityAmount(left.free + right.free),
                }),
            });
            continue;
        }

        throw new Error("Duplicate confirmed inventory event");
    }

    return {
        response: mergeInventoryResponses(base.response, confirmed.response),
        postings,
        events: [...events.values()],
    };
}
