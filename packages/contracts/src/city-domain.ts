import type {
    ActivityAction,
    PreparedActivity,
    TimedActivity,
} from "@opencok/contracts/timed-activity";
import type { Fields } from "@opencok/messages/sfs";

export interface CityDomain<TContext>
{
    handles?(command: string): boolean;
    accelerate?(
        context: TContext,
        activity: TimedActivity,
        remaining: bigint,
    ): Promise<void>;
    commands: readonly string[];
    types: readonly number[];
    prepare(
        context: TContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity>;
    next?(
        context: TContext,
        activity: TimedActivity,
    ): Promise<PreparedActivity | undefined>;
    apply(
        context: TContext,
        action: ActivityAction,
        activity: TimedActivity,
    ): Promise<Fields>;
}
