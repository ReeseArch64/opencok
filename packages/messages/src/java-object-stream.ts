import { ProtocolError } from "./sfs.ts";

type Field = { name: string; type: string; signature?: string };
export interface JavaClass {
  kind: "class";
  name: string;
  uid: bigint;
  flags: number;
  fields: Field[];
  parent: JavaClass | null;
  complete: boolean;
}
export interface JavaObject {
  kind: "object";
  descriptor: JavaClass;
  slots: Map<JavaClass, { fields: Map<string, JavaValue>; custom: JavaValue[] }>;
}
export type JavaValue =
  | null
  | string
  | number
  | bigint
  | boolean
  | JavaObject
  | { kind: "array"; descriptor: JavaClass; values: JavaValue[] }
  | { kind: "enum"; descriptor: JavaClass; name: string }
  | { kind: "class-value"; descriptor: JavaClass }
  | { kind: "block"; bytes: Buffer };

export function decodeJavaObjectStream(bytes: Buffer): JavaValue {
  if (!Buffer.isBuffer(bytes) || bytes.length > 65535) throw new ProtocolError();
  let offset = 0;
  let budget = 32768;
  const handles: (JavaClass | JavaValue)[] = [];
  const invalid = (): never => {
    throw new ProtocolError();
  };
  const take = (size: number): Buffer => {
    if (!Number.isSafeInteger(size) || size < 0 || offset + size > bytes.length) return invalid();
    const value = bytes.subarray(offset, offset + size);
    offset += size;
    return value;
  };
  const byte = () => take(1)[0]!;
  const add = (value: JavaClass | JavaValue) => {
    if (handles.length >= 16384) invalid();
    handles.push(value);
  };
  const reference = (): JavaClass | JavaValue => {
    const index = take(4).readUInt32BE() - 0x7e0000;
    if (index < 0 || index >= handles.length) return invalid();
    return handles[index]!;
  };
  const utf = (size = take(2).readUInt16BE()): string => {
    const encoded = take(size);
    let value = "";
    for (let i = 0; i < encoded.length;) {
      const first = encoded[i++]!;
      if (first > 0 && first < 128) value += String.fromCharCode(first);
      else if (first >= 0xc0 && first <= 0xef) {
        const second = encoded[i++];
        if (second === undefined || (second & 0xc0) !== 0x80) return invalid();
        let code: number;
        if (first < 0xe0) {
          code = ((first & 31) << 6) | (second & 63);
          if (code !== 0 && code < 128) return invalid();
        } else {
          const third = encoded[i++];
          if (third === undefined || (third & 0xc0) !== 0x80) return invalid();
          code = ((first & 15) << 12) | ((second & 63) << 6) | (third & 63);
          if (code < 2048) return invalid();
        }
        value += String.fromCharCode(code);
      } else return invalid();
    }
    return value;
  };
  const guard = (depth: number) => {
    if (depth > 32 || --budget < 0) invalid();
  };
  const annotation = (depth: number): JavaValue[] => {
    const values: JavaValue[] = [];
    while (bytes[offset] !== 0x78) {
      if (values.length >= 8192) invalid();
      values.push(content(depth + 1, true));
    }
    byte();
    return values;
  };
  const descriptor = (depth: number): JavaClass | null => {
    guard(depth);
    const token = byte();
    if (token === 0x70) return null;
    if (token === 0x71) {
      const value = reference();
      if (!value || typeof value !== "object" || value.kind !== "class" || !value.complete)
        return invalid();
      return value;
    }
    if (token !== 0x72) return invalid();
    const name = utf();
    if (!name || name.length > 1024) return invalid();
    const uid = take(8).readBigInt64BE();
    const result: JavaClass = {
      kind: "class",
      name,
      uid,
      flags: 0,
      fields: [],
      parent: null,
      complete: false,
    };
    add(result);
    result.flags = byte();
    if (![2, 3, 18].includes(result.flags)) return invalid();
    const count = take(2).readUInt16BE();
    if (count > 256 || (result.flags === 18 && (count !== 0 || uid !== 0n))) return invalid();
    const names = new Set<string>();
    for (let i = 0; i < count; i++) {
      const type = String.fromCharCode(byte());
      const fieldName = utf();
      if (!"BCDFIJSZL[".includes(type) || !fieldName || names.has(fieldName)) return invalid();
      names.add(fieldName);
      const field: Field = { name: fieldName, type };
      if (type === "L" || type === "[") {
        const signature = content(depth + 1);
        if (typeof signature !== "string" || signature[0] !== type) return invalid();
        field.signature = signature;
      }
      result.fields.push(field);
    }
    annotation(depth);
    result.parent = descriptor(depth + 1);
    result.complete = true;
    return result;
  };
  const primitive = (type: string): JavaValue => {
    switch (type) {
      case "B":
        return take(1).readInt8();
      case "C":
        return take(2).readUInt16BE();
      case "D":
        return take(8).readDoubleBE();
      case "F":
        return take(4).readFloatBE();
      case "I":
        return take(4).readInt32BE();
      case "J":
        return take(8).readBigInt64BE();
      case "S":
        return take(2).readInt16BE();
      case "Z": {
        const value = byte();
        if (value > 1) return invalid();
        return value === 1;
      }
      default:
        return invalid();
    }
  };
  const content = (depth: number, blocks = false): JavaValue => {
    guard(depth);
    const token = byte();
    if (token === 0x70) return null;
    if (token === 0x71) {
      const value = reference();
      if (value && typeof value === "object" && value.kind === "class") return invalid();
      return value as JavaValue;
    }
    if (token === 0x74 || token === 0x7c) {
      const size = token === 0x74 ? take(2).readUInt16BE() : Number(take(8).readBigUInt64BE());
      const value = utf(size);
      add(value);
      return value;
    }
    if (blocks && (token === 0x77 || token === 0x7a)) {
      const size = token === 0x77 ? byte() : take(4).readUInt32BE();
      return { kind: "block", bytes: Buffer.from(take(size)) };
    }
    if (![0x73, 0x75, 0x76, 0x7e].includes(token)) return invalid();
    const type = descriptor(depth + 1);
    if (!type) return invalid();
    if (token === 0x76) {
      const value: JavaValue = { kind: "class-value", descriptor: type };
      add(value);
      return value;
    }
    if (token === 0x7e) {
      if (type.flags !== 18) return invalid();
      const value: JavaValue = { kind: "enum", descriptor: type, name: "" };
      add(value);
      const name = content(depth + 1);
      if (typeof name !== "string") return invalid();
      value.name = name;
      return value;
    }
    if (token === 0x75) {
      if (!type.name.startsWith("[") || type.flags !== 2 || type.fields.length || type.parent)
        return invalid();
      const value: JavaValue = { kind: "array", descriptor: type, values: [] };
      add(value);
      const length = take(4).readInt32BE();
      if (length < 0 || length > (type.name === "[B" ? 65535 : 4096)) return invalid();
      const element = type.name[1]!;
      for (let i = 0; i < length; i++) {
        value.values.push(
          element === "L" || element === "[" ? content(depth + 1) : primitive(element),
        );
      }
      return value;
    }
    if (type.flags === 18 || type.name.startsWith("[")) return invalid();
    const value: JavaObject = { kind: "object", descriptor: type, slots: new Map() };
    add(value);
    const chain: JavaClass[] = [];
    for (let current: JavaClass | null = type; current; current = current.parent) {
      if (chain.length >= 32 || chain.includes(current) || current.flags === 18) return invalid();
      chain.push(current);
    }
    for (const current of chain.reverse()) {
      const fields = new Map<string, JavaValue>();
      for (const field of current.fields)
        fields.set(
          field.name,
          field.type === "L" || field.type === "[" ? content(depth + 1) : primitive(field.type),
        );
      value.slots.set(current, { fields, custom: current.flags === 3 ? annotation(depth) : [] });
    }
    return value;
  };
  if (!take(4).equals(Buffer.from("aced0005", "hex"))) return invalid();
  const result = content(0);
  if (offset !== bytes.length) return invalid();
  return result;
}
