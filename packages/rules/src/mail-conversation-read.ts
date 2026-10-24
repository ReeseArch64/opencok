import type {
  MailConversationReadEffect,
  MailConversationReadQuery,
} from "@opencok/contracts/mail";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { mailServerType } from "./mail.ts";

const digitZeros = [
  0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xe50,
  0xed0, 0xf20, 0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0,
  0x1c40, 0x1c50, 0xa620, 0xa8d0, 0xa900, 0xa9d0, 0xaa50, 0xabf0, 0xff10,
];
const int = (value: number) =>
  Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
function invalid(): never {
  throw new GameError(errors.invalid, "mail");
}
function decimal(token: string): number {
  const negative = token[0] === "-";
  const start = negative || token[0] === "+" ? 1 : 0;
  if (start === token.length) return invalid();
  let value = 0;
  for (let index = start; index < token.length; index++) {
    const code = token.charCodeAt(index);
    const zero = digitZeros.find((zero) => code >= zero && code <= zero + 9);
    if (zero === undefined) return invalid();
    value = value * 10 + code - zero;
    if (value > (negative ? 2147483648 : 2147483647)) return invalid();
  }
  return value === 0 ? 0 : negative ? -value : value;
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
