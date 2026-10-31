import { expect, test } from "bun:test";
import { classifyCosmetic } from "../src/lib/cosmetics.mjs";
import records from "../src/data/catalog.json";
import { catalog as statusCatalog } from "../../../packages/resources/src/catalogs/data/status.ts";
import { records as lordImages } from "../../../packages/resources/src/catalogs/data/lord_image.records0.ts";
import { matchesItem } from "../src/lib/search.mjs";

test.each([
  [100, "Castelo"],
  [101, "Marcha"],
  [102, "Decoração"],
  [103, "Balão"],
  [104, "Perfil"],
  [105, "Balão"],
  [108, "Efeito"],
  [109, "Asa"],
  [115, "Perfil"],
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

test("catalog_skins_matchAuthoritativeStatusTypesAndCoverSevenCollections", () => {
  const skins = records.filter((item) => item.category === "skins");
  const statusById = new Map(statusCatalog.records.map((row) => [String(row.id), row]));
  expect([...new Set(skins.map((item) => item.group))].sort()).toEqual([
    "Asa",
    "Balão",
    "Castelo",
    "Decoração",
    "Efeito",
    "Marcha",
    "Perfil",
  ]);
  for (const item of skins) {
    expect(item.sourceTable).toBe("status");
    expect(statusById.get(item.reference)?.type2).toBe(item.cosmeticType);
    expect(classifyCosmetic(item.sourceTable, item.cosmeticType)).toEqual({
      category: item.category,
      group: item.group,
    });
  }
});

test("matchesItem_profileSkin_doesNotMatchLordAppearanceFilter", () => {
  const frame = { name: "Moldura de bronze", group: "Perfil", reference: "12000093" };
  expect(matchesItem(frame, { group: "Perfil", query: "moldura" })).toBe(true);
  expect(matchesItem(frame, { group: "Aparência do senhor" })).toBe(false);
});
