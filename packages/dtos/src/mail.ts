import type { MailSaveResult, MailStatusResult } from "@opencok/contracts/mail";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function mailDeleted(count: number): Fields {
  return { delete: sfs.int(count) };
}

export function mailSave(result: MailSaveResult): Fields {
  return result === "unchanged" ? {} : { [result]: sfs.string("success") };
}

export function mailStatus(result: MailStatusResult): Fields {
  if (result.mode === "unknown") return {};
  if (result.mode === "category")
    return { total: sfs.long(result.total), unread: sfs.long(result.unread) };
  return Object.fromEntries(
    result.categories.map(({ total, unread }, index) => [
      String(index + 1),
      sfs.object({
        total: sfs.int(total),
        unread: sfs.int(unread),
      }),
    ]),
  );
}
