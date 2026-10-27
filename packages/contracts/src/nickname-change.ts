import type { AvatarSystemMail } from "./files.ts";
import type { Row } from "./rows.ts";
import type { ChatNicknamePublisher } from "./chat-nickname.ts";
import type { SharedUserProjector, SharedUserPublisher } from "./shared-user.ts";

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
  deliverAlliance(
    owner: string,
    operationId: string,
    now: number,
    plan: NicknameAlliancePlanner,
  ): Promise<boolean>;
  deliverThrone(owner: string, operationId: string, now: number): Promise<boolean>;
  nextPending(after?: {
    owner: string;
    operationId: string;
  }): Promise<{ owner: string; operationId: string } | undefined>;
  deliverSharedUser(
    owner: string,
    operationId: string,
    now: number,
    project: SharedUserProjector,
    publish: SharedUserPublisher,
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
  confirmedSpending?(
    profile: Row,
    buildings: readonly Row[],
    postings: readonly import("./mutation").EconomyPosting[],
    now: number,
  ): import("./mutation").MutationEvent | undefined;
  itemType(): unknown;
  price(): unknown;
  refundRatio(profile: Row): Promise<number>;
}

export interface NicknameAllianceTask {
  readonly id: string;
  readonly num: bigint | null;
  readonly state: number | null;
}

export interface NicknameAlliancePlan {
  readonly updates: readonly NicknameAllianceTask[];
  readonly complete: boolean;
}

export type NicknameAlliancePlanner = (
  tasks: readonly NicknameAllianceTask[],
  stem: string,
) => NicknameAlliancePlan & { readonly mail: AvatarSystemMail | null };
