import type { MailConversationReadQuery } from "@opencok/contracts/mail";
import { Type, int, str, ProtocolError, type Fields } from "@opencok/messages/sfs";
import { mailConversationReadQuery } from "@opencok/rules/mail-conversation-read";

function signedInt(params: Fields, key: string): number {
  const value = int(params, key);

  if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647)
    {throw new ProtocolError();}

  return value;
}

function string(params: Fields, key: string): string {
  const value = str(params, key);

  if (typeof value !== "string") {throw new ProtocolError();}

  return value;
}

export function mailConversationReadRequest(
  params: Fields,
  now: number,
): MailConversationReadQuery {
  const mod = params.mod === undefined ? 0 : signedInt(params, "mod");
  const input: Parameters<typeof mailConversationReadQuery>[0] = { mod };

  if (params.fromUser !== undefined) {
    input.fromUser = params.fromUser.type === Type.Null ? null : string(params, "fromUser");

    if (mod !== 1 && params.driftingBottle !== undefined)
      {input.driftingBottle = signedInt(params, "driftingBottle");}
  } else if (params.type !== undefined) {input.type = signedInt(params, "type");}

  if (params.types !== undefined) {input.types = string(params, "types");}

  return mailConversationReadQuery(input, now);
}
