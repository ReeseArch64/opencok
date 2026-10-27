import { expect, test } from "bun:test";
import { Mulan } from "@opencok/hero/domain/mulan";
import { MulanDefinitionMapper } from "@opencok/hero/mappings/mulan-definition";
import { catalog } from "../src/catalogs/data/general_base.ts";
import { catalogCodecs } from "../src/catalog-codecs.ts";
import { legacyRecord } from "../src/catalog-compatibility.ts";

test("the loaded Mulan definition preserves the pre-refactor compatibility record", () => {
  const records = catalog.records.filter((record) => record.id === 53571);
  expect(records).toHaveLength(1);
  const projection = legacyRecord(records[0]!, catalogCodecs.general_base!);
  const hash = new Bun.CryptoHasher("sha256").update(JSON.stringify(projection)).digest("hex");
  expect(hash).toBe("55618f4dd34a0229c836622e356aaef326ec2fdb1e31288e52395e19e675ccdb");
});

test("named hero configuration drives the compatibility boundary", () => {
  const hero = new Mulan();
  const configured = Object.assign(new Mulan(), {
    recruitment: { fragmentsRequired: 2500 },
    progression: { initialLevel: 5, maximumLevel: 90, talentPointDivisor: 5 },
  });
  const definition = new MulanDefinitionMapper().toDefinition(configured);
  expect(definition.needPieces).toEqual([213293, 2500]);
  expect(definition.baseLevel).toBe(5);
  expect(definition.levelMax).toBe(90);
  expect(definition.talentPointDivisor).toBe(5);
  expect(hero.recruitment.fragmentsRequired).toBe(3000);
  expect(hero.progression.maximumLevel).toBe(99);
});

test("invalid named hero configuration fails before catalog publication", () => {
  const mapper = new MulanDefinitionMapper();
  for (const fragmentsRequired of [0, -1, 1.5, NaN, Infinity]) {
    const hero = Object.assign(new Mulan(), { recruitment: { fragmentsRequired } });
    expect(() => mapper.toDefinition(hero)).toThrow("Invalid hero definition: Hua Mulan");
  }
  const hero = Object.assign(new Mulan(), {
    progression: { initialLevel: 100, maximumLevel: 99, talentPointDivisor: 10 },
  });
  expect(() => mapper.toDefinition(hero)).toThrow("Initial level exceeds maximum: Hua Mulan");
});
