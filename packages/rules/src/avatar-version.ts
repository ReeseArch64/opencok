import type { AvatarVersionIntent, AvatarVersionPlan } from "@opencok/contracts/avatar-version";
import type { AvatarProfileUpdate, AvatarSystemMail } from "@opencok/contracts/files";
import type { Row } from "@opencok/contracts/rows";
import { validAvatarProfile } from "@opencok/contracts/chat-avatar-profile";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { avatarSequence } from "./avatar.ts";
import { avatarMailFromTemplate } from "./avatar-mail.ts";
import type { Rule } from "./game.ts";

export function avatarVersionPlan(
  profile: Row,
  now: number,
  moderated: boolean,
  interval: bigint | null,
  mailTemplate: Rule | undefined,
): AvatarVersionPlan {
  if (!Number.isSafeInteger(now) || now < 0) throw new GameError(errors.invalid, "avatar_rule");
  const sequence = avatarSequence(profile.picVer);
  if (
    [profile.name, profile.pf].some(
      (value) =>
        typeof value !== "string" ||
        value.length > 255 ||
        value.includes("\0") ||
        !value.isWellFormed(),
    )
  )
    throw new GameError(errors.invalid, "avatar_rule");
  const mail =
    moderated && mailTemplate && Object.keys(mailTemplate).length ? { ...mailTemplate } : null;
  const effects = JSON.stringify({
    version: 1,
    mail,
    profile: {
      userName: profile.name,
      platform: profile.pf,
      updatedAt: String(Math.floor(now / 1000)),
    },
  });
  if (Buffer.byteLength(effects) > 65535 || (moderated && interval === null))
    throw new GameError(errors.unsupported, "avatar_rule");
  return {
    picVer: sequence + (moderated ? 0 : 2000000),
    nextUpdateTime: moderated ? BigInt.asIntN(64, BigInt(now) + interval!) : null,
    moderated,
    effects,
    pendingEffects: mail ? 7 : 6,
  };
}

function snapshot(entry: AvatarVersionIntent) {
  if (
    !/^[a-f0-9]{32}$/.test(entry.operationId) ||
    !/^[0-9]{1,20}$/.test(entry.ownerUid) ||
    !Number.isInteger(entry.picVer) ||
    entry.picVer <= 0 ||
    entry.picVer > 2147483647 ||
    entry.picVer % 1000000 === 0 ||
    typeof entry.committedAt !== "bigint" ||
    entry.committedAt < 0n ||
    entry.committedAt > BigInt(Number.MAX_SAFE_INTEGER) ||
    (entry.nextUpdateTime !== null &&
      (typeof entry.nextUpdateTime !== "bigint" ||
        BigInt.asIntN(64, entry.nextUpdateTime) !== entry.nextUpdateTime)) ||
    !Number.isInteger(entry.pendingEffects) ||
    entry.pendingEffects < 0 ||
    entry.pendingEffects > 7 ||
    typeof entry.effects !== "string" ||
    Buffer.byteLength(entry.effects) > 65535
  )
    throw new Error("Invalid avatar version intent");
  const value = JSON.parse(entry.effects);
  if (value?.version !== 1) throw new Error("Invalid avatar version effects");
  return value;
}

export function avatarVersionMail(entry: AvatarVersionIntent): AvatarSystemMail {
  if (!(entry.pendingEffects & 1)) throw new Error("Avatar version mail not pending");
  const value = snapshot(entry);
  return avatarMailFromTemplate(entry.ownerUid, entry.committedAt, value.mail, entry.operationId);
}

export function avatarVersionProfile(
  entry: AvatarVersionIntent,
  kingdomId: number,
): AvatarProfileUpdate {
  const value = snapshot(entry);
  const result = {
    owner: entry.ownerUid,
    kingdomId,
    sequence: entry.picVer % 1000000,
    picVer: entry.picVer,
    committedAt: entry.committedAt,
    updatedAt: value.profile?.updatedAt,
    userName: value.profile?.userName,
    platform: value.profile?.platform,
  };
  if (!validAvatarProfile(result)) throw new Error("Invalid avatar version profile");
  return result;
}
