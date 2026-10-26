import { sfs, type Fields } from "@opencok/messages/sfs";
import { text, long, type Row } from "@opencok/contracts/rows";
export function postboxRelation(row: Row): Fields {
  return { publicInfo: sfs.string(text(row, "publicValue")), chatId: sfs.string(text(row, "uid")) };
}
export function postboxMessage(row: Row): Fields {
  return {
    uid: sfs.string(text(row, "uid")),
    chatId: sfs.string(text(row, "boxId")),
    fromName: sfs.string(text(row, "fromName")),
    sealId: sfs.string(text(row, "seal")),
    time: sfs.long(long(row, "createTime")),
    contents: sfs.string(Buffer.from(row.contents as Uint8Array).toString("utf8")),
  };
}
