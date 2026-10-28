import { CommandDomain } from "./command-domain";
import type { ActivityAction, PreparedActivity, TimedActivity } from "../contracts/activity";
import type { Fields } from "@opencok/messages/sfs";

export abstract class ActivityDomain<TContext> extends CommandDomain
{
    public abstract readonly types: readonly number[];
    public abstract readonly prepare: (
        context: TContext,
        command: string,
        params: Fields,
    ) => Promise<PreparedActivity>;
    public abstract readonly apply: (
        context: TContext,
        action: ActivityAction,
        activity: TimedActivity,
    ) => Promise<Fields>;
}
