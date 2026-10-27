import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { parseWorldTerrain } from "../src/world-terrain";
import { terrainXml } from "./support/world-terrain";
const parse = (xml: string) => parseWorldTerrain(Buffer.from(xml));
test("normal authoring layers retain Source terrain ordinals, overlay offsets, order and fingerprint", () => {
  const base = Array.from({ length: 25 }, (_, index) => (index % 3) + 1),
    overlay = Array.from({ length: 25 }, (_, index) => (index % 2 ? 100 : 0)),
    xml = terrainXml(5, base, overlay),
    result = parse(xml);
  expect(result.size).toBe(5);
  expect(result.format).toBe("worldcreator-v2.normal.v1");
  expect([...result.grid]).toEqual(base.map((id) => id - 1));
  expect([...result.overlay]).toEqual(overlay.map((id) => (id === 100 ? 1 : 0)));
  expect(result.sourceHash).toBe(createHash("sha256").update(xml).digest("hex"));
  expect(parse(xml.replace('terrain="2,2,2,2"', 'terrain=",2,,1"')).grid).toEqual(result.grid);
  expect(parse(xml.replace('value="stop"', 'value="STOP"')).overlay.every((v) => v === 0)).toBe(
    true,
  );
});
test("XML admission rejects entities, external tilesets, unsupported encodings and malformed authoring data", () => {
  const xml = terrainXml();
  for (const invalid of [
    xml.replace("<map ", '<!DOCTYPE map SYSTEM "file:///missing"><map '),
    xml.replace('value="space"', 'value="&entity;"'),
    xml.replace('firstgid="1"', 'firstgid="1" source="outside.tsx"'),
    xml.replace('firstgid="99"', 'firstgid="100"'),
    xml.replace("<data>", '<data encoding="base64">'),
    xml.replace("<data>", '<data compression="gzip">'),
    xml.replace('value="space"', 'value="water"'),
    xml.replace('gid="3"', 'gid="4"'),
    xml.replace('terrain="2,2,2,2"', 'terrain="9,9,9,9"'),
    xml.replace('width="5"', 'width="4"'),
    xml.replace('gid="3"', 'gid="4294967295"'),
    xml.replace('<tile gid="3"/>', ""),
    xml.replace("</data>", '<tile gid="3"/></data>'),
    xml.replace("</map>", ""),
    xml.replace('width="5"', 'width="4001"'),
    xml.replace('value="space"', 'value="space" value="stop"'),
  ])
    expect(() => parse(invalid)).toThrow();
  expect(() => parseWorldTerrain(new Uint8Array([0xff]))).toThrow();
  expect(() => parseWorldTerrain(new Uint8Array())).toThrow();
});
