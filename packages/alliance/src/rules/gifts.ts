import type { AllianceGiftRule } from "../contracts/gift-catalog";
import type { AllianceGiftRuleRuntime } from "../contracts/gift-runtime";

export class AllianceGiftPolicy
{
    public constructor(private readonly runtime: AllianceGiftRuleRuntime)
    {}

    public choices(rule: AllianceGiftRule)
    {
        const { cityInteger } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        const choices = new Map<string, number>(),
            quantities = new Map<string, number>();

        for (const [key, item] of Object.entries(rule))
        {
            const resource = /^rss(\d+)$/.exec(key),
                goods = /^item_(\d+)$/.exec(key);

            if (!resource && !goods)
            {
                continue;
            }

            const index = resource?.[1] ?? goods![1]!,
                suffix = resource ? index : "_" + index;
            const id = String(item),
                weight = cityInteger(rule["rate" + suffix], 0),
                quantity = cityInteger(rule["num" + suffix], 1);

            if (weight)
            {
                const identity = key + ":" + id;
                choices.set(identity, weight);
                quantities.set(identity, quantity);
            }
        }

        if (!choices.size)
        {
            allianceFailure();
        }

        return { choices, quantities };
    }
}
