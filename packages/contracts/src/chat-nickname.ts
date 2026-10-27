import { isRecord } from "./chat.ts";

export const chatNicknamePath = "/_internal/nickname";

export interface ChatNicknameUpdate {
  owner: string;
  kingdomId: number;
  operationId: string;
}

export type ChatNicknameResult = "applied" | "unchanged";

export interface ChatNicknameStore {
  refresh(update: ChatNicknameUpdate): Promise<ChatNicknameResult>;
}

export type ChatNicknamePublisher = (
  update: ChatNicknameUpdate,
  signal: AbortSignal,
) => Promise<void>;

export function validChatNickname(value: unknown): value is ChatNicknameUpdate {
  return (
    isRecord(value) &&
    typeof value.owner === "string" &&
    value.owner.length > 0 &&
    value.owner.length <= 40 &&
    !value.owner.includes("\0") &&
    value.owner.isWellFormed() &&
    Number.isInteger(value.kingdomId) &&
    Number(value.kingdomId) > 0 &&
    Number(value.kingdomId) <= 2147483647 &&
    typeof value.operationId === "string" &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value.operationId)
  );
}

export function encodeChatNickname(update: ChatNicknameUpdate): string {
  if (!validChatNickname(update)) throw new Error("Invalid chat nickname operation");

  return JSON.stringify({
    owner: update.owner,
    kingdomId: update.kingdomId,
    operationId: update.operationId,
  });
}

export function decodeChatNickname(body: string): ChatNicknameUpdate {
  const value: unknown = JSON.parse(body);

  if (!validChatNickname(value) || Object.keys(value).length !== 3)
    throw new Error("Invalid chat nickname operation");

  return value;
}
