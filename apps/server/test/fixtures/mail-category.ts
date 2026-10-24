import type { MailListEntry } from "@opencok/contracts/mail";

export const mailCategoryNow = 1792756800000;
export function mailListEntry(overrides: Partial<MailListEntry> = {}): MailListEntry {
  return {
    uid: "mail",
    toUser: "self",
    fromUser: "sender",
    fromName: "Past Name",
    title: "title",
    rewardId: "",
    rewardStatus: 0,
    status: 0,
    itemIdFlag: 0,
    saveFlag: 1,
    reply: 0,
    translationId: null,
    type: 2,
    contents: Buffer.from("hello"),
    extra: null,
    createTime: 9007199254740993n,
    ...overrides,
  };
}
