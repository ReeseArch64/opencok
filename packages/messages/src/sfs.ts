import { SfsType as Type } from "@opencok/enums/sfs";

export { SfsType as Type } from "@opencok/enums/sfs";

export type Fields = Record<string, Value>;

export type Value = { type: Type; value: unknown };

export const sfs = {
  null: (): Value => ({ type: Type.Null, value: null }),
  bool: (value: boolean): Value => ({ type: Type.Bool, value }),
  byte: (value: number): Value => ({ type: Type.Byte, value }),
  short: (value: number): Value => ({ type: Type.Short, value }),
  int: (value: number): Value => ({ type: Type.Int, value }),
  long: (value: bigint | number | string): Value => {
    if (typeof value === "number" && !Number.isSafeInteger(value)) {throw new ProtocolError();}

    return { type: Type.Long, value: BigInt(value) };
  },
  double: (value: number): Value => ({ type: Type.Double, value }),
  string: (value: string): Value => ({ type: Type.String, value }),
  object: (value: Fields = {}): Value => ({ type: Type.Object, value }),
  array: (value: Value[] = []): Value => ({ type: Type.Array, value }),
};

export class ProtocolError extends Error {
  constructor() {
    super("Invalid or unsupported SFS packet");
  }
}

export function fields(value: Value | undefined): Fields {
  if (value?.type !== Type.Object) {throw new ProtocolError();}

  return value.value as Fields;
}

export function str(data: Fields, key: string, fallback?: string): string {
  const value = data[key];

  if (!value && fallback !== undefined) {return fallback;}

  if (value?.type !== Type.String) {throw new ProtocolError();}

  return value.value as string;
}

export function int(data: Fields, key: string, fallback?: number): number {
  const value = data[key];

  if (!value && fallback !== undefined) {return fallback;}

  if (value?.type !== Type.Int) {throw new ProtocolError();}

  return value.value as number;
}

const MAX_BYTES = 4 * 1024 * 1024;

const MAX_ITEMS = 32767;

const MAX_DEPTH = 32;

const arrayElement: Record<number, Type> = {
  [Type.BoolArray]: Type.Bool,
  [Type.ShortArray]: Type.Short,
  [Type.IntArray]: Type.Int,
  [Type.LongArray]: Type.Long,
  [Type.FloatArray]: Type.Float,
  [Type.DoubleArray]: Type.Double,
  [Type.StringArray]: Type.String,
};

class Reader {
  pos = 0;
  budget = 100000;

  constructor(readonly bytes: Buffer) {}

  take(count: number): Buffer {
    if (!Number.isInteger(count) || count < 0 || this.pos + count > this.bytes.length)
      {throw new ProtocolError();}

    const data = this.bytes.subarray(this.pos, this.pos + count);
    this.pos += count;

    return data;
  }

  count(): number {
    const count = this.take(2).readUInt16BE();

    if (count > MAX_ITEMS) {throw new ProtocolError();}

    return count;
  }

  string(): string {
    const data = this.take(this.count());

    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(data);
    } catch {
      throw new ProtocolError();
    }
  }

  read(depth = 0, tag?: Type): Value {
    if (depth > MAX_DEPTH || --this.budget < 0) {throw new ProtocolError();}

    const type = tag ?? this.take(1).readUInt8();
    let value: unknown;

    switch (type) {
      case Type.Null:
        value = null;
        break;
      case Type.Bool: {
        const flag = this.take(1).readUInt8();

        if (flag > 1) {throw new ProtocolError();}

        value = flag === 1;
        break;
      }
      case Type.Byte:
        value = this.take(1).readInt8();
        break;
      case Type.Short:
        value = this.take(2).readInt16BE();
        break;
      case Type.Int:
        value = this.take(4).readInt32BE();
        break;
      case Type.Long:
        value = this.take(8).readBigInt64BE();
        break;
      case Type.Float:
        value = this.take(4).readFloatBE();
        break;
      case Type.Double:
        value = this.take(8).readDoubleBE();
        break;
      case Type.String:
        value = this.string();
        break;
      case Type.Bytes:
        value = Buffer.from(this.take(this.take(4).readInt32BE()));
        break;
      case Type.Object: {
        const result: Fields = Object.create(null);
        const size = this.count();

        for (let i = 0; i < size; i++) {
          const key = this.string();

          if (Buffer.byteLength(key) > 255) {throw new ProtocolError();}

          if (Object.hasOwn(result, key)) {throw new ProtocolError();}

          result[key] = this.read(depth + 1);
        }

        value = result;
        break;
      }
      case Type.Array: {
        const result: Value[] = [];
        const size = this.count();

        for (let i = 0; i < size; i++) {result.push(this.read(depth + 1));}

        value = result;
        break;
      }
      default: {
        const element = arrayElement[type];

        if (element === undefined) {throw new ProtocolError();}

        const result: unknown[] = [];
        const size = this.count();

        for (let i = 0; i < size; i++) {result.push(this.read(depth + 1, element).value);}

        value = result;
      }
    }

    return { type, value };
  }
}

class Writer {
  chunks: Buffer[] = [];
  size = 0;
  budget = 100000;

  add(bytes: Buffer) {
    this.size += bytes.length;

    if (this.size > MAX_BYTES) {throw new ProtocolError();}

    this.chunks.push(bytes);
  }

  number(size: number, write: (buffer: Buffer) => void) {
    const buffer = Buffer.alloc(size);
    write(buffer);
    this.add(buffer);
  }

  count(count: number) {
    if (count > MAX_ITEMS) {throw new ProtocolError();}

    this.number(2, (b) => b.writeUInt16BE(count));
  }

  string(value: string) {
    const data = Buffer.from(value, "utf8");

    if (data.length > MAX_ITEMS) {throw new ProtocolError();}

    this.number(2, (b) => b.writeUInt16BE(data.length));
    this.add(data);
  }

  write(item: Value, depth = 0, tagged = true) {
    if (depth > MAX_DEPTH || --this.budget < 0) {throw new ProtocolError();}

    const { type, value } = item;

    if (tagged) {this.number(1, (b) => b.writeUInt8(type));}

    switch (type) {
      case Type.Null:
        break;
      case Type.Bool:
        this.number(1, (b) => b.writeUInt8(value ? 1 : 0));
        break;
      case Type.Byte:
        this.number(1, (b) => b.writeInt8(value as number));
        break;
      case Type.Short:
        this.number(2, (b) => b.writeInt16BE(value as number));
        break;
      case Type.Int:
        this.number(4, (b) => b.writeInt32BE(value as number));
        break;
      case Type.Long:
        this.number(8, (b) => b.writeBigInt64BE(value as bigint));
        break;
      case Type.Float:
        this.number(4, (b) => b.writeFloatBE(value as number));
        break;
      case Type.Double:
        this.number(8, (b) => b.writeDoubleBE(value as number));
        break;
      case Type.String:
        this.string(value as string);
        break;
      case Type.Bytes: {
        const bytes = value as Buffer;
        this.number(4, (b) => b.writeInt32BE(bytes.length));
        this.add(bytes);
        break;
      }
      case Type.Object: {
        const entries = Object.entries(value as Fields);
        this.count(entries.length);

        for (const [key, child] of entries) {
          if (Buffer.byteLength(key) > 255) {throw new ProtocolError();}

          this.string(key);
          this.write(child, depth + 1);
        }

        break;
      }
      case Type.Array: {
        const children = value as Value[];
        this.count(children.length);

        for (const child of children) {this.write(child, depth + 1);}

        break;
      }
      default: {
        const element = arrayElement[type];

        if (element === undefined) {throw new ProtocolError();}

        const children = value as unknown[];
        this.count(children.length);

        for (const child of children) {this.write({ type: element, value: child }, depth + 1, false);}
      }
    }
  }
}

export function encode(data: Fields): Buffer {
  const writer = new Writer();
  writer.write(sfs.object(data));

  return Buffer.concat(writer.chunks);
}

export function decode(bytes: Buffer): Fields {
  if (bytes.length > MAX_BYTES) {throw new ProtocolError();}

  const reader = new Reader(bytes);
  const result = fields(reader.read());

  if (reader.pos !== bytes.length) {throw new ProtocolError();}

  return result;
}

export function encodeArray(data: Value[]): Buffer {
  const writer = new Writer();
  writer.write(sfs.array(data));

  return Buffer.concat(writer.chunks);
}

export function decodeArray(bytes: Buffer): Value[] {
  if (bytes.length > MAX_BYTES) {throw new ProtocolError();}

  const reader = new Reader(bytes);
  const result = reader.read();

  if (result.type !== Type.Array || reader.pos !== bytes.length) {throw new ProtocolError();}

  return result.value as Value[];
}

export function envelope(controller: number, action: number, body: Fields): Fields {
  return { c: sfs.byte(controller), a: sfs.short(action), p: sfs.object(body) };
}

export function extension(command: string, body: Fields): Fields {
  return envelope(1, 13, { c: sfs.string(command), p: sfs.object(body) });
}
