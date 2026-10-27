import type {
  ActivityAction,
  PreparedActivity,
  TimedActivity,
} from "@opencok/contracts/timed-activity";
import type { Fields } from "@opencok/messages/sfs";
import type { CityProgressionContext } from "./city-progression-context.ts";

export interface CityDomain {
  handles?(command: string): boolean;
  accelerate?(
    context: CityProgressionContext,
    activity: TimedActivity,
    remaining: bigint,
  ): Promise<void>;
  commands: readonly string[];
  types: readonly number[];
  prepare(
    context: CityProgressionContext,
    command: string,
    params: Fields,
  ): Promise<PreparedActivity>;
  next?(
    context: CityProgressionContext,
    activity: TimedActivity,
  ): Promise<PreparedActivity | undefined>;
  apply(
    context: CityProgressionContext,
    action: ActivityAction,
    activity: TimedActivity,
  ): Promise<Fields>;
}
