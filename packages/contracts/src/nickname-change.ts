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
}

export interface NicknameChangeConfiguration {
  itemType(): unknown;
  price(): unknown;
  refundRatio(profile: Row): Promise<number>;
}
