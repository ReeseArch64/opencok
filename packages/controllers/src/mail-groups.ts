import type {
  MailCategoryPresentation,
  MailGroupCleanup,
  MailGroupEntry,
  MailGroupPage,
  MailGroupPreview,
  MailGroupQuery,
} from "@opencok/contracts/mail";
import {
  encode,
  extension,
  ProtocolError,
  sfs,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import {
  mailGroupContains,
  mailGroupRule,
  mailGroupSenders,
  mailGroupWindow,
} from "@opencok/rules/mail-groups";
import { decodeMailContent } from "./mail-contents.ts";
import {
  mailEnvelope,
  mailListProjection,
  mailSenderFields,
  validateMailWindow,
} from "./mail-list.ts";

function validatePreview(owner: string, group: MailGroupEntry, preview: MailGroupPreview): void {
  const rule = mailGroupRule(group.groupType);
  if (
    typeof preview.total !== "bigint" ||
    typeof preview.unread !== "bigint" ||
    preview.total < 0n ||
    preview.total > 2147483647n ||
    preview.unread < 0n ||
    preview.unread > preview.total ||
    (!rule && preview.total !== 0n) ||
    (rule?.kind === "uid" && preview.total > 1n) ||
    preview.entries.length !== Number(preview.total < 7n ? preview.total : 7n)
  )
    throw new ProtocolError();
  validateMailWindow(owner, preview.entries);
  const observedUnread = BigInt(
    preview.entries.filter((entry) => (entry.status ?? 0) === 0).length,
  );
  if (
    observedUnread > preview.unread ||
    preview.unread > preview.total - BigInt(preview.entries.length) + observedUnread ||
    preview.entries.some(
      (entry, index) =>
        !mailGroupContains(group, entry) ||
        (index > 0 && entry.createTime > preview.entries[index - 1]!.createTime),
    )
  )
    throw new ProtocolError();
}

export function mailGroupProjection(
  owner: string,
  query: MailGroupQuery,
  page: MailGroupPage,
  presentation: MailCategoryPresentation,
  envelope: Fields = {},
): { body: Fields; cleanup: MailGroupCleanup } {
  const selected = mailGroupWindow(owner, query, page.groups);
  if (page.previews.length !== selected.length) throw new ProtocolError();
  const senderIds = new Set(mailGroupSenders(page.groups));
  if ([...presentation.senders.keys()].some((id) => !senderIds.has(id))) throw new ProtocolError();
  let size = 0;
  for (const [index, group] of selected.entries()) {
    const preview = page.previews[index]!;
    validatePreview(owner, group, preview);
    for (const entry of preview.entries)
      size +=
        (entry.contents?.length ?? 0) +
        (entry.extra?.length ?? 0) +
        Buffer.byteLength(entry.rewardId ?? "");
  }
  if (size > 4 * 1024 * 1024) throw new ProtocolError();

  const groups: MailGroupCleanup["groups"][number][] = [];
  const mailIds = new Set<string>();
  const result: Value[] = [];
  for (const [index, group] of selected.entries()) {
    const rule = mailGroupRule(group.groupType);
    const preview = page.previews[index]!;
    if (rule?.kind === "sender") {
      if (!presentation.senders.size) throw new ProtocolError();
      if (!presentation.senders.has(group.groupIndex) && preview.total !== 0n)
        throw new ProtocolError();
    }
    if (!rule || preview.total === 0n) {
      groups.push({ groupType: group.groupType, groupIndex: group.groupIndex });
      continue;
    }
    const first = preview.entries[0]!;
    const sender = first.fromUser === null ? undefined : presentation.senders.get(first.fromUser);
    const message = { ...mailEnvelope(first, ""), ...mailSenderFields(first, sender) };
    if (rule.kind === "uid") {
      const decoded = decodeMailContent(first);
      if (decoded) message.detail = sfs.object(decoded.body);
      else mailIds.add(first.uid);
    } else {
      const entries = rule.kind === "sender" ? [...preview.entries].reverse() : preview.entries;
      message[rule.field] = mailListProjection(
        owner,
        entries,
        presentation,
        "conversation",
        "mread.batch",
      ).body.result!;
    }
    message.unread = sfs.int(rule.kind === "uid" ? 0 : Number(preview.unread));
    message.totalNum = sfs.int(rule.kind === "uid" ? 0 : Number(preview.total));
    result.push(sfs.object(message));
  }
  const body = { result: sfs.array(result) };
  encode(extension("mread.batch", { ...body, ...envelope }));
  return { body, cleanup: { groups, mailIds: [...mailIds] } };
}
