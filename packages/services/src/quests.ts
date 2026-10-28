import { CityCommandDomain } from "./city-command-domain.ts";
import { mergeSignInRewards } from "@opencok/rules/merge-campaign";
import { recordTargetTask } from "./target-task";
import { recordCampaignUse } from "./local-campaign";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { newEquipment } from "./equipment";
import { randomUUID } from "node:crypto";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import {
    progressQuests,
    questPeriod,
    castleLevel,
    rewardAtLevel,
    storySection,
} from "@opencok/rules/quests";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { questTasks } from "@opencok/mappings/quests";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

export function grantRewards(
    context: CityProgressionContext,
    id: string | undefined,
    signIn = false,
)
{
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
                const asset = (["wood", "stone", "iron", "food", "silver"] as const)[reward.type];

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
}

export function refreshQuests(
    context: CityProgressionContext,
    action?: Parameters<typeof progressQuests>[4],
)
{
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

    const merge = (original: readonly Row[], written: readonly Row[] | undefined, key: string) => [
        ...original.filter((row) =>
            !written?.some((next) => String(next[key]) === String(row[key]))
        ),
        ...(written ?? []),
    ];
    const write = context.write;
    const previous = write.quests;
    const state = {
        ...context.state,
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
}

const commands = [
    "quest.init",
    "quest.action",
    "task.reward.get",
    "quest.stage.rd",
    "story.task.info",
    "story.task.reward",
    "daily.task.info",
    "daily.task.reward",
    "daily.task.box.reward",
    "signIn.info",
    "signIn.reward",
    "fresh.signIn",
    "daily.quest.ls",
    "daily.quest.reward",
];

const unavailable = () => {
    throw new GameError(errors.locked, "city_progression");
};

async function prepare(context: CityProgressionContext, command: string, params: Fields)
{
    refreshQuests(context);
    const q = context.state.quests;

    if (!q)
    {
        throw new GameError(errors.unsupported, "city_progression");
    }

    const write = context.write.quests!,
        catalog = context.rules.progression;
    let body: Fields = {};
    const claim = (rows: readonly Row[], id: string) => {
        const row = rows.find((row) => String(row.id) === id);

        if (!row || num(row, "state") !== 1)
        {
            throw new GameError(
                row && num(row, "state") === 2 ? errors.rewardClaimed : errors.locked,
                "city_progression",
            );
        }

        row.state = 2;

        return row;
    };

    if (command === "quest.action")
    {
        const kind = str(params, "kind"),
            count = int(params, "count");

        if (
            !Number.isInteger(count)
            || count <= 0
            || count > 2147483647
            || !["use", "compose", "harvest", "alliance.join", "alliance.donate", "alliance.help"]
                .includes(
                    kind,
                )
        )
        {
            unavailable();
        }

        if (kind === "use")
        {
            recordCampaignUse(context, str(params, "itemId"), count);
        }

        if (kind.startsWith("alliance."))
        {
            refreshQuests(context, {
                main: kind === "alliance.join" ? 40 : kind === "alliance.donate" ? 42 : 41,
                daily: kind === "alliance.donate" ? 28 : kind === "alliance.help" ? 30 : undefined,
                legacy: kind === "alliance.donate" ? 4 : kind === "alliance.help" ? 5 : undefined,
                story: kind === "alliance.join" ? 8 : kind === "alliance.donate" ? 9 : undefined,
                count,
            });

            return { response: encode({}), event: null };
        }

        refreshQuests(context, {
            daily: kind === "use" ? 39 : kind === "compose" ? 37 : 25,
            legacy: kind === "use" ? 16 : kind === "compose" ? 15 : 1,
            main: kind === "compose" ? 46 : undefined,
            key: kind === "harvest" ? str(params, "itemId") : undefined,
            targetCondition: kind === "use"
                ? (context.rules.goods.get(str(params, "itemId"))?.para1 ?? "1")
                : kind === "harvest"
                ? String(
                    ({ wood: 0, stone: 1, iron: 2, food: 3, silver: 4 } as Record<string, number>)[
                        str(params, "itemId")
                    ] ?? "",
                )
                : undefined,
            count,
        });

        return { response: encode({}), event: null };
    }
    else if (command === "quest.init")
    {
        if (!context.state.queues.some((row) => num(row, "type") === 12))
        {
            context.write.queues = [
                {
                    uuid: randomUUID(),
                    ownerId: context.owner,
                    qid: 1,
                    type: 12,
                    itemId: "",
                    startTime: idleDeadline,
                    endTime: idleDeadline,
                    updateTime: idleDeadline,
                    totalTime: 0n,
                },
            ];
        }

        const section = storySection(write.story ?? [], context.rules);
        body = {
            storyTaskList: questTasks(
                (write.story ?? []).filter(
                    (row) => Number(catalog.story?.get(String(row.id))?.group) === section,
                ),
                "story",
            ),
            section: sfs.int(section),
            dailyTaskList: questTasks(write.daily ?? [], "daily"),
            newDailyTaskBoxRewardState: sfs.int(write.lord!.newDailyTaskBoxRewardState),
            signIn: sfs.int(
                long(q.signIn, "lastRewardTime") > 0n
                    && questPeriod(long(q.signIn, "lastRewardTime")) === questPeriod(context.now)
                    ? 1
                    : 0,
            ),
            newSignIn: sfs.object({
                day: sfs.int(num(q.fresh, "day")),
                signIn: sfs.bool(
                    long(q.fresh, "signInTime") > 0n
                        && questPeriod(long(q.fresh, "signInTime")) === questPeriod(context.now),
                ),
            }),
        };
    }
    else if (command === "fresh.signIn")
    {
        const day = num(q.fresh, "day") + 1;

        if (
            day > 7
            || (long(q.fresh, "signInTime") > 0n
                && questPeriod(long(q.fresh, "signInTime")) === questPeriod(context.now))
        )
        {
            unavailable();
        }

        const rule = [...(catalog.freshSignIn?.values() ?? [])].find(
            (rule) => Number(rule.day) === day,
        );
        body = {
            signIn: sfs.object({ day: sfs.int(day), signIn: sfs.bool(true) }),
            reward: grantRewards(context, rule?.reward),
        };
        write.fresh = { day, signInTime: context.now };
    }
    else if (command.startsWith("daily.quest"))
    {
        const score = (write.legacy ?? []).reduce(
            (sum, row) =>
                sum
                + num(row, "times") * Number(catalog.legacyDaily?.get(text(row, "id"))?.point ?? 0),
            0,
        );
        const claimed = (write.dailyClaims ?? "").split(",").filter(Boolean);

        if (command.endsWith("reward"))
        {
            const id = str(params, "id", "")
                || [...(catalog.legacyRewards?.values() ?? [])]
                    .filter((rule) => !claimed.includes(rule.id!))
                    .sort((a, b) => Number(a.point) - Number(b.point))[0]?.id;
            const rule = catalog.legacyRewards?.get(id ?? "");

            if (!rule || claimed.includes(rule.id!) || score < Number(rule.point))
            {
                unavailable();
            }

            const ids = (rule!.reward ?? "").split("|");
            body = {
                award: grantRewards(
                    context,
                    ids[Math.min(Math.max(0, castleLevel(context.state) - 1), ids.length - 1)],
                ),
                activityVal: sfs.int(score),
            };
            write.dailyClaims = [...claimed, rule!.id!].join(",");
        }
        else
        {
            body = {
                dailyQuest: sfs.array(
                    (write.legacy ?? []).map((row) =>
                        sfs.object({
                            id: sfs.string(text(row, "id")),
                            num: sfs.int(num(row, "num")),
                            times: sfs.int(num(row, "times")),
                        })
                    ),
                ),
                activityVal: sfs.int(score),
            };
        }
    }
    else if (command === "task.reward.get")
    {
        const id = str(params, "id"),
            rule = context.rules.reconnect.quests?.find((rule) => rule.id === id);

        if (
            !rule
            || (rule.pre
                && !write.tasks?.some((row) => row.id === rule.pre && num(row, "state") > 0))
        )
        {
            unavailable();
        }

        claim(write.tasks ?? [], id);
        body.reward = grantRewards(context, rule!.reward);
    }
    else if (command === "quest.stage.rd")
    {
        const id = String(num(q.mixed, "taskStage") || 2900001),
            rule = catalog.questPhases?.get(id);

        if (
            !rule
            || (write.tasks ?? []).filter((row) => num(row, "state") === 2).length
                < Number(rule.para1)
        )
        {
            unavailable();
        }

        write.taskStage = Number(id) + 1;
        body = {
            reward: grantRewards(context, rule!.reward),
            taskCompleteId: sfs.string(String(write.taskStage)),
            finished: sfs.bool(!catalog.questPhases?.has(String(write.taskStage))),
            nextRdInfo: rewardPreviewArray(
                previewRewards(
                    catalog.questPhases?.get(String(write.taskStage))?.reward,
                    context.rules,
                    {
                        kingdomId: context.rules.kingdomId,
                        version: "12.06.0",
                        now: Number(context.now),
                    },
                    randomInt,
                ),
            ),
        };
    }
    else if (command.startsWith("story.task"))
    {
        const section = storySection(write.story ?? [], context.rules);

        if (command.endsWith("reward"))
        {
            const id = String(int(params, "id")),
                rule = catalog.story?.get(id);

            if (Number(rule?.group) !== section)
            {
                unavailable();
            }

            claim(write.story ?? [], id);
            body.award = grantRewards(context, rule?.rewards);
        }
        else
        {
            body = {
                storyTaskList: questTasks(
                    (write.story ?? []).filter(
                        (row) => Number(catalog.story?.get(String(row.id))?.group) === section,
                    ),
                    "story",
                ),
                section: sfs.int(section),
            };
        }
    }
    else if (command.startsWith("daily.task"))
    {
        if (!text(q.alliance, "uid"))
        {
            unavailable();
        }

        if (command === "daily.task.reward")
        {
            const id = String(int(params, "id")),
                type = int(params, "type");

            if (![0, 1].includes(type))
            {
                unavailable();
            }

            claim(
                (write.daily ?? []).filter((row) => num(row, "type") === type),
                id,
            );
            const rule = catalog.daily?.get(id);
            body.award = grantRewards(
                context,
                rewardAtLevel(
                    type === 1 ? rule?.special_reward : rule?.normal_reward,
                    castleLevel(context.state),
                ),
            );
            write.allianceTasks = 1;
        }
        else if (command === "daily.task.box.reward")
        {
            const before = write.lord!.newDailyTaskBoxRewardState;
            const rule = [...(catalog.dailyRewards?.values() ?? [])]
                .filter((rule) => Number(rule.point) > before)
                .sort((a, b) => Number(a.point) - Number(b.point))[0];

            if (!rule || num(q.alliance, "taskNum") < Number(rule.point))
            {
                unavailable();
            }

            write.allianceBox = {
                threshold: Number(rule!.point),
                period: questPeriod(context.now),
            };
            write.lord!.newDailyTaskBoxRewardState = Number(rule!.point);
            body = {
                award: grantRewards(
                    context,
                    rewardAtLevel(rule!.reward, castleLevel(context.state)),
                ),
                newDailyTaskBoxRewardState: sfs.int(Number(rule!.point)),
            };
        }
        else
        {
            body = {
                dailyTaskList: questTasks(write.daily ?? [], "daily"),
                newDailyTaskBoxRewardState: sfs.int(write.lord!.newDailyTaskBoxRewardState),
            };
        }
    }
    else
    {
        const record = q.signIn,
            now = context.now,
            last = long(record, "lastRewardTime"),
            today = questPeriod(now),
            previous = questPeriod(last),
            same = last > 0n && previous === today;
        let day = num(record, "day");

        if (!same)
        {
            if (today - previous > 1n)
            {
                day = Math.floor(Math.min(day, 28) / 7) * 7;
            }

            if (day >= 28)
            {
                day = 0;
            }
        }

        let reward = text(record, "reward");

        if (!reward || (!same && (day % 7 === 0 || today - previous > 1n)))
        {
            const ranges = context.rules.items.get("sign_lv_range");
            let key = "Week1";

            for (let n = 1; n <= 8; n++)
            {
                const [lo, hi] = (ranges?.[`k${n}`] ?? "").split(";").map(Number);

                if (castleLevel(context.state) >= lo! && castleLevel(context.state) <= hi!)
                {
                    key = `Week${n}`;
                }
            }

            const stage = Math.floor(day / 7);
            reward = Array.from(
                { length: 7 },
                (_, index) => catalog.signIn?.get(String(46301 + stage * 7 + index))?.[key] ?? "",
            ).join(";");
        }

        write.signIn = { day, lastRewardTime: last, reward };
        const rewards = reward.split(";");

        if (command === "signIn.reward")
        {
            if (same)
            {
                throw new GameError(errors.rewardClaimed, "city_progression");
            }

            body = {
                reward: grantRewards(context, rewards[day % 7]?.split("|")[1], true),
                day: sfs.int((day % 7) + 1),
            };
            write.signIn = { day: day + 1, lastRewardTime: now, reward };
            recordTargetTask(context, 17, 1);
            const progressed = progressQuests(
                { ...context.state, quests: { ...q, daily: write.daily ?? [] } },
                context.rules,
                now,
                randomInt,
                { daily: 35, legacy: 17, count: 1 },
            );
            write.daily = progressed.daily;
            write.legacy = progressed.legacy;
        }
        else
        {
            body = {
                loginReward: sfs.array(
                    rewards.map((entry, index) => {
                        const [multiple, , id] = entry.split("|");

                        return sfs.object({
                            day: sfs.int(index + 1),
                            multiple: sfs.int(Number(multiple)),
                            reward: rewardPreviewArray(
                                previewRewards(
                                    id,
                                    context.rules,
                                    {
                                        kingdomId: context.rules.kingdomId,
                                        version: "12.06.0",
                                        now: Number(now),
                                    },
                                    randomInt,
                                ),
                            ),
                        });
                    }),
                ),
                currentDay: sfs.int(same && day % 7 === 0 ? 7 : day % 7),
                isValid: sfs.int(same ? 1 : 0),
                reward_multiple: { type: Type.Float, value: context.effect(310) },
            };
        }
    }

    return { response: encode(body), event: null };
}

export class QuestsDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"] = commands;

    public readonly types: CityDomain["types"] = [];

    public readonly prepare: CityDomain["prepare"] = prepare;

    public readonly apply: CityDomain["apply"] = async () => {
        throw new GameError(errors.invalid, "city_progression");
    };
}

export const questsDomain: CityDomain = new QuestsDomain();
