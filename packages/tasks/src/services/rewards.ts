import { randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { QuestCatalog, QuestContext } from "../contracts/quest";
import type { QuestRuntime } from "../contracts/runtime";

export class QuestRewards<TCatalog extends QuestCatalog, TContext extends QuestContext<TCatalog>>
{
    public constructor(private readonly runtime: QuestRuntime<TCatalog, TContext>)
    {}

    public readonly grantRewards = (
        context: TContext,
        id: string | undefined,
        signIn = false,
    ) => {
        const { newEquipment, previewRewards, rewardPreviewArray, mergeSignInRewards } =
            this.runtime;

        if (!id || !context.rules.reconnect.rewards?.has(id))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const preview = previewRewards(
            id,
            context.rules,
            { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
            randomInt,
        );
        const rewards = signIn ? mergeSignInRewards(preview, context.effect(310)) : preview;

        for (const reward of rewards)
        {
            if (reward.kind === "item" && reward.type === 14)
            {
                const rows = [...(context.write.equipment ?? [])];

                for (let n = 0; n < reward.count; n++)
                {
                    context.write.equipment = rows;
                    rows.push(newEquipment(context, reward.id));
                }

                context.write.equipment = rows;
            }
            else if (reward.kind === "item" && reward.type === 7)
            {
                context.economy.item(reward.id, reward.count);
            }
            else if (reward.kind === "count")
            {
                if (reward.type === 18)
                {
                    if (!context.economy.winPoints)
                    {
                        throw new GameError(errors.unsupported, "city_progression");
                    }

                    context.economy.winPoints(BigInt(reward.value));
                }
                else if (reward.type === 6)
                {
                    context.experience(reward.value);
                }
                else if (reward.type === 5)
                {
                    context.economy.gold(BigInt(reward.value));
                }
                else
                {
                    const asset =
                        (["wood", "stone", "iron", "food", "silver"] as const)[reward.type];

                    if (!asset)
                    {
                        throw new GameError(errors.unsupported, "city_progression");
                    }

                    context.economy.resource(asset, BigInt(reward.value));
                }
            }
            else
            {
                throw new GameError(errors.unsupported, "city_progression");
            }
        }

        return rewardPreviewArray(rewards);
    };
}
