import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { javaGbkLength } from "./java-gbk.ts";
import { mailBlank } from "./mail.ts";

export interface NicknameCheck {
  occupied: number;
  exist: number;
  length: number;
  remainLength: number;
}

export interface NicknameCheckProviders {
  containsBadWords(name: string): boolean | Promise<boolean>;
  occupied(name: string): Promise<boolean>;
}

function validateText(text: string): void {
  if (typeof text !== "string" || text.length > 65535) {throw new GameError(errors.invalid);}
}

export function nicknameTrim(text: string): string {
  validateText(text);
  let first = 0,
    last = text.length;

  while (first < last && text.charCodeAt(first) <= 32) {first++;}

  while (last > first && text.charCodeAt(last - 1) <= 32) {last--;}

  return text.slice(first, last);
}

export function nicknameLength(text: string): number {
  validateText(text);

  if (mailBlank(text)) {return 0;}

  const encoded = text.replace(/[\u007e-\u05ff]/g, "");

  return text.length - encoded.length + javaGbkLength(encoded);
}

export function nicknameCharactersAllowed(text: string): boolean {
  validateText(text);

  if (/[\b\f\n\r\t"\\/\u2600-\u27bf]|[\u{10000}-\u{10ffff}]/u.test(text)) {return false;}

  let depth = 0;

  for (const character of text) {
    if (character === "{") {depth++;}

    if (character === "}" && --depth < 0) {return false;}
  }

  return depth === 0;
}

export async function checkNickname(
  raw: string,
  type: number,
  providers: NicknameCheckProviders,
): Promise<NicknameCheck> {
  validateText(raw);

  if (!Number.isInteger(type) || type < -2147483648 || type > 2147483647)
    {throw new GameError(errors.invalid);}

  const name = nicknameTrim(raw);
  const length = nicknameLength(name);
  const reportedLength = length + raw.split(" ").length - 1;
  const result: NicknameCheck = {
    occupied: 0,
    exist: mailBlank(raw) || name.startsWith("(") ? -1 : 0,
    length: reportedLength,
    remainLength: 16 - reportedLength,
  };

  if (length < 3 || length > 16 || !nicknameCharactersAllowed(name)) {result.exist = -1;}
  else if (await providers.containsBadWords(name)) {result.exist = -1;}
  else if (type === 0 && (await providers.occupied(name))) {
    result.exist = -1;
    result.occupied = 1;
  }

  return result;
}
