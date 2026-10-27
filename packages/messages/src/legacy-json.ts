import { legacyObjectOrder } from "./legacy-object-order.ts";
import { legacyHexCodeUnit, legacyJsonNumber } from "./legacy-number.ts";
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

const parsedKeys = new WeakMap<Fields, string[]>();

const convertedKeys = new WeakMap<Fields, string[]>();

const excluded = new Set(["class", "declaringClass", "metaClass"]);

const unrepresentable: Value = { type: Type.Null, value: Symbol("unrepresentable JSON value") };

const functionHeader = /^function ?\([^\n\r\u0085\u2028\u2029]*?\)(?![\s\S])/;

const functionValue =
  /^function ?\([^\n\r\u0085\u2028\u2029]*?\)[ \n\t]*\{[^\n\r\u0085\u2028\u2029]*?\}(?![\s\S])/;

const mayBeJson = (value: string) =>
  value === "null" ||
  (value.startsWith("{") && value.endsWith("}")) ||
  (value.startsWith("[") && value.endsWith("]"));

const wireText = (value: string) =>
  value.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "?");

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

      if (char === quote) return result;

      if (char === "\0" || char === "\r" || char === "\n") return this.fail();

      if (char === "\\") {
        char = this.source[this.position++] ?? "";
        const escape: Record<string, string> = { b: "\b", t: "\t", n: "\n", f: "\f", r: "\r" };

        if (char === "u" || char === "x") {
          const size = char === "u" ? 4 : 2;
          const hex = this.source.slice(this.position, this.position + size);
          const code = legacyHexCodeUnit(hex);

          if (hex.length !== size || code === undefined) return this.fail();

          result += String.fromCharCode(code);
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

    if (functionHeader.test(token) || functionValue.test(token)) return sfs.string(token);

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
      const hole = this.clean() === ",";

      if (hole && --this.remaining < 0) throw new ProtocolError();

      let value = hole ? unrepresentable : this.value(depth + 1);

      if (value.type === Type.String) {
        if (functionHeader.test(value.value as string)) value = this.functionBody();
        else if (functionValue.test(value.value as string)) value = unrepresentable;
        else if (mayBeJson(value.value as string)) value = sfs.string(`"${value.value}"`);
      }

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

  functionBody(): Value {
    const start = this.position;
    let braces = 0;

    do {
      const char = this.source[this.position++];

      if (char === undefined || char === "\0") return this.fail();

      if (char === "{") braces++;

      if (char === "}") braces--;
    } while (braces !== 0);

    if (this.position - start < 2) return this.fail();

    return unrepresentable;
  }

  object(depth: number): Fields {
    this.position++;
    const result: Fields = Object.create(null);
    const keys: string[] = [];
    parsedKeys.set(result, keys);
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

      if (Buffer.byteLength(wireText(key)) > 255) throw new ProtocolError();

      const delimiter = this.clean();
      this.position++;

      if (delimiter === "=") {
        if (this.source[this.position] === ">") this.position++;
      } else if (delimiter !== ":") return this.fail();

      const directlyQuoted =
        this.source[this.position] === '"' || this.source[this.position] === "'";
      let value = this.value(depth + 1);
      const body =
        !directlyQuoted && value.type === Type.String && functionHeader.test(value.value as string);

      if (body) value = this.functionBody();
      else if (value.type === Type.String && functionValue.test(value.value as string))
        value = directlyQuoted ? sfs.string(`"${value.value}"`) : unrepresentable;

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

      if (!excluded.has(key) || body) {
        const previous = result[key];

        if (
          previous &&
          directlyQuoted &&
          value.type === Type.String &&
          mayBeJson(value.value as string)
        )
          value = sfs.string(`"${value.value}"`);

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
          keys.push(key);

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

function convert(value: Value, depth = 0): Value {
  if (depth > 32) throw new ProtocolError();

  if (value === unrepresentable) throw new LegacyJsonError();

  if (value.type === Type.String) return sfs.string(wireText(value.value as string));

  if (value.type === Type.Array)
    return sfs.array((value.value as Value[]).map((item) => convert(item, depth + 1)));

  if (value.type !== Type.Object) return value;

  const object: Fields = Object.create(null);
  const source = value.value as Fields;
  const keys = parsedKeys.get(source) ?? Object.keys(source);

  for (const key of keys) {
    const item = source[key]!;
    const normalized = wireText(key);

    if (Object.hasOwn(object, normalized)) throw new ProtocolError();

    object[normalized] = convert(item, depth + 1);
  }

  convertedKeys.set(object, legacyObjectOrder(keys).map(wireText));

  return sfs.object(object);
}

export function legacyJsonEntries(object: Fields): [string, Value][] {
  return (convertedKeys.get(object) ?? Object.keys(object))
    .filter((key) => Object.hasOwn(object, key))
    .map((key) => [key, object[key]!]);
}

export function decodeLegacyJsonObject(source: string): Fields {
  if (typeof source !== "string" || Buffer.byteLength(source) > 4 * 1024 * 1024)
    throw new ProtocolError();

  const text = trim(source);

  if (/^null[^\r\n]*$/.test(text)) return Object.create(null);

  const parser = new Parser(text);

  if (parser.clean() !== "{") throw new LegacyJsonError();

  return convert(sfs.object(parser.object(0))).value as Fields;
}

export function decodeLegacyJsonArray(source: string): Value[] {
  if (typeof source !== "string" || Buffer.byteLength(source) > 4 * 1024 * 1024)
    throw new ProtocolError();

  const parser = new Parser(trim(source));

  if (parser.clean() !== "[") throw new LegacyJsonError();

  return convert(sfs.array(parser.array(0))).value as Value[];
}

export function roundTripLegacyIntegerObject(fields: Fields): Fields {
  const entries = Object.entries(fields);

  if (entries.length > 32767) throw new ProtocolError();

  const parts: string[] = [];
  let bytes = 2;

  for (const [key, field] of entries) {
    if (key === "null") throw new LegacyJsonError();

    if (excluded.has(key)) continue;

    let value: string;

    if (field.type === Type.String && typeof field.value === "string") {
      value = functionValue.test(field.value) ? field.value : JSON.stringify(field.value);
    } else if (
      field.type === Type.Int &&
      typeof field.value === "number" &&
      Number.isInteger(field.value) &&
      field.value >= -2147483648 &&
      field.value <= 2147483647
    ) {
      value = String(field.value);
    } else if (
      field.type === Type.Long &&
      typeof field.value === "bigint" &&
      BigInt.asIntN(64, field.value) === field.value
    ) {
      value = String(field.value);
    } else throw new ProtocolError();

    const part = `${JSON.stringify(key)}:${value}`;
    bytes += Buffer.byteLength(part) + (parts.length ? 1 : 0);

    if (bytes > 4 * 1024 * 1024) throw new ProtocolError();

    parts.push(part);
  }

  return decodeLegacyJsonObject(`{${parts.join(",")}}`);
}

export function roundTripLegacyObject(input: Fields): Fields {
  let count = 0;
  const serialize = (value: Value, depth: number): string => {
    if (depth > 32 || ++count > 100000) throw new ProtocolError();

    if (value.type === Type.Null) return "null";

    if (value.type === Type.Bool && typeof value.value === "boolean") return String(value.value);

    if (value.type === Type.String && typeof value.value === "string")
      return functionValue.test(value.value) ? value.value : JSON.stringify(value.value);

    if (
      value.type === Type.Long &&
      typeof value.value === "bigint" &&
      BigInt.asIntN(64, value.value) === value.value
    )
      return String(value.value);

    if (
      [Type.Byte, Type.Short, Type.Int, Type.Float, Type.Double].includes(value.type) &&
      typeof value.value === "number" &&
      Number.isFinite(value.value)
    ) {
      const number = value.type === Type.Float ? Math.fround(value.value) : value.value;

      if (!Number.isFinite(number)) throw new ProtocolError();

      if ([Type.Byte, Type.Short, Type.Int].includes(value.type)) {
        const bits = value.type === Type.Byte ? 8 : value.type === Type.Short ? 16 : 32;

        if (!Number.isInteger(number) || number < -(2 ** (bits - 1)) || number >= 2 ** (bits - 1))
          throw new ProtocolError();
      } else if (Math.abs(number) >= 1e7 || (number !== 0 && Math.abs(number) < 1e-3)) {
        return number.toExponential().replace("e+", "E").replace("e", "E");
      }

      return String(number);
    }

    if (value.type === Type.Array && Array.isArray(value.value))
      return `[${(value.value as Value[]).map((entry) => serialize(entry, depth + 1)).join(",")}]`;

    if (
      value.type === Type.Object &&
      value.value &&
      typeof value.value === "object" &&
      !Array.isArray(value.value)
    )
      return `{${Object.entries(value.value as Fields)
        .filter(([key]) => !excluded.has(key))
        .map(([key, entry]) => {
          if (key === "null") throw new LegacyJsonError();

          return `${JSON.stringify(key)}:${serialize(entry, depth + 1)}`;
        })
        .join(",")}}`;

    throw new ProtocolError();
  };
  const json = serialize(sfs.object(input), 0);

  if (Buffer.byteLength(json) > 4 * 1024 * 1024) throw new ProtocolError();

  return decodeLegacyJsonObject(json);
}
