import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { WorldScoutMailReader } from "@opencok/contracts/world-scout-publication";
import { decode, str, fields, type Fields } from "@opencok/messages/sfs";
import { scoutMailPush } from "@opencok/mappings/world-scout-report";

const identifier = (value: string) =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 40 &&
  value.isWellFormed() &&
  !value.includes("\0");

function invalid(): never {
  throw new Error("Invalid persisted scout notification");
}

const parameter = (contents: string, message: string) =>
  contents.startsWith(message + "|") &&
  Array.from(contents.slice(message.length + 1)).length <= 255;

function template(row: Row, author: string, recipient: string, type: number, contents: string) {
  if (text(row, "fromUser") || num(row, "itemIdFlag") !== 1) {invalid();}

  const title = text(row, "title"),
    sender = text(row, "fromName");

  if (type === 2) {
    if (sender !== "105522") {invalid();}

    if (recipient === author) {
      if (title !== "114102" || contents !== "114005") {invalid();}
    } else if (title !== "105523" || !parameter(contents, "105554")) {invalid();}

    return;
  }

  if (recipient === author) {
    if (title === "114163" && sender === "105519" && parameter(contents, "114164")) {return;}

    if (
      title === "114102" &&
      sender === "105522" &&
      (parameter(contents, "114162") || parameter(contents, "164142"))
    )
      {return;}
  } else if (title === "105523" && sender === "105522" && parameter(contents, "105554")) {return;}

  invalid();
}

export async function publishWorldScoutMail(
  payload: Uint8Array,
  author: string,
  reader: WorldScoutMailReader,
  publish: (recipient: string, command: string, body: Fields) => Promise<unknown>,
) {
  if (!identifier(author) || !(payload instanceof Uint8Array) || payload.byteLength > 65536)
    {invalid();}

  const body = decode(Buffer.from(payload)),
    recipient = str(body, "owner"),
    uid = str(fields(body.mail), "uid");

  if (!identifier(recipient) || !/^[a-f0-9]{32}00$/.test(uid)) {invalid();}

  const saved = await reader(recipient, uid);

  if (
    !Number.isInteger(saved.kingdomId) ||
    saved.kingdomId < 1 ||
    saved.kingdomId > 2147483647 ||
    saved.realm !== saved.kingdomId
  )
    {invalid();}

  const row = saved.mail;

  if (!row) {return;}

  const type = num(row, "type"),
    flag = num(row, "itemIdFlag"),
    sender = text(row, "fromUser"),
    at = long(row, "createTime");

  if (
    row.uid !== uid ||
    row.toUser !== recipient ||
    ![2, 6, 8].includes(type) ||
    ![0, 1].includes(flag) ||
    (row.rewardId !== null && row.rewardId !== undefined && row.rewardId !== "") ||
    num(row, "rewardStatus") !== 1 ||
    at < 0n ||
    at > 9223372036854775807n ||
    text(row, "title").length > 255 ||
    text(row, "fromName").length > 100 ||
    !(row.contents instanceof Uint8Array) ||
    row.contents.byteLength > 65535
  )
    {invalid();}

  if (type === 8) {
    if (recipient !== author || sender || flag !== 0) {invalid();}
  } else {
    const contents = new TextDecoder("utf-8", { fatal: true }).decode(row.contents);

    if (type === 2 || flag === 1) {template(row, author, recipient, type, contents);}
    else {
      const notice = contents.match(/^([\s\S]*)\|(1|2|3)\|([1-9][0-9]{0,9})$/);

      if (
        recipient === author ||
        sender !== author ||
        !notice ||
        Array.from(notice[1]!).length > 267 ||
        Number(notice[3]) > 2147483647 ||
        text(row, "title") !== notice[2]
      )
        {invalid();}
    }
  }

  await publish(
    recipient,
    "push.mail",
    scoutMailPush({
      id: uid,
      type: type as 2 | 6 | 8,
      itemIdFlag: flag as 0 | 1,
      title: text(row, "title"),
      sender,
      senderName: text(row, "fromName"),
      createdAt: at,
    }),
  );
}
