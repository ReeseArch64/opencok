import { javaNicknameCharacterPattern } from "./java-nickname-characters.ts";
import { nicknameTrim } from "./nickname.ts";

export function reservedNicknameText(name: string): string {
  return nicknameTrim(name.toLowerCase())
    .replace(/ +/g, " ")
    .replace(/[\u3000\uff01-\uff5e]/g, (unit) =>
      unit === "\u3000" ? " " : String.fromCharCode(unit.charCodeAt(0) - 65248),
    );
}

export function reservedNicknamePattern(source: string): { pattern: string; flags: string } {
  if (typeof source !== "string" || source.length > 4096 || !source.isWellFormed())
    {throw new Error("Invalid reserved nickname pattern");}

  let flags = "u";
  let insensitive = false;
  let input = source;
  const prefix = /^\(\?([ims]+)\)/.exec(input);

  if (prefix) {
    insensitive = prefix[1]!.includes("i");
    flags += [...new Set(prefix[1])].filter((flag) => flag !== "i").join("");
    input = input.slice(prefix[0].length);
  }

  const literal = (unit: string) =>
    insensitive ? unit.replace(/[A-Z]/g, (value) => value.toLowerCase()) : unit;
  const letters = javaNicknameCharacterPattern(1);
  const marks = javaNicknameCharacterPattern(2);
  const word = `(?:${letters}|_)`;
  const left = `(?:(?<=${word})|(?<=${letters}${marks}+))`;
  const right = `(?:(?=${word})|(?<=${letters}${marks}*)(?=${marks}))`;
  const boundary = `(?:${left}(?!${right})|(?!${left})${right})`;
  let result = "";
  let quoted = false;
  let characterClass = false;

  for (let index = 0; index < input.length; index++) {
    const unit = input[index]!;

    if (unit === "\\") {
      const next = input[++index];

      if (!next) {throw new Error("Invalid reserved nickname escape");}

      if (next === "Q" && !quoted) {
        quoted = true;
        continue;
      }

      if (next === "E" && quoted) {
        quoted = false;
        continue;
      }

      if (quoted) {
        result += "\\\\";
        index--;
        continue;
      }

      if (next === "b" && !characterClass) {result += boundary;}
      else if (next === "B" && !characterClass) {result += `(?!${boundary})`;}
      else if (next === "A") {result += "(?<![\\s\\S])";}
      else if (next === "z") {result += "(?![\\s\\S])";}
      else if (next === "s")
        {result += characterClass ? " \\t\\n\\x0B\\f\\r" : "[ \\t\\n\\x0B\\f\\r]";}
      else if (next === "S" && !characterClass) {result += "[^ \\t\\n\\x0B\\f\\r]";}
      else if ("dDwWtnrf\\.[]{}()*+?^$|-/".includes(next)) {result += `\\${next}`;}
      else if (next === "u" || next === "x") {
        const width = next === "u" ? 4 : 2;
        const hex = input.slice(index + 1, index + 1 + width);

        if (!new RegExp(`^[0-9a-fA-F]{${width}}$`).test(hex))
          {throw new Error("Invalid reserved nickname escape");}

        const lowered = literal(String.fromCharCode(Number.parseInt(hex, 16)))
          .charCodeAt(0)
          .toString(16)
          .padStart(width, "0");
        result += `\\${next}${lowered}`;
        index += width;
      } else {throw new Error("Unsupported reserved nickname escape");}

      continue;
    }

    if (quoted) {
      result += /[\\^$.*+?()[\]{}|/]/.test(unit) ? `\\${unit}` : literal(unit);
      continue;
    }

    if (unit === "[") {
      if (characterClass) {throw new Error("Unsupported reserved nickname class");}

      characterClass = true;
    } else if (unit === "]") {characterClass = false;}

    if (
      input.startsWith("&&", index) ||
      /[+*?}]\+/.test(input.slice(index, index + 2)) ||
      (input.startsWith("(?", index) &&
        !["(?:", "(?=", "(?!", "(?<=", "(?<!"].some((prefix) => input.startsWith(prefix, index)))
    )
      {throw new Error("Unsupported reserved nickname construct");}

    if (unit === "^" && !characterClass && flags.includes("m"))
      {result += "(?=[\\s\\S])(?:(?<![\\s\\S])|(?<=[\\n\\u0085\\u2028\\u2029])|(?<=\\r)(?!\\n))";}
    else if (unit === "$" && !characterClass && flags.includes("m"))
      {result += "(?=(?:\\r\\n|(?<!\\r)\\n|[\\r\\u0085\\u2028\\u2029])|(?![\\s\\S]))";}
    else if (unit === "." && !characterClass && !flags.includes("s"))
      {result += "[^\\n\\r\\u0085\\u2028\\u2029]";}
    else if (unit === "$" && !characterClass && !flags.includes("m"))
      {result += "(?=(?:\\r\\n|[\\n\\r\\u0085\\u2028\\u2029])?(?![\\s\\S]))";}
    else {result += literal(unit);}
  }

  if (result.length > 1000000) {throw new Error("Reserved nickname pattern exceeds bound");}

  new RegExp(result, flags);

  return { pattern: result, flags };
}
