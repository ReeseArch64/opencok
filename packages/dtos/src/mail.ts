import { z } from "zod";
import { createZodDto, wire, wireRecord } from "./dto.ts";

import type { MailSaveResult, MailStatusResult } from "@opencok/contracts/mail";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeMailDeleted(count: number): Fields {
  return { delete: sfs.int(count) };
}

function serializeMailSave(result: MailSaveResult): Fields {
  return result === "unchanged" ? {} : { [result]: sfs.string("success") };
}

function serializeMailStatus(result: MailStatusResult): Fields {
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

export class MailDeletedDto extends createZodDto(z.strictObject({ delete: wire.int })) {}

export class MailSaveDto extends createZodDto(
  z.union([
    z.strictObject({}),
    z.strictObject({ save: wire.string.refine(({ value }) => value === "success") }),
    z.strictObject({ cancel: wire.string.refine(({ value }) => value === "success") }),
  ]),
) {}

export class MailStatusDto extends createZodDto(
  z.union([
    z.strictObject({}),
    z.strictObject({ total: wire.long, unread: wire.long }),
    wireRecord(
      z.string().regex(/^[1-9]$/),
      wire.object(z.strictObject({ total: wire.int, unread: wire.int })),
    ),
  ]),
) {}

export function mailDeleted(...args: Parameters<typeof serializeMailDeleted>): Fields {
  return new MailDeletedDto(serializeMailDeleted(...args));
}

export function mailSave(...args: Parameters<typeof serializeMailSave>): Fields {
  return new MailSaveDto(serializeMailSave(...args));
}

export function mailStatus(...args: Parameters<typeof serializeMailStatus>): Fields {
  return new MailStatusDto(serializeMailStatus(...args));
}
