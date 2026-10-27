import type { AvatarCompletionRecord, AvatarSystemMail } from "@opencok/contracts/files";
import { mailBlank } from "./mail.ts";
import { javaDecimal } from "./java-integer.ts";

export function javaMailTrim(value: string): string {
  let start = 0;
  let end = value.length;

  while (start < end && value.charCodeAt(start) <= 32) {start++;}

  while (end > start && value.charCodeAt(end - 1) <= 32) {end--;}

  return value.slice(start, end);
}

export function javaMailBytes(value: string | undefined): Uint8Array | null {
  if (value === undefined || mailBlank(value)) {return null;}

  if (!value.isWellFormed() || value.length > 65535) {throw new Error("Invalid avatar mail text");}

  const text = javaMailTrim(value);
  const bytes = new TextEncoder().encode(text);
  let capacity = Math.trunc(Math.fround(text.length * Math.fround(1.1)));

  while (capacity < bytes.length) {capacity = capacity * 2 + 1;}

  const buffer = new Uint8Array(capacity);
  buffer.set(bytes);

  return buffer;
}

function invalid(): never {
  throw new Error("Invalid avatar mail intent");
}

export function avatarSystemMail(
  entry: AvatarCompletionRecord,
  stem: string,
  resolveReward?: (rewardId: string, owner: string) => string | null,
): AvatarSystemMail {
  if (
    !/^[0-9]{1,20}$/.test(entry.ownerUid) ||
    !Number.isInteger(entry.sequence) ||
    entry.sequence < 1 ||
    entry.sequence > 999999 ||
    !/^[a-f0-9]{64}$/.test(entry.hash) ||
    entry.picVer !== entry.sequence ||
    typeof entry.committedAt !== "bigint" ||
    entry.committedAt < 0n ||
    entry.committedAt > BigInt(Number.MAX_SAFE_INTEGER) ||
    !Number.isInteger(entry.pendingEffects) ||
    entry.pendingEffects < 0 ||
    entry.pendingEffects > 7 ||
    !(entry.pendingEffects & 1) ||
    !/^[a-f0-9]{32}$/.test(stem) ||
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

  const template = snapshot?.mail;

  if (snapshot?.version !== 1) {return invalid();}

  return avatarMailFromTemplate(entry.ownerUid, entry.committedAt, template, stem, resolveReward);
}

export function avatarMailFromTemplate(
  owner: string,
  committedAt: bigint,
  template: unknown,
  stem: string,
  resolveReward?: (rewardId: string, owner: string) => string | null,
): AvatarSystemMail {
  if (
    !/^[0-9]{1,20}$/.test(owner) ||
    typeof committedAt !== "bigint" ||
    committedAt < 0n ||
    committedAt > BigInt(Number.MAX_SAFE_INTEGER) ||
    !/^[a-f0-9]{32}$/.test(stem) ||
    !template ||
    typeof template !== "object" ||
    Array.isArray(template) ||
    !Object.keys(template).length ||
    Object.keys(template).length > 100 ||
    Object.entries(template).some(
      ([key, value]) =>
        !key ||
        key.length > 100 ||
        !key.isWellFormed() ||
        key.includes("\0") ||
        typeof value !== "string" ||
        !value.isWellFormed() ||
        value.includes("\0"),
    )
  )
    {return invalid();}

  const fields = template as Record<string, string>;
  const type = mailBlank(fields.type) || fields.type === "0" ? 15 : 2;
  const category =
    !mailBlank(fields.category) && fields.category!.length === 2 ? fields.category! : "00";
  const title = javaMailTrim(fields.title ?? "");
  const fromName = mailBlank(fields.sender) ? "" : javaMailTrim(fields.sender!);

  if (title.length > 255 || fromName.length > 100) {return invalid();}

  let reward = fields.reward as string | undefined | null;

  if (!mailBlank(reward) && !reward!.includes(",")) {
    if (!resolveReward) {return invalid();}

    reward = resolveReward(reward!, owner);

    if (reward !== null && typeof reward !== "string") {return invalid();}
  }

  const rewardBytes = javaMailBytes(reward ?? undefined);
  const rewardId = rewardBytes
    ? new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(rewardBytes)
    : null;
  const contents = javaMailBytes(fields.message);

  if (!contents) {return invalid();}

  const extra = contents.length > 40000 || fields.message === "MAILTEST" ? contents : null;
  const reply = fields.share === undefined ? 0 : Number(javaDecimal(fields.share, 32)) << 1;

  return {
    uid: javaMailTrim(stem + category),
    owner,
    fromName,
    title,
    type,
    contents: extra ? new TextEncoder().encode("extra") : contents,
    extra,
    rewardId,
    rewardStatus: rewardBytes ? 0 : 1,
    reply,
    createTime: committedAt,
  };
}
