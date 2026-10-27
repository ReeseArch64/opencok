import { expect, test } from "bun:test";
import { Mulan } from "@opencok/hero/domain/mulan";
import { HeroDefinitionMapper } from "@opencok/hero/mappings/hero-definition";
import { heroCatalogBindings } from "@opencok/constants/hero-catalog-bindings";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import { namedHeroRecord } from "../scripts/named-hero-records.ts";
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
    recruitment: { ...hero.recruitment, cost: { item: HeroItem.MulanFragment, quantity: 2500 } },
    progression: { ...hero.progression, initialLevel: 5, maximumLevel: 90, talentPointDivisor: 5 },
  });
  const definition = new HeroDefinitionMapper(heroCatalogBindings).toDefinition(configured);
  expect(definition.needPieces).toEqual([213293, 2500]);
  expect(definition.baseLevel).toBe(5);
  expect(definition.levelMax).toBe(90);
  expect(definition.talentPointDivisor).toBe(5);
  expect(hero.recruitment.cost.quantity).toBe(3000);
  expect(hero.progression.maximumLevel).toBe(99);
});

test("invalid named hero configuration fails before catalog publication", () => {
  const mapper = new HeroDefinitionMapper(heroCatalogBindings);
  for (const fragmentsRequired of [-1, 1.5, NaN, Infinity]) {
    const hero = Object.assign(new Mulan(), {
      recruitment: {
        ...new Mulan().recruitment,
        cost: { item: HeroItem.MulanFragment, quantity: fragmentsRequired },
      },
    });
    expect(() => mapper.toDefinition(hero)).toThrow("Invalid hero definition: Hua Mulan");
  }
  const hero = Object.assign(new Mulan(), {
    progression: {
      ...new Mulan().progression,
      initialLevel: 100,
      maximumLevel: 99,
      talentPointDivisor: 10,
    },
  });
  expect(() => mapper.toDefinition(hero)).toThrow("Invalid hero definition: Hua Mulan");
});

test("stars, talent trees, assignments and refinement are authored in the domain", () => {
  const original = new Mulan();
  const hero = Object.assign(new Mulan(), {
    stars: {
      ...original.stars,
      upgrades: original.stars.upgrades.map((step) => ({
        ...step,
        cost: { ...step.cost, quantity: 123 },
      })),
    },
    talentTrees: [HeroTalentTree.MulanSpear, HeroTalentTree.MulanVanguard],
    assignments: { ...original.assignments, canLoot: false, canBattle: false },
    refinement: {
      ...original.refinement,
      valueRollCostPerAttribute: { item: HeroItem.MulanFragment, quantity: 42 },
      slots: original.refinement.slots.map((slot) => ({
        ...slot,
        requiredLevel: 20,
        unlockCost: { item: HeroItem.HeroBadge, quantity: 7 },
      })),
      typeRollPrices: original.refinement.typeRollPrices.map((price) => ({ ...price, gold: 250 })),
    },
  });
  const mapped = new HeroDefinitionMapper(heroCatalogBindings).toDefinition(hero);
  expect(mapped.starGoods).toEqual(Array.from({ length: 4 }, () => [213293, 123]));
  expect(mapped.generalAb).toEqual([53571202, 41020011]);
  expect(mapped.loot).toBe(0);
  expect(mapped.battle).toBe(0);
  expect(mapped.refineCard).toBe(42);
  expect(mapped.unlockLevel).toEqual([
    [1, 20],
    [2, 20],
    [3, 20],
    [4, 20],
    [5, 20],
  ]);
  expect(mapped.unlockGoodsNum).toEqual([
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ]);
  expect(mapped.refineEffect).toEqual([
    [1, 250],
    [2, 250],
    [3, 250],
    [4, 250],
    [5, 250],
  ]);
});

test("invalid ordering and unrepresentable item costs fail instead of losing domain data", () => {
  const original = new Mulan();
  const mapper = new HeroDefinitionMapper(heroCatalogBindings);
  const unsorted = Object.assign(new Mulan(), {
    stars: { ...original.stars, upgrades: [...original.stars.upgrades].reverse() },
  });
  expect(() => mapper.toDefinition(unsorted)).toThrow("Invalid hero definition");
  const mixedUnlockItems = Object.assign(new Mulan(), {
    refinement: {
      ...original.refinement,
      slots: original.refinement.slots.map((slot) => ({
        ...slot,
        unlockCost: { item: HeroItem.MulanFragment, quantity: 1 },
      })),
    },
  });
  expect(() => mapper.toDefinition(mixedUnlockItems)).toThrow("one refinement unlock item");
  const missingSlot = Object.assign(new Mulan(), {
    refinement: { ...original.refinement, slots: [] },
  });
  expect(() => mapper.toDefinition(missingSlot)).toThrow("Invalid hero definition");
});

test("catalog imports retain named hero authorship and reject unmodeled heroes", () => {
  expect(namedHeroRecord("general_base", { id: 53571, levelMax: 48 })?.expression).toBe(
    "heroDefinitionByIdentity[HeroIdentity.Mulan]",
  );
  expect(namedHeroRecord("general_base", { id: 53572 })?.expression).toBe(
    "heroDefinitionByIdentity[HeroIdentity.Unknown1]",
  );
  expect(() => namedHeroRecord("general_base", { id: 999999 })).toThrow(
    "requires a named definition",
  );
  expect(namedHeroRecord("general_skill", { id: 53571 })).toBeUndefined();
});
