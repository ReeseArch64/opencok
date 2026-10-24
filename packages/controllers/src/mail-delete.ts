import type { MailDeleteEntry, MailDeletePlan } from "@opencok/contracts/mail";
import { mailDeleteGroups } from "@opencok/rules/mail";
import { decodeStoredJson } from "@opencok/messages/stored-json";

export function planMailDeletion(
  owner: string,
  entries: readonly MailDeleteEntry[],
): MailDeletePlan {
  const inviters = new Set<string>();
  for (const entry of entries) {
    if (entry.type !== 26 || !entry.contents) continue;
    try {
      const inline = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
        entry.contents,
      );
      let start = 0;
      let end = inline.length;
      while (start < end && inline.charCodeAt(start) <= 32) start++;
      while (end > start && inline.charCodeAt(end - 1) <= 32) end--;
      const data =
        inline.slice(start, end).toLowerCase() === "extra" ? entry.extra : entry.contents;
      if (!data) continue;
      const contents = decodeStoredJson(data);
      if (!contents || typeof contents !== "object" || Array.isArray(contents)) continue;
      const { inviterUid, inviteeUid } = contents as Record<string, unknown>;
      if (
        inviteeUid !== owner ||
        typeof inviterUid !== "string" ||
        !inviterUid.trim() ||
        inviterUid.length > 255 ||
        inviterUid.includes("\0") ||
        !inviterUid.isWellFormed()
      )
        continue;
      inviters.add(inviterUid);
    } catch {}
  }
  return { groups: mailDeleteGroups(entries), inviters: [...inviters] };
}
