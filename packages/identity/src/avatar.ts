import { createHmac, timingSafeEqual } from "node:crypto";
import { HttpError } from "@opencok/errors/http";
export function verifyConfirmation(token: string, owner: string, sequence: string, key: Buffer) {
  const match = /^v1\.([0-9]{10})\.([a-f0-9]{64})$/.exec(token);
  const now = Math.floor(Date.now() / 1000);
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
