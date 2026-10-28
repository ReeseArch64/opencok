import type { RecallTaskCatalog, RecallTaskContext } from "../contracts/recall-context";
import type { RecallTaskRuntime } from "../contracts/recall-runtime";

export class RecallTaskAccess<
    TCatalog extends RecallTaskCatalog,
    TContext extends RecallTaskContext<TCatalog>,
>
{
    public constructor(private readonly runtime: RecallTaskRuntime<TCatalog, TContext>)
    {}

    public readonly enabled = (context: TContext) => {
        const { serverFeature } = this.runtime;

        return serverFeature(context.rules, "recall_quest", {
            kingdomId: context.rules.kingdomId,
            version: "12.06.0",
            now: Number(context.now),
        });
    };

    public readonly saved = (context: TContext) => {
        const regionalRecallFailure: () => never = this.runtime.regionalRecallFailure;

        if (!context.state.recallTask)
        {
            regionalRecallFailure();
        }

        return {
            ...context.state.recallTask,
            notes: context.write.recallTask?.notes ?? context.state.recallTask.notes,
            tasks: context.write.recallTask?.tasks ?? context.state.recallTask.tasks,
        };
    };
}
