import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import type { ConstructionCatalog, ConstructionContext } from "../contracts/construction";
import type { ConstructionRuntime } from "../contracts/construction-runtime";
import { ConstructionCommand } from "../enums/command";
import { ConstructionPolicy } from "../rules/construction";
import { ConstructionCompletion } from "./completion";
import { ConstructionCommands } from "./commands";
import { ConstructionActivity } from "./activity";

export class ConstructionDomain<
    TCatalog extends ConstructionCatalog,
    TContext extends ConstructionContext<TCatalog>,
> extends ActivityDomain<TContext>
{
    public readonly commands = [
        ConstructionCommand.Create,
        ConstructionCommand.Upgrade,
        ConstructionCommand.Destroy,
        ConstructionCommand.Move,
        ConstructionCommand.Unlock,
        ConstructionCommand.UnlockMiracle,
        ConstructionCommand.UnlockInfo,
        ConstructionCommand.UnlockGlory,
        ConstructionCommand.Reward,
    ];
    public readonly types = [0];
    public readonly prepare: ActivityDomain<TContext>["prepare"];
    public readonly apply: ActivityDomain<TContext>["apply"];

    public constructor(runtime: ConstructionRuntime<TCatalog, TContext>)
    {
        super();
        const completion = new ConstructionCompletion(runtime);
        this.prepare =
            new ConstructionCommands(runtime, completion, new ConstructionPolicy(runtime)).prepare;
        this.apply = new ConstructionActivity(runtime, completion).apply;
    }
}
