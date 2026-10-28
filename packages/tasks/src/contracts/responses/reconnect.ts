import type { RewardPreviewResponse } from "@opencok/economy/contracts/responses/rewards";

export interface ReconnectTaskResponse
{
    readonly id: string;
    readonly num: number;
    readonly state: number;
    readonly type: number;
    readonly currPhase?: number;
    readonly maxPhase?: number;
    readonly reward?: RewardPreviewResponse[];
}

export interface ReconnectTasksResponse
{
    readonly task: ReconnectTaskResponse[];
    readonly ckfTask: ReconnectTaskResponse[];
    readonly taskCompleteNum: number;
}
