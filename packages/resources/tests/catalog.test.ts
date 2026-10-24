import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { gameplayCatalogs } from "../src/catalogs.ts";
import { createGameplayCatalog, repeatCatalogElements } from "../src/catalog.ts";
import { parseGameplayCatalog, parseRules, loadRules } from "../src/rules.ts";
import inventory from "../src/catalogs/inventory.json";

test("every XML catalog has a typed identifier and a matching readable implementation", async () => {
  expect(Object.values(GameplayCatalog).map(String).sort()).toEqual(
    inventory.map((entry) => entry.id).sort(),
  );
  const verified = new Set<string>();
  for (const entry of inventory) {
    expect(typeof gameplayCatalogs[entry.id as GameplayCatalog]).toBe("function");
    if (verified.has(entry.module)) continue;
    const document = await gameplayCatalogs[entry.id as GameplayCatalog]();
    const serialized = JSON.stringify(document);
    expect(Buffer.byteLength(serialized), entry.id).toBe(entry.documentBytes);
    expect(createHash("sha256").update(serialized).digest("hex"), entry.id).toBe(
      entry.documentSha256,
    );
    verified.add(entry.module);
    Bun.gc(true);
  }
}, 180000);

test("typed catalogs preserve literal values, grouping, order and repeated records", () => {
  const xml =
    '<database><Group id="first"><ItemSpec id="a" n="0007"/><ItemSpec id="a" n="last"/></Group><Group id="second"><ItemSpec id="b" text=" a &amp; b "/></Group></database>';
  const original = parseGameplayCatalog(xml);
  const catalog = createGameplayCatalog(original.ordered);
  expect(catalog.unordered).toEqual(original.unordered);
  expect([...parseRules(catalog, "setting")]).toEqual([...parseRules(xml, "setting")]);
  expect([...parseRules(catalog, "goods")]).toEqual([...parseRules(xml, "goods")]);
  expect(() => parseRules(catalog, "building")).toThrow("Invalid gameplay resource ID");
  expect(repeatCatalogElements(3, { tile: [], ":@": { gid: "0" } })).toHaveLength(3);
  expect(() => repeatCatalogElements(-1, { tile: [] })).toThrow();
});

test("records without IDs remain in the full catalog and are excluded from ordinary indexes", () => {
  const xml =
    '<database><ItemSpec effect="preserved"/><ItemSpec id=" "/><ItemSpec id="valid" value="007"/></database>';
  const catalog = createGameplayCatalog(parseGameplayCatalog(xml).ordered);
  expect((catalog.unordered.database as { ItemSpec: unknown[] }).ItemSpec).toHaveLength(3);
  expect([...parseRules(catalog, "status")]).toEqual([["valid", { id: "valid", value: "007" }]]);
  expect(parseRules('<database><ItemSpec value="ignored"/></database>', "goods").size).toBe(0);
});

test("bundled rules load for both realms and isolate mutable indexes", async () => {
  const first = await loadRules(undefined, 1);
  const second = await loadRules(undefined, 2);
  expect(first.kingdomId).toBe(1);
  expect(second.kingdomId).toBe(2);
  expect(first.buildings.size).toBeGreaterThan(0);
  const key = [...first.buildings.keys()][0];
  if (!key) throw new Error("Missing bundled building ID");
  const original = second.buildings.get(key);
  first.buildings.set(key, { id: key, edited: "synthetic" });
  expect(second.buildings.get(key)).toEqual(original);
  expect(second.buildings.get(key)).not.toEqual(first.buildings.get(key));
});
