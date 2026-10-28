import type { TimedActivity } from "@opencok/contracts/timed-activity";
import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { TimedActivityStatus } from "@opencok/enums/timed-activity-status";

export const idleDeadline = 9223372036854775807n;

export function activityInstant(value: bigint)
{
    if (typeof value !== "bigint" || value < 0n || value >= idleDeadline)
    {
        throw new Error("Invalid activity instant");
    }

    return value;
}

export function activityState(dueAt: bigint, now: bigint): "idle" | "running" | "due"
{
    activityInstant(now);

    if (dueAt === idleDeadline)
    {
        return "idle";
    }

    activityInstant(dueAt);

    return dueAt <= now + 5000n ? "due" : "running";
}

export function transitionActivity(
    activity: TimedActivity,
    action: "finish" | "cancel" | "reschedule",
    now: bigint,
    expectedVersion: number,
    dueAt?: bigint,
): TimedActivity
{
    activityInstant(now);

    if (
        activity.status !== TimedActivityStatus.Active
        || activity.version !== expectedVersion
        || !Number.isSafeInteger(activity.version)
        || activity.version >= 2147483647
    )
    {
        throw new Error("Activity version conflict");
    }

    if (now < activity.startedAt)
    {
        throw new Error("Activity clock moved backwards");
    }

    const due = activityState(activity.dueAt, now) === "due";

    if (action === "cancel" && due)
    {
        throw new Error("Due activity cannot be cancelled");
    }

    if (action === "finish" && !due)
    {
        throw new Error("Activity is not due");
    }

    if (action === "reschedule")
    {
        if (dueAt === undefined || activityInstant(dueAt) > activity.dueAt || dueAt < now)
        {
            throw new Error("Invalid activity acceleration");
        }

        return { ...activity, dueAt, version: activity.version + 1 };
    }

    return {
        ...activity,
        version: activity.version + 1,
        status: action === TimedActivityAction.Finish
            ? TimedActivityStatus.Completed
            : TimedActivityStatus.Cancelled,
    };
}
