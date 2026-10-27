import { inflateSync } from "node:zlib";
import { decode, encode, ProtocolError, type Fields } from "./sfs.ts";

export const MAX_FRAME = 1024 * 1024;

export const MAX_INFLATED = 4 * MAX_FRAME;

export function frame(data: Fields): Buffer {
  const bytes = encode(data);
  const header = Buffer.alloc(bytes.length > 65535 ? 5 : 3);
  header[0] = bytes.length > 65535 ? 0x88 : 0x80;

  if (header.length === 5) {header.writeUInt32BE(bytes.length, 1);}
  else {header.writeUInt16BE(bytes.length, 1);}

  return Buffer.concat([header, bytes]);
}

export class FrameReader {
  private readonly header = Buffer.alloc(5);
  private headerUsed = 0;
  private headerSize = 0;
  private body?: Buffer;
  private bodyUsed = 0;

  feed(chunk: Buffer): Fields[] {
    const packets: Fields[] = [];
    let offset = 0;

    while (offset < chunk.length) {
      if (this.headerUsed === 0) {
        const flags = chunk[offset++]!;

        if (![0x80, 0x88, 0xa0, 0xa8].includes(flags)) {throw new ProtocolError();}

        this.header[0] = flags;
        this.headerUsed = 1;
        this.headerSize = flags & 8 ? 5 : 3;
      }

      if (this.headerUsed < this.headerSize) {
        const count = Math.min(this.headerSize - this.headerUsed, chunk.length - offset);
        chunk.copy(this.header, this.headerUsed, offset, offset + count);
        this.headerUsed += count;
        offset += count;

        if (this.headerUsed < this.headerSize) {break;}
      }

      if (!this.body) {
        const size =
          this.headerSize === 5 ? this.header.readUInt32BE(1) : this.header.readUInt16BE(1);

        if (size < 3 || size > MAX_FRAME) {throw new ProtocolError();}

        this.body = Buffer.alloc(size);
        this.bodyUsed = 0;
      }

      const count = Math.min(this.body.length - this.bodyUsed, chunk.length - offset);
      chunk.copy(this.body, this.bodyUsed, offset, offset + count);
      this.bodyUsed += count;
      offset += count;

      if (this.bodyUsed < this.body.length) {break;}

      let body = this.body;

      if (this.header[0]! & 0x20) {
        try {
          body = inflateSync(body, { maxOutputLength: MAX_INFLATED });
        } catch {
          throw new ProtocolError();
        }
      }

      packets.push(decode(body));

      if (packets.length > 64) {throw new ProtocolError();}

      this.headerUsed = 0;
      this.body = undefined;
      this.bodyUsed = 0;
    }

    return packets;
  }
}
