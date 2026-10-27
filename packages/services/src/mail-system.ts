import type { MailListEntry, MailCategoryReaders } from "@opencok/contracts/mail";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { encode, extension, sfs, str, type Fields, type Value } from "@opencok/messages/sfs";
import { mailBlank, mailClientType } from "@opencok/rules/mail";
import { storedMailText } from "./mail-contents.ts";
import { validateMailWindow } from "./mail-list.ts";

const privateTypes = new Set([20, 21, 22, 23, 24, 37, 38, 39, 40, 43, 44, 45, 46]);

export async function systemMailProjection(
  owner: string,
  entries: readonly MailListEntry[],
  readers: MailCategoryReaders,
  count: number,
  time: bigint,
  envelope: Fields,
  page?: (
    ids: readonly string[],
    inspect: (indices: readonly number[], more: boolean) => void,
  ) => Promise<void>,
): Promise<Fields> {
  validateMailWindow(owner, entries);

  if (
    !Number.isInteger(count) ||
    count < -2147483648 ||
    count > 2147483647 ||
    typeof time !== "bigint" ||
    BigInt.asIntN(64, time) !== time
  )
    throw new Error("Invalid system mail pagination");

  const messages: { uid: string; time: bigint; body: Fields; sender: string | null }[] = [];
  const senderIds = new Set<string>();

  for (const entry of entries) {
    if (privateTypes.has(entry.type)) continue;

    let contents = storedMailText(entry.contents);

    if (contents.toLowerCase() === "extra") {
      if (entry.extra === null) throw new Error("Missing persisted mail contents");

      contents = storedMailText(entry.extra);
    }

    if (contents.toLowerCase() === "extra") continue;

    let fromUser = entry.fromUser ?? "";

    if (entry.type === 26) {
      fromUser = str(decodeLegacyJsonObject(contents), "inviterUid");

      if (!mailBlank(fromUser)) senderIds.add(fromUser);
    }

    if (entry.type === 10 && !mailBlank(fromUser)) senderIds.add(fromUser);

    contents = contents.replaceAll("\\n", "\n");
    const chunks: Value[] = [];

    for (let offset = 0; offset < contents.length; offset += 5000)
      chunks.push(
        sfs.string(
          contents
            .slice(offset, offset + 5000)
            .replace(
              /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
              "?",
            ),
        ),
      );

    const body: Fields = {
      uid: sfs.string(entry.uid),
      toUser: sfs.string(entry.toUser),
      fromUser: sfs.string(fromUser),
      fromName: sfs.string(entry.fromName ?? ""),
      title: sfs.string(entry.title ?? ""),
      status: sfs.int(entry.status ?? 0),
      type: sfs.int(mailClientType(entry.type)),
      rewardStatus: sfs.int(entry.rewardStatus),
      itemIdFlag: sfs.int(entry.itemIdFlag ?? 0),
      createTime: sfs.long(entry.createTime),
      saveFlag: sfs.int(entry.saveFlag ?? 0),
      contents: sfs.string(""),
      contentsArr: sfs.array(chunks),
      rewardId: sfs.string(
        storedMailText(entry.rewardId === null ? null : Buffer.from(entry.rewardId)),
      ),
      reply: sfs.int(entry.reply),
      translationId: sfs.string(entry.translationId ?? ""),
      save: sfs.string(String(entry.saveFlag ?? 0)),
    };
    messages.push({
      uid: entry.uid,
      time: entry.createTime,
      body,
      sender: entry.type === 10 || entry.type === 26 ? fromUser : null,
    });
  }

  const senders = await readers.senders([...senderIds]);

  for (const message of messages) {
    const sender = message.sender === null ? undefined : senders.get(message.sender);

    if (!sender) continue;

    if (mailBlank(str(message.body, "fromName")) && sender.name !== null)
      message.body.fromName = sfs.string(sender.name);

    if (sender.pic !== null) message.body.pic = sfs.string(sender.pic);

    message.body.picVer = sfs.string(sender.picVer ?? "0");
  }

  messages.sort((left, right) => (left.time < right.time ? -1 : left.time > right.time ? 1 : 0));

  if (page) {
    let result: Fields | undefined;
    await page(
      messages.map((message) => message.uid),
      (indices, more) => {
        if (
          indices.length > messages.length ||
          new Set(indices).size !== indices.length ||
          indices.some(
            (index) => !Number.isInteger(index) || index < 0 || index >= messages.length,
          ) ||
          typeof more !== "boolean"
        )
          throw new Error("Invalid system mail page");

        const body: Fields = {
          id: sfs.string("0"),
          type: sfs.int(4),
          firstSeqId: sfs.string("-1"),
          lastSeqId: sfs.string("-1"),
          more: sfs.bool(more),
          msg: sfs.array(indices.map((index) => sfs.object(messages[index]!.body))),
        };
        encode(extension("chat.get.system.mails", { ...body, ...envelope }));
        result = body;
      },
    );

    if (!result) throw new Error("Missing system mail page");

    return result;
  }

  const selected: typeof messages = [];
  let lastUid = "0";

  if (messages.length > count) {
    let nextTime = false;

    for (const message of messages) {
      if ((message.time / 1000n) * 1000n === time) {
        selected.push(message);
        lastUid = message.uid;
        continue;
      }

      if (!nextTime) {
        selected.push(message);
        lastUid = message.uid;
        nextTime = true;
        continue;
      }

      if (selected.length >= count) break;

      selected.push(message);
      lastUid = message.uid;
    }
  } else selected.push(...messages);

  const body: Fields = {
    id: sfs.string("0"),
    type: sfs.int(4),
    firstSeqId: sfs.string("-1"),
    lastSeqId: sfs.string("-1"),
    lastUid: sfs.string(lastUid),
    more: sfs.bool(selected.length < messages.length),
    msg: sfs.array(selected.map((message) => sfs.object(message.body))),
  };
  encode(extension("chat.get.system.mails.v2", { ...body, ...envelope }));

  return body;
}
