import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { AvatarSystemMail } from "@opencok/contracts/files";
import { javaMailTrim } from "@opencok/rules/avatar-mail";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeAvatarMailPush(mail: AvatarSystemMail, fullFields: boolean): Fields {
  const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  let contents = javaMailTrim(text.decode(mail.extra ?? mail.contents));
  if (mail.extra === null && contents.toLowerCase() === "extra") contents = "";
  const fields: Fields = {
    title: sfs.string(mail.title),
    rewardId: sfs.string(javaMailTrim(mail.rewardId ?? "")),
    uid: sfs.string(mail.uid),
    type: sfs.int(mail.type),
    createTime: sfs.long(mail.createTime),
    itemIdFlag: sfs.int(1),
    fromUid: sfs.string(""),
    fromName: sfs.string(mail.fromName),
    oldName: sfs.string(mail.fromName),
  };
  if (mail.type === 2) {
    fields.unread = sfs.int(1);
    fields.totalNum = sfs.int(1);
  }
  if (fullFields)
    Object.assign(fields, {
      rewardStatus: sfs.int(mail.rewardStatus),
      status: sfs.int(0),
      contentsLocal: sfs.string(contents.replaceAll("\\n", "\n")),
      saveFlag: sfs.int(0),
      toUser: sfs.string(mail.owner),
      reply: sfs.int(mail.reply),
      translationId: sfs.string(""),
      fromUser: sfs.string(""),
    });
  return fields;
}

export class AvatarMailPushDto extends createZodDto(
  z.strictObject({
    title: wire.string,
    rewardId: wire.string,
    uid: wire.string,
    fromUid: wire.string,
    fromName: wire.string,
    oldName: wire.string,
    contentsLocal: wire.string.optional(),
    toUser: wire.string.optional(),
    translationId: wire.string.optional(),
    fromUser: wire.string.optional(),
    type: wire.int,
    itemIdFlag: wire.int,
    unread: wire.int.optional(),
    totalNum: wire.int.optional(),
    rewardStatus: wire.int.optional(),
    status: wire.int.optional(),
    saveFlag: wire.int.optional(),
    reply: wire.int.optional(),
    createTime: wire.long,
  }),
) {}

export function avatarMailPush(...args: Parameters<typeof serializeAvatarMailPush>): Fields {
  return new AvatarMailPushDto(serializeAvatarMailPush(...args));
}
