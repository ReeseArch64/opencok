import type { ResponseValue } from "./value";

export interface RecallTaskRowResponse {
  reward: readonly ResponseValue[];
  num: number;
  target_num: number;
  state: boolean;
  taskid: string;
  receive: boolean;
}

export interface RecallTaskResponse {
  targetList: readonly RecallTaskRowResponse[];
  opentime?: bigint;
}

export interface RecallTaskClaimResponse {
  id: string;
  reward: readonly ResponseValue[];
  status?: string;
  receive_reward?: readonly ResponseValue[];
}
