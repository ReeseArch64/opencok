import type { AvatarSystemMail } from "@opencok/contracts/files";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import type { Database } from "./game.ts";

export async function insertSystemMail(
  tx: Pick<Database["kingdom"]["db"], "insert">,
  input: AvatarSystemMail,
  owner: string,
  stem: string,
  createdAt: bigint,
  itemIdFlag: 0 | 1 = 1,
): Promise<void> {
  const message = {
    ...input,
    contents: Buffer.from(input.contents),
    extra: input.extra === null ? null : Buffer.from(input.extra),
  };
  if (
    ![0, 1].includes(itemIdFlag) ||
    message.owner !== owner ||
    !message.uid.startsWith(stem) ||
    message.uid.length < 32 ||
    message.uid.length > 34 ||
    !message.uid.isWellFormed() ||
    message.uid.includes("\0") ||
    message.createTime !== createdAt ||
    typeof message.createTime !== "bigint" ||
    message.createTime < 0n ||
    ![2, 15].includes(message.type) ||
    ![0, 1].includes(message.rewardStatus) ||
    !Number.isInteger(message.reply) ||
    message.reply < -2147483648 ||
    message.reply > 2147483647 ||
    typeof message.title !== "string" ||
    message.title.length > 255 ||
    !message.title.isWellFormed() ||
    message.title.includes("\0") ||
    typeof message.fromName !== "string" ||
    message.fromName.length > 100 ||
    !message.fromName.isWellFormed() ||
    message.fromName.includes("\0") ||
    message.contents.length > 40000 ||
    (message.extra !== null &&
      (message.contents.toString("utf8") !== "extra" || message.extra.length > 262143)) ||
    (message.rewardId !== null &&
      (typeof message.rewardId !== "string" ||
        !message.rewardId.isWellFormed() ||
        Buffer.byteLength(message.rewardId) > 262143))
  )
    throw new Error("Invalid system mail plan");
  if (message.extra !== null)
    await tx
      .insert(mail_contents)
      .values({ uid: message.uid, toUser: owner, contents: message.extra });
  await tx.insert(mail).values({
    uid: message.uid,
    toUser: owner,
    fromUser: null,
    fromName: message.fromName,
    title: message.title,
    contents: message.contents,
    rewardId: message.rewardId,
    itemIdFlag,
    status: 0,
    type: message.type,
    rewardStatus: message.rewardStatus,
    saveFlag: 0,
    createTime: message.createTime,
    reply: message.reply,
    translationId: null,
  });
  if (message.type === 2)
    await tx.insert(mail_group).values({
      uid: owner,
      groupType: 2,
      groupIndex: message.uid,
      updateTime: message.createTime,
    });
}
