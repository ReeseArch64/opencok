import type { AvatarProfileUpdate } from "./files.ts";
import { isRecord } from "./chat.ts";

export const chatAvatarProfilePath = "/_internal/avatar-profile";
export type ChatAvatarProfileResult = "applied" | "unchanged" | "superseded";
export interface ChatAvatarProfileStore {
  publish(update: AvatarProfileUpdate): Promise<ChatAvatarProfileResult>;
  find(owner: string, kingdomId: number): Promise<AvatarProfileUpdate | null>;
}
export function validAvatarProfile(value: unknown): value is AvatarProfileUpdate {
  if (!isRecord(value)) return false;
  return (
    typeof value.owner === "string" &&
    /^[0-9]{1,20}$/.test(value.owner) &&
    Number.isInteger(value.kingdomId) &&
    Number(value.kingdomId) > 0 &&
    Number(value.kingdomId) <= 2147483647 &&
    Number.isInteger(value.sequence) &&
    Number(value.sequence) >= 0 &&
    (Number(value.sequence) > 0 || (typeof value.revision === "bigint" && value.revision > 0n)) &&
    (value.revision === undefined ||
      (typeof value.revision === "bigint" &&
        value.revision > 0n &&
        value.revision <= 9223372036854775807n)) &&
    Number(value.sequence) <= 999999 &&
    Number.isInteger(value.picVer) &&
    Number(value.picVer) >= 0 &&
    Number(value.picVer) <= 2147483647 &&
    Number(value.picVer) % 1000000 === value.sequence &&
    typeof value.committedAt === "bigint" &&
    value.committedAt >= 0n &&
    value.committedAt <= BigInt(Number.MAX_SAFE_INTEGER) &&
    value.updatedAt === String(value.committedAt / 1000n) &&
    [value.userName, value.platform].every(
      (value) =>
        typeof value === "string" &&
        value.length <= 255 &&
        !value.includes("\0") &&
        value.isWellFormed(),
    )
  );
}
export function encodeAvatarProfile(update: AvatarProfileUpdate): string {
  if (!validAvatarProfile(update)) throw new Error("Invalid chat avatar profile");
  return JSON.stringify({
    owner: update.owner,
    kingdomId: update.kingdomId,
    sequence: update.sequence,
    picVer: update.picVer,
    committedAt: String(update.committedAt),
    updatedAt: update.updatedAt,
    userName: update.userName,
    platform: update.platform,
    ...(update.revision === undefined ? {} : { revision: String(update.revision) }),
  });
}
export function decodeAvatarProfile(body: string): AvatarProfileUpdate {
  const value: unknown = JSON.parse(body);
  const keys = [
    "owner",
    "kingdomId",
    "sequence",
    "picVer",
    "committedAt",
    "updatedAt",
    "userName",
    "platform",
  ];
  if (
    !isRecord(value) ||
    Object.keys(value).length !== keys.length + (Object.hasOwn(value, "revision") ? 1 : 0) ||
    keys.some((key) => !Object.hasOwn(value, key)) ||
    typeof value.committedAt !== "string" ||
    !/^(0|[1-9][0-9]{0,15})$/.test(value.committedAt)
  )
    throw new Error("Invalid chat avatar profile");
  if (
    value.revision !== undefined &&
    (typeof value.revision !== "string" || !/^[1-9][0-9]{0,18}$/.test(value.revision))
  )
    throw new Error("Invalid chat avatar revision");
  const update = {
    ...value,
    committedAt: BigInt(value.committedAt),
    ...(typeof value.revision === "string" ? { revision: BigInt(value.revision) } : {}),
  };
  if (!validAvatarProfile(update)) throw new Error("Invalid chat avatar profile");
  return update;
}
