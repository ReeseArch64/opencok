import { validateFields } from "./validation.ts";
import { mailDeletedSchema, mailSaveSchema, mailStatusSchema } from "@opencok/validations/mail";

import type { MailSaveResult, MailStatusResult } from "@opencok/contracts/mail";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeMailDeleted(count: number): Fields {
  return { delete: sfs.int(count) };
}

function serializeMailSave(result: MailSaveResult): Fields {
  return result === "unchanged" ? {} : { [result]: sfs.string("success") };
}

function serializeMailStatus(result: MailStatusResult): Fields {
  if (result.mode === "unknown") {return {};}

  if (result.mode === "category")
    {return { total: sfs.long(result.total), unread: sfs.long(result.unread) };}

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

export function mailDeleted(...args: Parameters<typeof serializeMailDeleted>): Fields {
  return validateFields(mailDeletedSchema, serializeMailDeleted(...args));
}

export function mailSave(...args: Parameters<typeof serializeMailSave>): Fields {
  return validateFields(mailSaveSchema, serializeMailSave(...args));
}

export function mailStatus(...args: Parameters<typeof serializeMailStatus>): Fields {
  return validateFields(mailStatusSchema, serializeMailStatus(...args));
}
