import type { AvatarCompletionRecord, AvatarProfileUpdate } from "@opencok/contracts/files";

function invalid(): never {
  throw new Error("Invalid avatar profile intent");
}

function projectAvatarProfile(
  bit: 2 | 4,
  entry: AvatarCompletionRecord,
  kingdomId: number,
): AvatarProfileUpdate {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    typeof entry.ownerUid !== "string" ||
    !/^[0-9]{1,20}$/.test(entry.ownerUid) ||
    !Number.isInteger(entry.sequence) ||
    entry.sequence < 1 ||
    entry.sequence > 999999 ||
    (entry.revision !== undefined &&
      (typeof entry.revision !== "bigint" ||
        entry.revision < 0n ||
        entry.revision > 9223372036854775807n)) ||
    !Number.isInteger(entry.picVer) ||
    entry.picVer < 0 ||
    entry.picVer > 2147483647 ||
    entry.picVer % 1000000 !== entry.sequence ||
    typeof entry.hash !== "string" ||
    !/^[a-f0-9]{64}$/.test(entry.hash) ||
    typeof entry.committedAt !== "bigint" ||
    entry.committedAt < 0n ||
    entry.committedAt > BigInt(Number.MAX_SAFE_INTEGER) ||
    !Number.isInteger(entry.pendingEffects) ||
    entry.pendingEffects < 0 ||
    entry.pendingEffects > 7 ||
    !(entry.pendingEffects & bit) ||
    typeof entry.effects !== "string" ||
    new TextEncoder().encode(entry.effects).length > 65535
  )
    {return invalid();}

  let snapshot;

  try {
    snapshot = JSON.parse(entry.effects);
  } catch {
    return invalid();
  }

  const profile = snapshot?.profile;
  const updatedAt = String(entry.committedAt / 1000n);

  if (
    snapshot?.version !== 1 ||
    !profile ||
    typeof profile !== "object" ||
    Array.isArray(profile) ||
    profile.updatedAt !== updatedAt ||
    [profile.userName, profile.platform].some(
      (value) =>
        typeof value !== "string" ||
        value.length > 255 ||
        value.includes("\0") ||
        !value.isWellFormed(),
    )
  )
    {return invalid();}

  return {
    owner: entry.ownerUid,
    kingdomId,
    sequence: entry.sequence,
    picVer: entry.picVer,
    committedAt: entry.committedAt,
    updatedAt,
    userName: profile.userName,
    platform: profile.platform,
    ...(entry.revision ? { revision: entry.revision } : {}),
  };
}

export function avatarProfileUpdate(
  entry: AvatarCompletionRecord,
  kingdomId: number,
): AvatarProfileUpdate {
  return projectAvatarProfile(2, entry, kingdomId);
}

export function avatarChatUpdate(
  entry: AvatarCompletionRecord,
  kingdomId: number,
): AvatarProfileUpdate {
  return projectAvatarProfile(4, entry, kingdomId);
}
