import type { MailUpdateEntry } from "@opencok/contracts/mail-updates";
import { javaDecimal } from "@opencok/rules/java-integer";
import { encode, extension, sfs, type Fields, type Value } from "@opencok/messages/sfs";

export function mailUpdateCursor(raw: string | null): bigint {
  try {
    return javaDecimal(raw, 64);
  } catch {
    return 0n;
  }
}

export function mailUpdatesProjection(
  entries: readonly MailUpdateEntry[],
  envelope: Fields = {},
): Fields {
  if (entries.length > 10000) throw new Error("Too many mail update markers");
  const ids = new Set<string>();
  const updates: string[] = [];
  const deleted: string[] = [];
  for (const entry of entries) {
    if (
      typeof entry.uid !== "string" ||
      !entry.uid ||
      entry.uid.length > 40 ||
      entry.uid.includes("\0") ||
      !entry.uid.isWellFormed() ||
      ids.has(entry.uid) ||
      typeof entry.updateTime !== "bigint" ||
      entry.updateTime < 0n ||
      entry.updateTime > 9223372036854775807n
    )
      throw new Error("Invalid mail update marker");
    ids.add(entry.uid);
    const uid = JSON.stringify(entry.uid);
    if (entry.flags === null) {
      deleted.push(uid);
      continue;
    }
    const { status, rewardStatus, saveFlag } = entry.flags;
    if (
      [status, rewardStatus, saveFlag].some(
        (value) => !Number.isInteger(value) || value < -2147483648 || value > 2147483647,
      )
    )
      throw new Error("Invalid mail update flags");
    updates.push(
      `{"uid":${uid},"status":${status},"rewardStatus":${rewardStatus},"saveFlag":${saveFlag},"mailLastUpdateTime":${entry.updateTime}}`,
    );
  }
  const data = `{"update":[${updates.join(",")}],"delete":[${deleted.join(",")}]}`;
  const body: Fields = { data: sfs.string(data.length >= 32767 ? "" : data) };
  if (data.length >= 32767) {
    const chunks: Value[] = [];
    for (let offset = 0; offset < data.length; offset += 5000)
      chunks.push(
        sfs.string(
          data
            .slice(offset, offset + 5000)
            .replace(
              /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
              "?",
            ),
        ),
      );
    body.updatemailArr = sfs.array(chunks);
  }
  encode(extension("chat.get.update.mails", { ...body, ...envelope }));
  return body;
}
