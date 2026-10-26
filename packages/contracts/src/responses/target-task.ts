import type { ResponseValue } from "./value";
export interface TargetTaskRowResponse {
  reward: readonly ResponseValue[];
  num: number;
  target_num: number;
  state: boolean;
  day_type: number;
  taskid: string;
  rewardDouble: number;
}
export interface TargetTaskResponse {
  targetList: readonly TargetTaskRowResponse[];
  exchangeid: string;
  day_sum: number;
  day_now?: number;
  receive_mode: boolean;
}
