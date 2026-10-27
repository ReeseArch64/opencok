import type { Row } from "./rows";
import type { AvatarSystemMail } from "./files";
export interface ComebackSession {
  sessionId: string;
  openedAt: bigint;
  previousOnlineAt: bigint;
  devicePreviousOnlineAt: bigint;
  observedAt: bigint;
  closedAt: bigint;
}
export interface ComebackState {
  records: readonly Row[];
  deviceRecord?: Row;
  session?: ComebackSession;
  viewedAt: bigint;
  totalCharge: number;
}
export interface ComebackWrite {
  record?: Row;
  viewedAt?: bigint;
  clearBackFlags?: boolean;
  mail?: AvatarSystemMail;
}
export type ComebackActivity =
  | {
      type: 1;
      endTime: bigint;
      claimed: boolean;
      rewards?: readonly import("./rewards").RewardPreview[];
    }
  | {
      type: 2;
      endTime: bigint;
      daily: readonly {
        day: number;
        state: number;
        rewards: readonly import("./rewards").RewardPreview[];
      }[];
    }
  | {
      type: 3;
      endTime: bigint;
      currentPay: bigint;
      payments: readonly {
        pay: string;
        state: number;
        rewards: readonly import("./rewards").RewardPreview[];
      }[];
    };
