import type { RecallTaskCatalog, RecallTaskContext } from "../contracts/recall-context";
import type { RecallTaskRuntime } from "../contracts/recall-runtime";
import { RecallTaskAccess } from "./recall-access";

export class RecallTaskProgression<
    TCatalog extends RecallTaskCatalog,
    TContext extends RecallTaskContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: RecallTaskRuntime<TCatalog, TContext>,
        private readonly access: RecallTaskAccess<TCatalog, TContext>,
    )
    {}

    public readonly recordRecallTask = (
        context: TContext,
        type: number,
        amount: number | bigint,
        condition = "1",
        at = context.now,
    ) => {
        const { text, num, long, cityInteger } = this.runtime;

        const { enabled, saved } = this.access;

        if (!context.state.recallTask?.notes || !enabled(context) || amount <= 0)
        {
            return;
        }

        const state = saved(context),
            notes = state.notes!;

        if (
            long(notes, "beginTime") <= 0n
            || at < long(notes, "beginTime")
            || at > long(notes, "endTime")
        )
        {
            return;
        }

        const count = cityInteger(
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
                rule = context.rules.advanced.recallTasks?.get(text(row, "id"));

            if (
                !rule
                || num(row, "state") > 0
                || Number(rule.type) !== type
                || (type === 16
                    ? !rule.extend_type?.split(";").includes(condition)
                    : rule.extend_type !== condition)
            )
            {
                return row;
            }

            row.num = Math.min(2147483647, num(row, "num") + count);

            if (num(row, "num") >= num(row, "target_num"))
            {
                row.state = 1;
            }

            changed = true;

            return row;
        });

        if (changed)
        {
            context.write.recallTask = { ...context.write.recallTask, tasks };
        }
    };
}
