import { javaDecimal } from "./java-integer.ts";
import type {
  MailConversationReadEffect,
  MailConversationReadQuery,
} from "@opencok/contracts/mail";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { mailServerType } from "./mail.ts";

const int = (value: number) =>
  Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
function invalid(): never {
  throw new GameError(errors.invalid, "mail");
}
function decimal(token: string): number {
  try {
    return Number(javaDecimal(token, 32));
  } catch {
    return invalid();
  }
}

export function mailConversationReadQuery(
  input: {
    mod?: number;
    fromUser?: string | null;
    driftingBottle?: number;
    type?: number;
    types?: string;
  },
  now: number,
): MailConversationReadQuery {
  const mod = input.mod === undefined ? 0 : input.mod;
  if (!int(mod) || !Number.isSafeInteger(now) || now < 0) return invalid();
  const effects: MailConversationReadEffect[] = [];
  if (input.fromUser !== undefined) {
    const fromUser = input.fromUser;
    if (
      fromUser !== null &&
      (typeof fromUser !== "string" ||
        fromUser.length > 40 ||
        fromUser.includes("\0") ||
        !fromUser.isWellFormed())
    )
      return invalid();
    if (mod !== 1 && input.driftingBottle !== undefined && !int(input.driftingBottle))
      return invalid();
    const bottle = mod !== 1 && input.driftingBottle === 1;
    effects.push({
      kind: "mail",
      fromUser,
      types: mod === 1 ? [23, 24] : bottle ? [43, 44] : [20, 21, 22],
      unreadOnly: !bottle,
    });
    effects.push({
      kind: "chat",
      others: fromUser === null ? "null" : fromUser,
      types: mod === 1 ? ["2"] : bottle ? ["3"] : ["1", "20"],
    });
  } else if (input.type !== undefined) {
    if (!int(input.type)) return invalid();
    effects.push({ kind: "mail", types: [mailServerType(input.type)], unreadOnly: true });
  }
  if (input.types !== undefined) {
    if (typeof input.types !== "string" || new TextEncoder().encode(input.types).length > 65535)
      return invalid();
    const tokens = input.types.split(",").filter(Boolean);
    if (tokens.length > 1000) return invalid();
    for (const token of tokens)
      effects.push({ kind: "mail", types: [mailServerType(decimal(token))], unreadOnly: true });
    if (input.types === "0,1,20") effects.push({ kind: "chat", others: "", types: ["1", "20"] });
  }
  return { now, effects };
}
