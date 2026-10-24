import type {
  MailCategoryQuery,
  MailListEntry,
  MailCategoryPresentation,
} from "@opencok/contracts/mail";
import { encode, extension, sfs, type Fields } from "@opencok/messages/sfs";
import { selectMailCategory, mailCategoryWindow } from "@opencok/rules/mail";
import { mailListProjection, validateMailWindow } from "./mail-list.ts";

export function mailCategoryProjection(
  owner: string,
  query: MailCategoryQuery,
  window: readonly MailListEntry[],
  presentation: MailCategoryPresentation,
  envelope: Fields = {},
): { body: Fields; invalidIds: string[] } {
  validateMailWindow(owner, window);
  const selected = selectMailCategory(query, window);
  if (mailCategoryWindow(query) === undefined) {
    encode(extension("mread.batch.category", { success: sfs.bool(true), ...envelope }));
    return { body: {}, invalidIds: [] };
  }
  return mailListProjection(
    owner,
    selected,
    presentation,
    query.category === 4 || query.category === 7 ? "category-chat" : "ordinary",
    "mread.batch.category",
    envelope,
  );
}
