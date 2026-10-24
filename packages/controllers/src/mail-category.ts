import type {
  MailCategoryPresentation,
  MailCategoryQuery,
  MailListEntry,
  MailSender,
} from "@opencok/contracts/mail";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import {
  encode,
  fields,
  ProtocolError,
  sfs,
  str,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import {
  mailBlank,
  mailCategoryWindow,
  mailClientType,
  mailTranslationRequest,
  selectMailCategory,
} from "@opencok/rules/mail";
import { decodeMailContent, storedMailText } from "./mail-contents.ts";

function senderFields(entry: MailListEntry, sender: MailSender | undefined): Fields {
  const info = !mailBlank(entry.fromUser) ? sender : undefined;
  const fromName = info ? info.name : entry.fromName;
  const oldName = mailBlank(entry.fromName) ? fromName : entry.fromName;
  const result: Fields = {
    fromName: sfs.string(fromName ?? ""),
    oldName: sfs.string(mailBlank(oldName) ? "" : oldName!),
  };
  if (info) {
    if (typeof info.pic !== "string") throw new ProtocolError();
    result.pic = sfs.string(info.pic);
    result.picVer = sfs.string(info.picVer ?? "0");
    if (!mailBlank(info.abbr)) result.alliance = sfs.string(info.abbr!);
  }
  return result;
}

function fightPreview(contents: string, owner: string): Value | undefined {
  try {
    const content = decodeLegacyJsonObject(contents);
    const attacker = fields(content.atkUser);
    const defender = fields(content.defUser);
    const winner = content.winner === undefined ? null : str(content, "winner");
    const preview: Fields = {
      warPoint: sfs.string(str(content, "warPoint")),
      atkName: sfs.string(str(attacker, "name")),
      ...(defender.npcId !== undefined
        ? { npcId: sfs.string(str(defender, "npcId")) }
        : { defName: sfs.string(str(defender, "name")) }),
      win: sfs.int(mailBlank(winner) ? 2 : winner === owner ? 0 : 1),
    };
    return sfs.object(preview);
  } catch {
    return undefined;
  }
}

function commonEnvelope(entry: MailListEntry, contents: string): Fields {
  const result: Fields = {
    uid: sfs.string(entry.uid),
    fromUid: sfs.string(entry.fromUser ?? ""),
    ...(entry.type === 16 ? { version: sfs.string(entry.fromUser ?? "1.0.59") } : {}),
    title: sfs.string(entry.title ?? ""),
    rewardId: sfs.string(
      storedMailText(entry.rewardId === null ? null : Buffer.from(entry.rewardId)),
    ),
    rewardStatus: sfs.int(entry.rewardStatus),
    status: sfs.int(entry.status ?? 0),
    type: sfs.int(mailClientType(entry.type)),
    createTime: sfs.long(entry.createTime),
    itemIdFlag: sfs.int(entry.itemIdFlag ?? 0),
    save: sfs.int(entry.saveFlag ?? 0),
    mbLevel: sfs.int(0),
    share: sfs.int((entry.reply & 2) === 2 ? 1 : 0),
    reply: sfs.int((entry.reply & 1) === 1 ? 1 : 0),
    like: sfs.int((entry.reply & 4) === 4 ? 1 : 0),
    donate: sfs.int((entry.reply & 8) === 8 ? 1 : 0),
  };
  if (entry.type === 7) {
    const preview = fightPreview(contents, entry.toUser);
    if (preview) result.contents = preview;
  }
  return result;
}

export function mailCategoryProjection(
  owner: string,
  query: MailCategoryQuery,
  window: readonly MailListEntry[],
  presentation: MailCategoryPresentation,
  envelope: Fields = {},
): { body: Fields; invalidIds: string[] } {
  if (
    !owner ||
    new Set(window.map((entry) => entry.uid)).size !== window.length ||
    window.some((entry) => entry.toUser !== owner) ||
    window.reduce(
      (size, entry) => size + (entry.contents?.length ?? 0) + (entry.extra?.length ?? 0),
      0,
    ) >
      4 * 1024 * 1024
  )
    throw new ProtocolError();
  const entries = selectMailCategory(query, window);
  const invalidIds: string[] = [];
  const result: Value[] = [];
  const chat = query.category === 4 || query.category === 7;
  for (const entry of entries) {
    const sender = entry.fromUser === null ? undefined : presentation.senders.get(entry.fromUser);
    const identity = senderFields(entry, sender);
    const decoded = decodeMailContent(entry);
    if (!decoded) {
      invalidIds.push(entry.uid);
      continue;
    }
    const { body: detail, contents } = decoded;
    let message: Fields;
    if (chat) {
      message = {
        ...detail,
        uid: sfs.string(entry.uid),
        type: sfs.int(mailClientType(entry.type)),
        createTime: sfs.long(entry.createTime),
        lastUpdateTime: sfs.string(presentation.recipientUpdateTime),
        ...identity,
        ...(!mailBlank(entry.fromUser) ? { fromUser: sfs.string(entry.fromUser!) } : {}),
        status: sfs.int(entry.status ?? 0),
      };
      if (
        presentation.translationEnabled &&
        [22, 24].includes(entry.type) &&
        sender?.lang !== null &&
        !mailBlank(entry.translationId)
      ) {
        message.translationId = sfs.string(entry.translationId!);
        const request = mailTranslationRequest(entry.translationId, sender ? sender.lang : "");
        const translation = request ? presentation.translations.get(entry.uid) : undefined;
        if (translation) {
          message.originalLang = sfs.string(translation.originalLang);
          message.translationMsg = sfs.string(translation.translationMsg);
        }
      }
    } else {
      message = { ...commonEnvelope(entry, contents), ...identity, detail: sfs.object(detail) };
    }
    result.push(sfs.object(message));
  }
  const body: Fields = mailCategoryWindow(query) === undefined ? {} : { result: sfs.array(result) };
  encode({ ...(Object.keys(body).length ? body : { success: sfs.bool(true) }), ...envelope });
  return { body, invalidIds };
}
