import type { Row } from "./rows.ts";
import type { ChatNicknamePublisher } from "./chat-nickname.ts";

export interface NicknameChangeRecord {
  operationId: string;
  ownerUid: string;
  newName: string;
  previousName: string;
  state: string;
  payment: string;
  responseGold: bigint | null;
  failureCode: string | null;
  pendingEffects: number;
  notificationStage: number;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface NicknameChangeStore {
  change(
    owner: string,
    operationId: string,
    name: string,
    now: number,
  ): Promise<NicknameChangeRecord>;
  recover(owner: string, operationId: string, now: number): Promise<NicknameChangeRecord>;
  find(owner: string, operationId: string): Promise<NicknameChangeRecord | undefined>;
  deliverChat(
    owner: string,
    operationId: string,
    publish: ChatNicknamePublisher,
    timeoutMs: number,
  ): Promise<boolean>;
  deliverNotifications(
    owner: string,
    operationId: string,
    publish: NicknameNotificationPublisher,
    timeoutMs: number,
  ): Promise<boolean>;
}

export type NicknameNotification =
  | {
      kind: "item";
      stage: "debit" | "refund";
      item: { uuid: string; count: number; vanishTime: bigint };
    }
  | {
      kind: "gold";
      stage: "debit" | "refund";
      platform: string | null;
      balances: {
        gold: bigint;
        paidGold: bigint;
        paidSpecialGold: bigint;
        dmmGold: bigint;
        dmmPaidGold: bigint;
        dmmPaidSpecialGold: bigint;
      };
    };
export type NicknameNotificationPublisher = (
  owner: string,
  snapshot: NicknameNotification,
  signal: AbortSignal,
) => Promise<boolean>;
export interface NicknameNotificationDelivery {
  publish: NicknameNotificationPublisher;
  timeoutMs: number;
  report(): void;
}

export interface NicknameChangeConfiguration {
  itemType(): unknown;
  price(): unknown;
  refundRatio(profile: Row): Promise<number>;
}
