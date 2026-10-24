import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { HttpError } from "@opencok/errors/http";
export function verifyConfirmation(
  token: string,
  owner: string,
  sequence: string,
  key: Buffer,
  now = Math.floor(Date.now() / 1000),
) {
  const match = /^v1\.([0-9]{10})\.([a-f0-9]{64})$/.exec(token);
  if (!match || Number(match[1]) <= now || Number(match[1]) > now + 30)
    throw new HttpError(401, "Invalid confirmation authorization");
  const expected = createHmac("sha256", key)
    .update(`confirm\n${owner}\n${sequence}\n${match[1]}`)
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(match[2]!, "hex")))
    throw new HttpError(401, "Invalid confirmation authorization");
}
export function verifyGrant(token: string, key: Buffer, now = Math.floor(Date.now() / 1000)) {
  const m =
    /^v1\.([0-9]{1,20})\.([1-9][0-9]{0,5})\.([0-9]{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(
      token,
    );
  if (!m || Number(m[3]) <= now || Number(m[3]) > now + 120)
    throw new HttpError(401, "Invalid upload grant");
  const expected = createHmac("sha256", key)
    .update(token.slice(0, token.lastIndexOf(".")))
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(m[5]!, "hex")))
    throw new HttpError(401, "Invalid upload grant");
  return { owner: m[1]!, seq: m[2]! };
}

function signingInput(
  owner: string,
  sequence: number,
  key: Buffer,
  now: number,
  ttl: number,
): number {
  const expires = now + ttl;
  if (
    typeof owner !== "string" ||
    !/^[0-9]{1,20}$/.test(owner) ||
    !Number.isInteger(sequence) ||
    sequence < 1 ||
    sequence > 999999 ||
    !Buffer.isBuffer(key) ||
    key.length !== 32 ||
    !Number.isSafeInteger(now) ||
    now < 0 ||
    !/^[0-9]{10}$/.test(String(expires))
  )
    throw new Error("Invalid avatar authorization input");
  return expires;
}
export function issueAvatarGrant(
  owner: string,
  sequence: number,
  key: Buffer,
  now = Math.floor(Date.now() / 1000),
): string {
  const expires = signingInput(owner, sequence, key, now, 120);
  const body = `v1.${owner}.${sequence}.${expires}.${randomBytes(16).toString("hex")}`;
  return `${body}.${createHmac("sha256", key).update(body).digest("hex")}`;
}
export function issueAvatarConfirmation(
  owner: string,
  sequence: number,
  key: Buffer,
  now = Math.floor(Date.now() / 1000),
): string {
  const expires = signingInput(owner, sequence, key, now, 30);
  const hash = createHmac("sha256", key)
    .update(`confirm\n${owner}\n${sequence}\n${expires}`)
    .digest("hex");
  return `v1.${expires}.${hash}`;
}
