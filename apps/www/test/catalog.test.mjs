import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { catalog, categories } from "../src/lib/catalog.mjs";
import { guides } from "../src/data/guides.mjs";
import { site } from "../src/data/site.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));

test("catalog_allEntries_haveUniqueRoutesAndExistingLocalArt", () => {
  const ids = [...catalog, ...guides].map((item) => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const item of catalog) {
    expect(item.id).toMatch(/^[a-z0-9-]+$/);
    expect(item.source).toStartWith("data/cdn/extracteds/");
    expect(existsSync(`${root}/${item.source}`)).toBe(true);
    expect(categories[item.category]).toBeDefined();
    expect(["soon", "available"]).toContain(item.status);
  }
});

test("catalog_requestedCollections_haveContent", () => {
  expect(catalog.filter((item) => item.category === "tropas").length).toBe(46);
  expect(catalog.filter((item) => item.category === "avatares").length).toBeGreaterThan(300);
  expect(catalog.filter((item) => item.category === "skins").length).toBeGreaterThan(0);
  expect(catalog.filter((item) => item.category === "eventos").length).toBeGreaterThan(0);
});

test("releaseLinks_configuredWebAndPendingMobile_exposeCorrectDestinations", () => {
  expect(site.androidUrl).toBeNull();
  expect(site.iosUrl).toBeNull();
  expect(site.webUrl).toBe("https://web.opencok.com");
});
