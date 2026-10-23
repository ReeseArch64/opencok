import { describe, expect, test } from "bun:test";
import { deflateSync } from "node:zlib";
import { decode, encode, envelope, fields, ProtocolError, sfs, Type } from "@opencok/messages/sfs";
import { frame, FrameReader, MAX_FRAME, MAX_INFLATED } from "@opencok/messages/frame";

describe("SFS compatibility boundary", () => {
  test("fixed big-endian object fixture", () => {
    const bytes = Buffer.from("120001000178040000002a", "hex");
    expect(decode(bytes).x).toEqual(sfs.int(42));
    expect(encode({ x: sfs.int(42) })).toEqual(bytes);
  });
  test("all supported tags retain types, signed longs and nested values", () => {
    const input = {
      null: sfs.null(),
      boolean: sfs.bool(true),
      byte: sfs.byte(-128),
      short: sfs.short(-32768),
      int: sfs.int(-2147483648),
      min: sfs.long(-9223372036854775808n),
      max: sfs.long(9223372036854775807n),
      float: { type: Type.Float, value: 1.25 },
      double: sfs.double(-0.125),
      string: sfs.string("ação 城 🏰"),
      nested: sfs.object({
        array: sfs.array([sfs.null(), sfs.object({ value: sfs.long(9007199254740993n) })]),
      }),
      bytes: { type: Type.Bytes, value: Buffer.from([0, 128, 255]) },
      booleans: { type: Type.BoolArray, value: [true, false] },
      shorts: { type: Type.ShortArray, value: [-1, 32767] },
      ints: { type: Type.IntArray, value: [-1, 2147483647] },
      longs: { type: Type.LongArray, value: [0n, 9223372036854775807n] },
      floats: { type: Type.FloatArray, value: [0.5, -1.5] },
      doubles: { type: Type.DoubleArray, value: [1.25, -0.25] },
      strings: { type: Type.StringArray, value: ["", "cidade"] },
    };
    expect(decode(encode(input))).toEqual(input);
  });
  test("truncations, duplicate keys, unsupported types and oversized strings fail", () => {
    const bytes = encode({ x: sfs.string("city") });
    for (let i = 0; i < bytes.length; i++) expect(() => decode(bytes.subarray(0, i))).toThrow();
    expect(() => decode(Buffer.concat([bytes, Buffer.from([0])]))).toThrow();
    expect(() => decode(Buffer.from("1200020001780000017800", "hex"))).toThrow();
    expect(() => decode(Buffer.from("12000100017813", "hex"))).toThrow();
    expect(() => encode({ x: sfs.string("x".repeat(32768)) })).toThrow();
    expect(() => encode({ ["x".repeat(256)]: sfs.int(1) })).toThrow();
    expect(() => sfs.long(Number.MAX_SAFE_INTEGER + 1)).toThrow();
    let value = sfs.object();
    for (let i = 0; i < 40; i++) value = sfs.object({ child: value });
    expect(() => encode(fields(value))).toThrow();
  });
  test("TCP fragmentation and concatenation preserve packet order", () => {
    const a = envelope(0, 0, { api: sfs.string("1.7.1") });
    const b = envelope(1, 13, { c: sfs.string("build.info") });
    const data = Buffer.concat([frame(a), frame(b)]);
    const reader = new FrameReader();
    const packets = [];
    for (const byte of data) packets.push(...reader.feed(Buffer.from([byte])));
    expect(packets).toEqual([a, b]);
    expect(new FrameReader().feed(data)).toEqual([a, b]);
  });
  test("zlib frames, length limits, encryption flags and decompression bombs", () => {
    const packet = envelope(0, 0, { api: sfs.string("1.7.1") });
    const zip = deflateSync(encode(packet));
    const header = Buffer.alloc(3);
    header[0] = 0xa0;
    header.writeUInt16BE(zip.length, 1);
    expect(new FrameReader().feed(Buffer.concat([header, zip]))).toEqual([packet]);
    const huge = Buffer.alloc(5);
    huge[0] = 0x88;
    huge.writeUInt32BE(MAX_FRAME + 1, 1);
    expect(() => new FrameReader().feed(huge)).toThrow(ProtocolError);
    expect(() => new FrameReader().feed(Buffer.from([0xc0, 0, 3, 18, 0, 0]))).toThrow();
    const bomb = deflateSync(Buffer.alloc(MAX_INFLATED + 1));
    header.writeUInt16BE(bomb.length, 1);
    expect(() => new FrameReader().feed(Buffer.concat([header, bomb]))).toThrow();
  });
});
