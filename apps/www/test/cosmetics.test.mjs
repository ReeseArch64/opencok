import { expect, test } from "bun:test";
import { classifyCosmetic, skinGroups } from "../src/lib/cosmetics.mjs";
import gameSkins from "../../../packages/resources/tests/fixtures/appearance-catalog.json";
import records from "../src/data/catalog.json";
import { catalog as statusCatalog } from "../../../packages/resources/src/catalogs/data/status.ts";
import { records as lordImages } from "../../../packages/resources/src/catalogs/data/lord_image.records0.ts";
import { matchesItem } from "../src/lib/search.mjs";

test.each([
  [100, "Castelo"],
  [101, "Fila"],
  [102, "Decoração"],
  [103, "Bolha"],
  [104, "Placa de Identificação"],
  [105, "Bolha"],
  [108, "Efeito"],
  [109, "Asas"],
  [115, "Moldura de Avatar"],
  [116, "Aura"],
])("classifyCosmetic_statusType%s_mapsToSkin%s", (type, group) => {
  expect(classifyCosmetic("status", type)).toEqual({ category: "skins", group });
});

test("classifyCosmetic_lordImage_mapsToLordAppearance", () => {
  expect(classifyCosmetic("lord_image")).toEqual({
    category: "avatares",
    group: "Aparência do senhor",
  });
});

test("classifyCosmetic_unknownStatus_doesNotGuessCategory", () => {
  expect(classifyCosmetic("status", 999)).toBeNull();
});

test("classifyCosmetic_unrelatedTable_doesNotInferFromTypeNumber", () => {
  expect(classifyCosmetic("goods", 100)).toBeNull();
});

test("catalog_lordAppearances_matchServerIdsAndCharacterArt", () => {
  const appearances = records.filter((item) => item.category === "avatares");
  expect(appearances.length).toBeGreaterThan(0);
  for (const item of appearances) {
    const lord = lordImages.find((row) => String(row.id) === item.reference);
    expect(item.sourceTable).toBe("lord_image");
    expect(lord?.name).toBe(item.appearanceCode);
    expect(item.source).toContain(`/${item.appearanceCode}_bust.png`);
    expect(item.source).not.toContain("avatar_zhanshi");
  }
});

test("catalog_skins_matchAuthoritativeStatusTypesAndAvailableCollections", () => {
  const skins = records.filter((item) => item.category === "skins");
  const statusById = new Map(statusCatalog.records.map((row) => [String(row.id), row]));
  expect([...new Set(skins.map((item) => item.group))].sort()).toEqual([
    "Asas",
    "Aura",
    "Bolha",
    "Castelo",
    "Decoração",
    "Efeito",
    "Fila",
    "Moldura de Avatar",
    "Placa de Identificação",
  ]);
  for (const item of skins) {
    expect(item.sourceTable).toBe("status");
    const binding = gameSkins.find((skin) => skin.wikiId === item.id);
    expect(binding).toBeDefined();
    expect(binding.type).toBe(item.cosmeticType);
    expect(statusById.get(binding.statusId)?.type2).toBe(item.cosmeticType);
    expect(classifyCosmetic(item.sourceTable, item.cosmeticType)).toEqual({
      category: item.category,
      group: item.group,
    });
  }
});

test("matchesItem_avatarFrame_doesNotMatchLordAppearanceFilter", () => {
  const frame = { name: "Moldura de bronze", group: "Moldura de Avatar", reference: "12000093" };
  expect(matchesItem(frame, { group: "Moldura de Avatar", query: "moldura" })).toBe(true);
  expect(matchesItem(frame, { group: "Aparência do senhor" })).toBe(false);
});

test("skinGroups_requestedCollections_preserveDisplayOrder", () => {
  expect(skinGroups).toEqual([
    "Aura",
    "Moldura de Avatar",
    "Asas",
    "Efeito",
    "Placa de Identificação",
    "Bolha",
    "Decoração",
    "Fila",
    "Castelo",
  ]);
});

test("matchesItem_nameplate_doesNotMatchAvatarFrameFilter", () => {
  const plate = {
    name: "Placa do esqueleto",
    group: "Placa de Identificação",
    reference: "505558",
  };
  expect(matchesItem(plate, { group: "Moldura de Avatar" })).toBe(false);
});

test("matchesItem_skinNameAndOriginalId_findsWithinCollection", () => {
  const plate = {
    name: "Placa do esqueleto",
    group: "Placa de Identificação",
    reference: "505558",
  };
  expect(matchesItem(plate, { group: "Placa de Identificação", query: "esqueleto 505558" })).toBe(
    true,
  );
});
