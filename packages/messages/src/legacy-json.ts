import { legacyJsonNumber } from "./legacy-number.ts";
import { ProtocolError, sfs, Type, type Fields, type Value } from "./sfs.ts";

export class LegacyJsonError extends Error {
  constructor() {
    super("Invalid stored JSON object");
  }
}

function trim(value: string): string {
  let start = 0;
  let end = value.length;
  while (start < end && value.charCodeAt(start) <= 32) start++;
  while (end > start && value.charCodeAt(end - 1) <= 32) end--;
  return value.slice(start, end);
}
const excluded = new Set(["class", "declaringClass", "metaClass"]);
const delimiters = new Set(',:]}/\\"[{;=#');

class Parser {
  position = 0;
  remaining = 100000;
  constructor(readonly source: string) {}
  fail(): never {
    throw new LegacyJsonError();
  }
  clean(): string {
    for (;;) {
      const char = this.source[this.position] ?? "";
      if (!char || char === "\0") return "";
      if (char.charCodeAt(0) <= 32) {
        this.position++;
        continue;
      }
      if (char === "#" || this.source.startsWith("//", this.position)) {
        while (this.position < this.source.length && !/[\r\n\0]/.test(this.source[this.position]!))
          this.position++;
        continue;
      }
      if (this.source.startsWith("/*", this.position)) {
        const end = this.source.indexOf("*/", this.position + 2);
        if (end < 0) return this.fail();
        this.position = end + 2;
        continue;
      }
      return char;
    }
  }
  quoted(): string {
    const quote = this.source[this.position++];
    let result = "";
    while (this.position < this.source.length) {
      let char = this.source[this.position++]!;
      if (char === quote) {
        if (!result.isWellFormed()) throw new ProtocolError();
        return result;
      }
      if (char === "\0" || char === "\r" || char === "\n") return this.fail();
      if (char === "\\") {
        char = this.source[this.position++] ?? "";
        const escape: Record<string, string> = { b: "\b", t: "\t", n: "\n", f: "\f", r: "\r" };
        if (char === "u" || char === "x") {
          const size = char === "u" ? 4 : 2;
          const hex = this.source.slice(this.position, this.position + size);
          if (hex.length !== size || !/^[\da-f]+$/i.test(hex)) return this.fail();
          result += String.fromCharCode(Number.parseInt(hex, 16));
          this.position += size;
        } else result += escape[char] ?? char;
      } else result += char;
    }
    return this.fail();
  }
  value(depth: number): Value {
    if (depth > 32 || --this.remaining < 0) throw new ProtocolError();
    const char = this.clean();
    if (char === '"' || char === "'") return sfs.string(this.quoted());
    if (char === "{") return sfs.object(this.object(depth));
    if (char === "[") return sfs.array(this.array(depth));
    const start = this.position;
    while (this.position < this.source.length) {
      const current = this.source[this.position]!;
      if (current.charCodeAt(0) < 32 || delimiters.has(current)) break;
      this.position++;
    }
    const token = trim(this.source.slice(start, this.position));
    if (!token) return this.fail();
    if (/^true$/i.test(token)) return sfs.bool(true);
    if (/^false$/i.test(token)) return sfs.bool(false);
    if (token === "null") return sfs.null();
    if (/^[\d.+-]/.test(token)) return legacyJsonNumber(token) ?? this.fail();
    if (/^function\s*\(/.test(token)) throw new ProtocolError();
    if (",[]{}".includes(this.source[this.position] ?? "\0")) return this.fail();
    return sfs.string(token);
  }
  array(depth: number): Value[] {
    this.position++;
    const result: Value[] = [];
    if (this.clean() === "]") {
      this.position++;
      return result;
    }
    for (;;) {
      if (this.clean() === ",") throw new ProtocolError();
      const value = this.value(depth + 1);
      if (value.type === Type.String && /^function\s*\(/.test(value.value as string))
        throw new ProtocolError();
      result.push(value);
      if (result.length > 32767) throw new ProtocolError();
      const delimiter = this.clean();
      this.position++;
      if (delimiter === "]") return result;
      if (delimiter !== "," && delimiter !== ";") return this.fail();
      if (this.clean() === "]") {
        this.position++;
        return result;
      }
    }
  }
  object(depth: number): Fields {
    this.position++;
    const result: Fields = Object.create(null);
    let size = 0;
    for (;;) {
      if (this.clean() === "}") {
        this.position++;
        return result;
      }
      const keyValue = this.value(depth + 1);
      if (
        keyValue.type === Type.Object ||
        keyValue.type === Type.Array ||
        keyValue.type === Type.Double
      )
        throw new ProtocolError();
      const key = String(keyValue.value);
      if (Buffer.byteLength(key) > 255) throw new ProtocolError();
      const delimiter = this.clean();
      this.position++;
      if (delimiter === "=") {
        if (this.source[this.position] === ">") this.position++;
      } else if (delimiter !== ":") return this.fail();
      const directlyQuoted =
        this.source[this.position] === '"' || this.source[this.position] === "'";
      let value = this.value(depth + 1);
      if (value.type === Type.String && /^function\s*\(/.test(value.value as string)) {
        if (!directlyQuoted) throw new ProtocolError();
        value = sfs.string(`"${value.value}"`);
      }
      if (!directlyQuoted && value.type === Type.String) {
        const string = value.value as string;
        if (string === "null") value = sfs.null();
        else if (
          (string.startsWith("{") && string.endsWith("}")) ||
          (string.startsWith("[") && string.endsWith("]"))
        ) {
          const nested = new Parser(string);
          nested.remaining = this.remaining;
          try {
            value = nested.value(depth + 1);
          } catch (error) {
            if (!(error instanceof LegacyJsonError)) throw error;
          }
          this.remaining = nested.remaining;
        }
      }
      if (!excluded.has(key)) {
        const previous = result[key];
        if (previous?.type === Type.Array) (previous.value as Value[]).push(value);
        else if (previous) {
          let first = previous;
          if (first.type === Type.String) {
            const raw = first.value as string;
            if (raw === "null") first = sfs.null();
            else if (
              (raw.startsWith("{") && raw.endsWith("}")) ||
              (raw.startsWith("[") && raw.endsWith("]"))
            ) {
              const nested = new Parser(raw);
              nested.remaining = this.remaining;
              try {
                first = nested.value(depth + 1);
              } catch (error) {
                if (!(error instanceof LegacyJsonError)) throw error;
              }
              this.remaining = nested.remaining;
            }
          }
          result[key] = sfs.array([first, value]);
        } else {
          result[key] = value;
          if (++size > 32767) throw new ProtocolError();
        }
      }
      const next = this.clean();
      this.position++;
      if (next === "}") return result;
      if (next !== "," && next !== ";") return this.fail();
    }
  }
}

export function decodeLegacyJsonObject(source: string): Fields {
  if (typeof source !== "string" || Buffer.byteLength(source) > 4 * 1024 * 1024)
    throw new ProtocolError();
  const text = trim(source);
  if (/^null[^\r\n]*$/.test(text)) return Object.create(null);
  const parser = new Parser(text);
  if (parser.clean() !== "{") throw new LegacyJsonError();
  return parser.object(0);
}
