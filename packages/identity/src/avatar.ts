import { createHash } from "node:crypto";
export function avatarImagePath(owner: string, sequence: number): string {
  if (
    !/^[0-9]{1,20}$/.test(owner) ||
    !Number.isInteger(sequence) ||
    sequence < 1 ||
    sequence > 999999
  )
    throw new Error("Invalid avatar image input");
  const name = createHash("md5").update(`${owner}_${sequence}`).digest("hex");
  return `/cok/img/${owner.slice(-6)}/${name}.jpg`;
}
