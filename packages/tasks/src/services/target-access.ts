import type { TargetTaskCatalog, TargetTaskContext } from "../contracts/target-context";
import type { TargetTaskRuntime } from "../contracts/target-runtime";
import { targetFailure } from "../validations/target-failure";

export class TargetTaskAccess<
    TCatalog extends TargetTaskCatalog,
    TContext extends TargetTaskContext<TCatalog>,
>
{
    public constructor(private readonly runtime: TargetTaskRuntime<TCatalog, TContext>)
    {}

    public readonly open = (context: TContext) => {
        const { serverFeature } = this.runtime;

        return serverFeature(context.rules, "target_quest", {
            kingdomId: context.rules.kingdomId,
            version: "12.06.0",
            now: Number(context.now),
        });
    };

    public readonly saved = (context: TContext) => {
        const state = context.state.targetTask;

        if (!state)
        {
            targetFailure();
        }

        return {
            ...state,
            notes: context.write.targetTask?.notes ?? state.notes,
            tasks: context.write.targetTask?.tasks ?? state.tasks,
        };
    };
}
