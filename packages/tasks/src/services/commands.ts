import { randomUUID, randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import type { QuestCatalog, QuestContext } from "../contracts/quest";
import type { QuestRecord as Row } from "../contracts/records";
import type { QuestRuntime } from "../contracts/runtime";
import { QuestPolicy } from "../rules/progression";
import { QuestMapper } from "../mappings/quests";
import { questPeriod } from "../rules/period";
import { QuestCommand } from "../enums/command";
import { QuestKind } from "../enums/kind";
import { questUnavailable as unavailable } from "../validations/unavailable";
import { QuestRewards } from "./rewards";
import { QuestProgression } from "./progression";

export class QuestCommands<TCatalog extends QuestCatalog, TContext extends QuestContext<TCatalog>>
{
    public constructor(
        private readonly runtime: QuestRuntime<TCatalog, TContext>,
        private readonly policy: QuestPolicy<TCatalog>,
        private readonly mapper: QuestMapper,
        private readonly rewards: QuestRewards<TCatalog, TContext>,
        private readonly progression: QuestProgression<TCatalog, TContext>,
    )
    {}

    public readonly prepare = async (context: TContext, command: string, params: Fields) => {
        const {
            text,
            num,
            long,
            recordTargetTask,
            recordCampaignUse,
            previewRewards,
            rewardPreviewArray,
            idleDeadline,
        } = this.runtime;

        const { castleLevel, progressQuests, storySection, rewardAtLevel } = this.policy;

        const { questTasks } = this.mapper;

        this.progression.refreshQuests(context);
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

        if (command === QuestCommand.Action)
        {
            const kind = str(params, "kind"),
                count = int(params, "count");

            if (
                !Number.isInteger(count)
                || count <= 0
                || count > 2147483647
                || ![
                    "use",
                    "compose",
                    "harvest",
                    "alliance.join",
                    "alliance.donate",
                    "alliance.help",
                ]
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
                this.progression.refreshQuests(context, {
                    main: kind === "alliance.join" ? 40 : kind === "alliance.donate" ? 42 : 41,
                    daily: kind === "alliance.donate"
                        ? 28
                        : kind === "alliance.help"
                        ? 30
                        : undefined,
                    legacy: kind === "alliance.donate"
                        ? 4
                        : kind === "alliance.help"
                        ? 5
                        : undefined,
                    story: kind === "alliance.join"
                        ? 8
                        : kind === "alliance.donate"
                        ? 9
                        : undefined,
                    count,
                });

                return { response: encode({}), event: null };
            }

            this.progression.refreshQuests(context, {
                daily: kind === "use" ? 39 : kind === "compose" ? 37 : 25,
                legacy: kind === "use" ? 16 : kind === "compose" ? 15 : 1,
                main: kind === "compose" ? 46 : undefined,
                key: kind === "harvest" ? str(params, "itemId") : undefined,
                targetCondition: kind === "use"
                    ? (context.rules.goods.get(str(params, "itemId"))?.para1 ?? "1")
                    : kind === "harvest"
                    ? String(
                        ({ wood: 0, stone: 1, iron: 2, food: 3, silver: 4 } as Record<
                            string,
                            number
                        >)[
                            str(params, "itemId")
                        ] ?? "",
                    )
                    : undefined,
                count,
            });

            return { response: encode({}), event: null };
        }
        else if (command === QuestCommand.Initialize)
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
                    QuestKind.Story,
                ),
                section: sfs.int(section),
                dailyTaskList: questTasks(write.daily ?? [], QuestKind.Daily),
                newDailyTaskBoxRewardState: sfs.int(write.lord!.newDailyTaskBoxRewardState),
                signIn: sfs.int(
                    long(q.signIn, "lastRewardTime") > 0n
                        && questPeriod(long(q.signIn, "lastRewardTime"))
                            === questPeriod(context.now)
                        ? 1
                        : 0,
                ),
                newSignIn: sfs.object({
                    day: sfs.int(num(q.fresh, "day")),
                    signIn: sfs.bool(
                        long(q.fresh, "signInTime") > 0n
                            && questPeriod(long(q.fresh, "signInTime"))
                                === questPeriod(context.now),
                    ),
                }),
            };
        }
        else if (command === QuestCommand.FreshSignIn)
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
                reward: this.rewards.grantRewards(context, rule?.reward),
            };
            write.fresh = { day, signInTime: context.now };
        }
        else if (command.startsWith("daily.quest"))
        {
            const score = (write.legacy ?? []).reduce(
                (sum, row) =>
                    sum
                    + num(row, "times")
                        * Number(catalog.legacyDaily?.get(text(row, "id"))?.point ?? 0),
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
                    award: this.rewards.grantRewards(
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
        else if (command === QuestCommand.ClaimTask)
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
            body.reward = this.rewards.grantRewards(context, rule!.reward);
        }
        else if (command === QuestCommand.ClaimStage)
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
                reward: this.rewards.grantRewards(context, rule!.reward),
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
                body.award = this.rewards.grantRewards(context, rule?.rewards);
            }
            else
            {
                body = {
                    storyTaskList: questTasks(
                        (write.story ?? []).filter(
                            (row) => Number(catalog.story?.get(String(row.id))?.group) === section,
                        ),
                        QuestKind.Story,
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

            if (command === QuestCommand.DailyReward)
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
                body.award = this.rewards.grantRewards(
                    context,
                    rewardAtLevel(
                        type === 1 ? rule?.special_reward : rule?.normal_reward,
                        castleLevel(context.state),
                    ),
                );
                write.allianceTasks = 1;
            }
            else if (command === QuestCommand.DailyBoxReward)
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
                    award: this.rewards.grantRewards(
                        context,
                        rewardAtLevel(rule!.reward, castleLevel(context.state)),
                    ),
                    newDailyTaskBoxRewardState: sfs.int(Number(rule!.point)),
                };
            }
            else
            {
                body = {
                    dailyTaskList: questTasks(write.daily ?? [], QuestKind.Daily),
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
                    (_, index) =>
                        catalog.signIn?.get(String(46301 + stage * 7 + index))?.[key] ?? "",
                ).join(";");
            }

            write.signIn = { day, lastRewardTime: last, reward };
            const rewards = reward.split(";");

            if (command === QuestCommand.SignInReward)
            {
                if (same)
                {
                    throw new GameError(errors.rewardClaimed, "city_progression");
                }

                body = {
                    reward: this.rewards.grantRewards(
                        context,
                        rewards[day % 7]?.split("|")[1],
                        true,
                    ),
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
    };
}
