import { expect, test } from "bun:test";
import records from "../src/data/catalog.json";
import bindings from "../../../packages/resources/tests/fixtures/appearance-catalog.json";
import { statusLabel } from "../src/lib/catalog.mjs";

test("skin publication matches enabled game bindings across every collection", () => {
  const skins = records.filter((item) => item.category === "skins");
  expect(skins.filter((item) => item.status === "available")).toHaveLength(1621);
  expect(skins.filter((item) => item.status === "soon")).toHaveLength(6);
  for (const binding of bindings) {
    const item = skins.find((skin) => skin.id === binding.wikiId);
    expect(item.status).toBe(binding.enabled ? "available" : "soon");
    expect(statusLabel(item.status)).toBe(binding.enabled ? "Disponível" : "Em breve");
  }
});
