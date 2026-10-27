import { errors } from "@opencok/constants/game";
import type { MailCategoryDeleteQuery, MailTypeDeleteQuery } from "@opencok/contracts/mail";
import { GameError } from "@opencok/errors/game";
import { javaDecimal } from "./java-integer.ts";
import { mailBlank, mailServerType } from "./mail.ts";

function parts(value: string | null | undefined): string[] {
  if (value === null || value === undefined) {return [];}

  if (
    typeof value !== "string" ||
    Buffer.byteLength(value) > 65535 ||
    !value.isWellFormed() ||
    value.includes("\0")
  )
    {throw new GameError(errors.invalid, "mail");}

  if (mailBlank(value)) {return [];}

  const values = value.split(",").filter(Boolean);

  if (values.length > 1000) {throw new GameError(errors.invalid, "mail");}

  return values;
}

function time(now: number) {
  if (!Number.isSafeInteger(now) || now < 0) {throw new GameError(errors.invalid, "mail");}
}

export function mailCategoryDeleteQuery(
  uids: string | null | undefined,
  types: string | null | undefined,
  now: number,
): MailCategoryDeleteQuery {
  time(now);
  const ids = parts(uids);

  if (ids.some((id) => id.length > 40)) {throw new GameError(errors.invalid, "mail");}

  const labels = parts(types).map((raw) => {
    try {
      return { raw, category: Number(javaDecimal(raw, 32)) };
    } catch {
      throw new GameError(errors.invalid, "mail");
    }
  });

  return { now, labels, ...(ids.length ? { ids: [...new Set(ids)] } : {}) };
}

export function mailTypeDeleteQuery(type: number | undefined, now: number): MailTypeDeleteQuery {
  time(now);

  if (type !== undefined && (!Number.isInteger(type) || type < -2147483648 || type > 2147483647))
    {throw new GameError(errors.invalid, "mail");}

  return type === undefined ? { now } : { now, type: mailServerType(type) };
}
