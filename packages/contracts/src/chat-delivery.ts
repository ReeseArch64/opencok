import type { ChatMessage, Frame } from "./chat.ts";
export interface ChatArchiveMessage extends ChatMessage {
  version: number;
  hash: string;
  archiveAt: number;
  expiresAt: number;
}
export interface ChatArchiveStore {
  put(message: ChatArchiveMessage): Promise<void>;
  getMany?(ids: number[]): Promise<ChatArchiveMessage[]>;
  get(sequenceId: number): Promise<ChatArchiveMessage | null>;
  remove(sequenceId: number): Promise<void>;
  purge(now: number): Promise<void>;
  close(): Promise<void>;
}
export interface ChatHistoryQuery {
  roomId: string;
  before: number;
  limit: number;
  archive: boolean;
}
export interface ChatHistoryPage {
  messages: ChatMessage[];
  cursor: number | null;
}
export interface ChatDeliveryEvent {
  sequence: string;
  id: string;
  roomId: string;
  owner: string;
  target: string | null;
  message: ChatMessage | null;
  frame: Frame | null;
}
export interface ChatDeliveryStore {
  acquire(instance: string, token: string): Promise<void>;
  poll(
    instance: string,
    token: string,
    limit?: number,
  ): Promise<{ events: ChatDeliveryEvent[]; resync: boolean }>;
  acknowledge(instance: string, token: string, sequence: string): Promise<void>;
  release(instance: string, token: string): Promise<void>;
}
export interface ChatAccessStore {
  filter?(uid: string, messages: ChatMessage[]): Promise<ChatMessage[]>;
  canSend(uid: string, notice?: boolean): Promise<boolean>;
  canReceive(uid: string, sender: string): Promise<boolean>;
  canRead(uid: string, message: ChatMessage): Promise<boolean>;
  privateRoom(uid: string, roomId: string): Promise<boolean>;
}
export interface ChatNoticeCost {
  createdAt: number;
  postings: { asset: string; before: bigint; after: bigint }[];
}
export type ChatNoticeCostReader = (owner: string, requestId: string) => Promise<ChatNoticeCost>;
