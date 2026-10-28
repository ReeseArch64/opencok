import { randomUUID, randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { QuestCatalog, QuestContext } from "../contracts/quest";
import type { QuestRecord as Row } from "../contracts/records";
import type { QuestRuntime } from "../contracts/runtime";
import type { QuestAction } from "../contracts/action";
import { QuestPolicy } from "../rules/progression";

export class QuestProgression<
    TCatalog extends QuestCatalog,
    TContext extends QuestContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: QuestRuntime<TCatalog, TContext>,
        private readonly policy: QuestPolicy<TCatalog>,
    )
    {}

    public readonly refreshQuests = (
        context: TContext,
        action?: QuestAction,
    ) => {
        const { text, num, recordTargetTask, javaMailBytes, previewRewards } = this.runtime;

        const { castleLevel, rewardAtLevel, progressQuests } = this.policy;

        if (action?.legacy)
        {
            recordTargetTask(
                context,
                action.legacy,
                action.count,
                action.targetCondition ?? action.key ?? "1",
            );
        }

        if (!context.state.quests)
        {
            return;
        }

        const merge = (
            original: readonly Row[],
            written: readonly Row[] | undefined,
            key: string,
        ) => [
            ...original.filter((row) =>
                !written?.some((next) => String(next[key]) === String(row[key]))
            ),
            ...(written ?? []),
        ];
        const write = context.write;
        const previous = write.quests;
        const state = {
            tasks: previous?.tasks ?? context.state.tasks,
            quests: {
                ...context.state.quests,
                lord: {
                    ...context.state.quests.lord,
                    ...previous?.lord,
                    ...(previous?.legacyPeriod === undefined
                        ? {}
                        : { dailyTaskFlushTime: previous.legacyPeriod }),
                },
                mixed: {
                    ...context.state.quests.mixed,
                    ...(previous?.dailyClaims === undefined
                        ? {}
                        : { dailyTaskId: previous.dailyClaims }),
                },
                story: previous?.story ?? context.state.quests.story,
                daily: previous?.daily ?? context.state.quests.daily,
                legacy: previous?.legacy ?? context.state.quests.legacy,
            },
            profile: { ...context.state.profile, ...write.profile },
            buildings: merge(context.state.buildings, write.buildings, "uuid").filter(
                (row) => !write.deletedBuildings?.includes(text(row, "uuid")),
            ),
            sciences: merge(context.state.sciences, write.sciences, "itemId"),
            armies: merge(context.state.armies, write.armies, "armyId"),
            equipment: merge(context.state.equipment, write.equipment, "uuid").filter(
                (row) => !write.deletedEquipment?.includes(text(row, "uuid")),
            ),
            statistics: { ...context.state.statistics, ...write.statistics },
        };
        write.quests = {
            ...progressQuests(state, context.rules, context.now, randomInt, action),
            mail: previous?.mail ?? [],
        };

        if (write.quests.resetDaily)
        {
            for (const row of state.quests.daily)
            {
                if (num(row, "state") === 1)
                {
                    const rule = context.rules.progression.daily?.get(String(row.id)),
                        id = rewardAtLevel(
                            num(row, "type") === 1 ? rule?.special_reward : rule?.normal_reward,
                            castleLevel(state),
                        );

                    if (!id || !context.rules.reconnect.rewards?.has(id))
                    {
                        throw new GameError(errors.invalid, "city_progression");
                    }

                    const rewards = previewRewards(
                        id,
                        context.rules,
                        {
                            kingdomId: context.rules.kingdomId,
                            version: "12.06.0",
                            now: Number(context.now),
                        },
                        randomInt,
                    );
                    const reward = rewards
                        .map((entry) => {
                            if (entry.kind === "item" && entry.type === 7)
                            {
                                return `goods,${entry.id},${entry.count}`;
                            }

                            if (entry.kind === "count")
                            {
                                const asset =
                                    ["wood", "stone", "iron", "food", "silver", "gold"][entry.type];

                                if (asset)
                                {
                                    return `${asset},0,${entry.value}`;
                                }
                            }

                            throw new GameError(errors.unsupported, "city_progression");
                        })
                        .join("|");
                    const template = context.rules.mail.get("12160");
                    const contents = javaMailBytes(template?.message);

                    if (!contents || !reward)
                    {
                        throw new GameError(errors.invalid, "city_progression");
                    }

                    write.quests.mail = [
                        ...(write.quests.mail ?? []),
                        {
                            uid: randomUUID().replaceAll("-", "") + "00",
                            owner: context.owner,
                            fromName: template?.sender ?? "",
                            title: template?.title ?? "",
                            type: 2,
                            contents,
                            extra: null,
                            rewardId: reward,
                            rewardStatus: 0,
                            reply: 0,
                            createTime: context.now,
                        },
                    ];
                }
            }
        }
    };
}
