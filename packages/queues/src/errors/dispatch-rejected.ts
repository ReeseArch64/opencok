import type { ActivityDispatchResult } from "../enums/dispatch-result";

export class ActivityDispatchRejected extends Error
{
    public constructor(public readonly result: ActivityDispatchResult)
    {
        super("Activity deadline precondition rejected");
    }
}
