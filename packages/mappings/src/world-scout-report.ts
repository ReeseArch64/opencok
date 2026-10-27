import { sfs, Type, type Fields, type Value } from "@opencok/messages/sfs";
import type { WorldScoutMail } from "@opencok/contracts/world-scout-report";
export function encodeScoutReport(fields: Fields) {
  let nodes = 0;
  const stringify = (value: Value, depth: number): string => {
    if (++nodes > 16384 || depth > 12) throw new Error("Scout report bound exceeded");
    if (value.type === Type.String && typeof value.value === "string")
      return JSON.stringify(value.value);
    if (value.type === Type.Bool && typeof value.value === "boolean")
      return value.value ? "true" : "false";
    if (
      value.type === Type.Int &&
      typeof value.value === "number" &&
      Number.isInteger(value.value) &&
      value.value >= -2147483648 &&
      value.value <= 2147483647
    )
      return String(value.value);
    if (
      value.type === Type.Long &&
      typeof value.value === "bigint" &&
      BigInt.asIntN(64, value.value) === value.value
    )
      return String(value.value);
    if (
      value.type === Type.Double &&
      typeof value.value === "number" &&
      Number.isFinite(value.value)
    )
      return JSON.stringify(value.value);
    if (value.type === Type.Null) return "null";
    if (value.type === Type.Array)
      return `[${(value.value as Value[]).map((entry) => stringify(entry, depth + 1)).join(",")}]`;
    if (value.type === Type.Object)
      return `{${Object.entries(value.value as Fields)
        .map(([key, entry]) => `${JSON.stringify(key)}:${stringify(entry, depth + 1)}`)
        .join(",")}}`;
    throw new Error("Invalid scout report scalar");
  };
  const bytes = Buffer.from(stringify(sfs.object(fields), 0));
  if (bytes.length > 65535) throw new Error("Scout report byte bound exceeded");
  return bytes;
}
export function scoutMailPush(
  mail: Pick<
    WorldScoutMail,
    "id" | "type" | "itemIdFlag" | "title" | "sender" | "senderName" | "createdAt"
  >,
): Fields {
  return {
    title: sfs.string(mail.title),
    rewardId: sfs.string(""),
    uid: sfs.string(mail.id),
    type: sfs.int(mail.type),
    createTime: sfs.long(mail.createdAt),
    itemIdFlag: sfs.int(mail.itemIdFlag ?? 0),
    fromUid: sfs.string(mail.sender),
    fromName: sfs.string(mail.senderName),
    oldName: sfs.string(mail.senderName),
  };
}
