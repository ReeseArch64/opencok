import { inflateSync } from "node:zlib";

export function mediaFilename(item) {
  return `${item.id}${item.category === "tropas" ? "-full" : ""}.png`;
}

export function validateTroopArtwork(item, png) {
  if (item.category !== "tropas" || item.source === null) return;
  const fail = (reason) => {
    throw new Error(`Invalid troop artwork ${item.id}: ${reason}`);
  };
  if (/_(small|head)\.png$/i.test(item.source))
    fail("use full-body artwork instead of a thumbnail");
  if (!png.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) fail("expected PNG");
  if (png.length < 33 || png[24] !== 8 || png[25] !== 6 || png[28] !== 0) {
    fail("expected a non-interlaced 8-bit RGBA PNG");
  }
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const chunks = [];
  for (let offset = 8; offset < png.length;) {
    if (offset + 12 > png.length) fail("truncated PNG chunk");
    const length = png.readUInt32BE(offset);
    if (offset + length + 12 > png.length) fail("truncated PNG chunk");
    if (png.toString("ascii", offset + 4, offset + 8) === "IDAT") {
      chunks.push(png.subarray(offset + 8, offset + 8 + length));
    }
    offset += length + 12;
  }
  const stride = width * 4;
  const expectedSize = (stride + 1) * height;
  if (!width || !height || expectedSize > 100_000_000) fail("invalid dimensions");
  const raw = inflateSync(Buffer.concat(chunks), { maxOutputLength: expectedSize });
  if (raw.length !== expectedSize) fail("invalid pixel data");
  let previous = new Uint8Array(stride);
  let transparent = false;
  let visible = false;
  for (let y = 0; y < height; y++) {
    const start = y * (stride + 1);
    const filter = raw[start];
    if (filter > 4) fail("invalid PNG filter");
    const row = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) {
      const left = x >= 4 ? row[x - 4] : 0;
      const up = previous[x];
      const corner = x >= 4 ? previous[x - 4] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      if (filter === 2) predictor = up;
      if (filter === 3) predictor = Math.floor((left + up) / 2);
      if (filter === 4) {
        const p = left + up - corner;
        const a = Math.abs(p - left);
        const b = Math.abs(p - up);
        const c = Math.abs(p - corner);
        predictor = a <= b && a <= c ? left : b <= c ? up : corner;
      }
      row[x] = (raw[start + 1 + x] + predictor) & 255;
      if (x % 4 === 3) {
        transparent ||= row[x] === 0;
        visible ||= row[x] > 0;
      }
    }
    previous = row;
  }
  if (!transparent) fail("remove the opaque background");
  if (!visible) fail("the artwork is empty");
}
