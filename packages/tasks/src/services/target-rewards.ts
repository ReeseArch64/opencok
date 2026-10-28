import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import type { TargetTaskCatalog, TargetTaskContext } from "../contracts/target-context";
import type { TargetTaskRuntime } from "../contracts/target-runtime";
import { TargetTaskAccess } from "./target-access";
import { targetFailure } from "../validations/target-failure";

export class TargetTaskRewards<
    TCatalog extends TargetTaskCatalog,
    TContext extends TargetTaskContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: TargetTaskRuntime<TCatalog, TContext>,
        private readonly access: TargetTaskAccess<TCatalog, TContext>,
    )
    {}

    public readonly repeatedReward = (context: TContext, id: string, times: number): string => {
        const { cityInteger, pinProgressionReward, mailRewardEntries } = this.runtime;

        cityInteger(times, 1, 1000);
        const rows = new Map<string, number>();

        for (let i = 0; i < times; i++)
        {
            for (const row of mailRewardEntries(pinProgressionReward(context, id)))
            {
                const key = `${row.category},${row.itemId}`;
                rows.set(key, cityInteger((rows.get(key) ?? 0) + row.count));
            }
        }

        return [...rows].map(([key, count]) => `${key},${count}`).join("|");
    };

    public readonly grant = (context: TContext, mode: number): Fields => {
        const { text, num, cityInteger, grantNativeProgressionReward } = this.runtime;

        const { saved } = this.access;

        const state = saved(context),
            notes = state.notes ? { ...state.notes } : undefined;

        if (!notes || num(notes, "receive_mode") !== 0)
        {
            targetFailure();
        }

        const completed = state.tasks.filter((row) => num(row, "state") > 0);

        if (!completed.length)
        {
            targetFailure();
        }

        const rewards: Value[] = completed.map((row) => {
            const rule = context.rules.advanced.targetTasks?.get(text(row, "id"));

            if (!rule)
            {
                targetFailure();
            }

            const reward = this.repeatedReward(
                context,
                rule.rewardall!,
                cityInteger(num(row, "rewardDouble") + 1, 1, 1000),
            );

            return sfs.object({
                id: sfs.string(text(row, "id")),
                reward: sfs.array(grantNativeProgressionReward(context, reward)),
            });
        });
        Object.assign(notes, { receive_mode: mode, refreshTime: context.now, isMail: 0 });
        context.write.targetTask = { ...context.write.targetTask, notes };

        return { rewardlist: sfs.array(rewards), receive_mode: sfs.bool(true) };
    };
}
