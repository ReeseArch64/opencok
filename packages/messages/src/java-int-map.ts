import { ProtocolError } from "./sfs.ts";

type ClassName = "java.util.HashMap" | "java.lang.Integer" | "java.lang.Number";
type Handle =
  | { kind: "class"; name: ClassName }
  | { kind: "value"; value: string | number }
  | { kind: "map" };
const descriptors = {
  "java.util.HashMap": "0507dac1c31660d103000246000a6c6f6164466163746f724900097468726573686f6c64",
  "java.lang.Integer": "12e2a0a4f781873802000149000576616c7565",
  "java.lang.Number": "86ac951d0b94e08b020000",
} as const;

export function decodeJavaIntMap(data: Buffer): ReadonlyMap<string | null, number | null> | null {
  if (!Buffer.isBuffer(data) || data.length > 65535) throw new ProtocolError();
  let offset = 0;
  const handles: Handle[] = [];
  const invalid = (): never => {
    throw new ProtocolError();
  };
  const take = (length: number): Buffer => {
    if (!Number.isSafeInteger(length) || length < 0 || offset + length > data.length)
      return invalid();
    const bytes = data.subarray(offset, offset + length);
    offset += length;
    return bytes;
  };
  const byte = () => take(1)[0]!;
  const expect = (value: number) => {
    if (byte() !== value) invalid();
  };
  const add = (handle: Handle) => {
    if (handles.length >= 8196) invalid();
    handles.push(handle);
  };
  const reference = (): Handle => {
    const handle = handles[take(4).readUInt32BE() - 0x7e0000];
    if (!handle) return invalid();
    return handle;
  };
  const utf = (length = take(2).readUInt16BE()): string => {
    const bytes = take(length);
    let result = "";
    for (let i = 0; i < bytes.length;) {
      const first = bytes[i++]!;
      if (first > 0 && first < 128) result += String.fromCharCode(first);
      else if (first >= 0xc0 && first <= 0xef) {
        const second = bytes[i++];
        if (second === undefined || (second & 0xc0) !== 0x80) return invalid();
        let code: number;
        if (first < 0xe0) {
          code = ((first & 31) << 6) | (second & 63);
          if (code !== 0 && code < 128) return invalid();
        } else {
          const third = bytes[i++];
          if (third === undefined || (third & 0xc0) !== 0x80) return invalid();
          code = ((first & 15) << 12) | ((second & 63) << 6) | (third & 63);
          if (code < 2048) return invalid();
        }
        result += String.fromCharCode(code);
      } else return invalid();
    }
    return result;
  };
  const descriptor = (depth = 0): ClassName | null => {
    if (depth > 2) return invalid();
    const token = byte();
    if (token === 0x70) return null;
    if (token === 0x71) {
      const handle = reference();
      return handle.kind === "class" ? handle.name : invalid();
    }
    if (token !== 0x72) return invalid();
    const name = utf() as ClassName;
    if (!Object.hasOwn(descriptors, name)) return invalid();
    const expected = Buffer.from(descriptors[name], "hex");
    if (!take(expected.length).equals(expected)) return invalid();
    add({ kind: "class", name });
    expect(0x78);
    const parent = descriptor(depth + 1);
    if (parent !== (name === "java.lang.Integer" ? "java.lang.Number" : null)) return invalid();
    return name;
  };
  const value = (): string | number | null => {
    const token = byte();
    if (token === 0x70) return null;
    if (token === 0x71) {
      const handle = reference();
      return handle.kind === "value" ? handle.value : invalid();
    }
    if (token === 0x74 || token === 0x7c) {
      const length = token === 0x74 ? take(2).readUInt16BE() : Number(take(8).readBigUInt64BE());
      const decoded = utf(length);
      add({ kind: "value", value: decoded });
      return decoded;
    }
    if (token !== 0x73 || descriptor() !== "java.lang.Integer") return invalid();
    const decoded = take(4).readInt32BE();
    add({ kind: "value", value: decoded });
    return decoded;
  };
  if (!take(4).equals(Buffer.from("aced0005", "hex"))) return invalid();
  const root = byte();
  if (root === 0x70) {
    if (offset !== data.length) return invalid();
    return null;
  }
  if (root !== 0x73 || descriptor() !== "java.util.HashMap") return invalid();
  add({ kind: "map" });
  const loadFactor = take(4).readFloatBE();
  if (!(loadFactor > 0)) return invalid();
  take(4);
  const block = byte();
  const blockLength = block === 0x77 ? byte() : block === 0x7a ? take(4).readUInt32BE() : invalid();
  if (blockLength !== 8) return invalid();
  take(4);
  const size = take(4).readInt32BE();
  if (size < 0 || size > 4096) return invalid();
  const result = new Map<string | null, number | null>();
  for (let i = 0; i < size; i++) {
    const key = value();
    const count = value();
    if ((key !== null && typeof key !== "string") || (count !== null && typeof count !== "number"))
      return invalid();
    result.set(key, count);
  }
  expect(0x78);
  if (offset !== data.length) return invalid();
  return result;
}
