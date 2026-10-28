import { randomUUID } from "node:crypto";
import type { TargetTaskCatalog, TargetTaskContext } from "../contracts/target-context";
import type { TargetTaskRuntime } from "../contracts/target-runtime";
import { TargetTaskPolicy } from "../rules/target-task";
import { TargetTaskAccess } from "./target-access";
import { TargetTaskRewards } from "./target-rewards";
import { targetFailure } from "../validations/target-failure";

export class TargetTaskProgression<
    TCatalog extends TargetTaskCatalog,
    TContext extends TargetTaskContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: TargetTaskRuntime<TCatalog, TContext>,
        private readonly access: TargetTaskAccess<TCatalog, TContext>,
        private readonly rewards: TargetTaskRewards<TCatalog, TContext>,
        private readonly policy: TargetTaskPolicy<TCatalog>,
    )
    {}

    public readonly recover = (context: TContext, random: (maximum: number) => number) => {
        const { text, num, long, cityInteger, javaMailBytes } = this.runtime;

        const { saved } = this.access;

        const { repeatedReward } = this.rewards;

        const { targetSchedule, selectTargetTasks, targetQuantity } = this.policy;

        let state = saved(context),
            notes = state.notes ? { ...state.notes } : undefined;

        if (notes && context.now >= long(notes, "endTime") && num(notes, "receive_mode") === 0)
        {
            let sent = false;

            for (const row of state.tasks)
            {
                if (num(row, "state") <= 0)
                {
                    continue;
                }

                const rule = context.rules.advanced.targetTasks?.get(text(row, "id")),
                    template = context.rules.mail.get("11835"),
                    contents = javaMailBytes(template?.message);

                if (!rule || !template || !contents)
                {
                    targetFailure();
                }

                const reward = repeatedReward(
                    context,
                    rule.rewardall!,
                    cityInteger(num(row, "rewardDouble") + 1, 1, 1000),
                );
                const quests = (context.write.quests ??= {});
                quests.mail = [
                    ...(quests.mail ?? []),
                    {
                        uid: randomUUID().replaceAll("-", "") + "00",
                        owner: context.owner,
                        fromName: template.sender ?? "",
                        title: template.title ?? "",
                        type: 2,
                        contents,
                        extra: null,
                        rewardId: reward,
                        rewardStatus: 0,
                        reply: 0,
                        createTime: context.now,
                    },
                ];
                sent = true;
            }

            Object.assign(notes, {
                receive_mode: 3,
                refreshTime: context.now,
                isMail: sent ? 1 : 0,
            });
            context.write.targetTask = { ...context.write.targetTask, notes };
        }

        const config = context.rules.items.get("target_quest");

        if (!config)
        {
            targetFailure();
        }

        const window = targetSchedule(config, context.now, state.openedAt);

        if (
            window.active
            && (!notes || context.now < long(notes, "beginTime")
                || context.now >= long(notes, "endTime"))
        )
        {
            const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
            const selected = selectTargetTasks(
                context.rules,
                config,
                num(castle ?? {}, "level") + num(castle ?? {}, "star"),
                random,
            );
            notes = {
                uid: context.owner,
                version: "12.06.0",
                receive_mode: 0,
                refreshTime: 0n,
                beginTime: window.start,
                endTime: window.end,
                opendTime: context.now,
                isMail: 0,
            };
            const tasks = selected.map((rule, index) => ({
                uid: context.owner,
                id: rule.id!,
                num: 0,
                target_num: targetQuantity(rule, random),
                state: 0,
                type_level: index,
                rewardDouble: 0,
            }));
            context.write.targetTask = { notes, tasks, reset: true };
        }

        state = saved(context);

        return { ...state, config, window };
    };

    public readonly recordTargetTask = (
        context: TContext,
        type: number,
        amount: number | bigint,
        condition = "1",
        at = context.now,
    ): void => {
        const { text, num, long, cityInteger, recordRecallTask } = this.runtime;

        const { open, saved } = this.access;

        recordRecallTask(context, type, amount, condition, at);

        if (!context.state.targetTask || !open(context) || amount <= 0)
        {
            return;
        }

        const state = saved(context),
            notes = state.notes;

        if (
            !notes
            || num(notes, "receive_mode") > 0
            || at < long(notes, "beginTime")
            || at >= long(notes, "endTime")
            || long(notes, "beginTime") <= 0n
        )
        {
            return;
        }

        const day = cityInteger((at - long(notes, "beginTime")) / 86400000n),
            count = cityInteger(
                typeof amount === "bigint"
                    ? amount > 2147483647n
                        ? 2147483647n
                        : amount
                    : Math.min(amount, 2147483647),
                1,
            );
        let changed = false;
        const tasks = state.tasks.map((original) => {
            const row = { ...original },
                rule = context.rules.advanced.targetTasks?.get(text(row, "id"));

            if (
                !rule
                || num(row, "state") !== 0
                || num(row, "type_level") !== day
                || Number(rule.type) !== type
                || (type === 16
                    ? !rule.extend_type?.split(";").includes(condition)
                    : rule.extend_type !== condition)
            )
            {
                return row;
            }

            row.num = cityInteger(Math.min(2147483647, num(row, "num") + count));

            if (num(row, "num") >= num(row, "target_num"))
            {
                row.state = 1;
            }

            changed = true;

            return row;
        });

        if (changed)
        {
            context.write.targetTask = { ...context.write.targetTask, tasks };
        }
    };
}
