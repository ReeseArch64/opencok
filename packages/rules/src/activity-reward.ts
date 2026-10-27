import { javaDecimal } from "./java-integer";
import { javaMailTrim } from "./avatar-mail";
import { mailRewardEntries } from "./mail-rewards";

export function activityRewardEntries(raw: unknown) {
  if (!(raw instanceof Uint8Array) || raw.length > 65535)
    throw new Error("Invalid activity reward data");

  const decoded = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(raw);
  const entries = javaMailTrim(decoded).split("|").filter(Boolean);

  if (!entries.length || entries.length > 64) throw new Error("Invalid activity reward entries");

  return entries.flatMap((entry) => mailRewardEntries(entry));
}

export function activityRewardVersion(raw: string) {
  return javaDecimal(raw.split(".").filter(Boolean).join(""), 32);
}
