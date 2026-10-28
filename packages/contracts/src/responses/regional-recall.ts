import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface RegionalRecallResponse
{
    id: string;
    reward: readonly ResponseValue[];
    receive_num?: number;
    RegRec_lastReceiveTime?: bigint;
}

export interface RegionalRecallLoginResponse
{
    RegRec_endTime: bigint;
    RegRec_lastReceiveTime?: bigint;
}
