import { heroCatalogBindings } from "@opencok/constants/hero-catalog-bindings";
import { HeroIdentity } from "@opencok/enums/hero-identity";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { heroDefinitionByIdentity } from "../src/heroes/roster.ts";

const identities = new Map<number, string>(
  Object.entries(heroCatalogBindings.heroes).map(([identity, binding]) => [
    binding.generalId,
    identity,
  ]),
);

export function namedHeroRecord(catalog: string, record: object) {
  if (catalog !== GameplayCatalog.GeneralBase || !("id" in record)) return undefined;

  const identity = identities.get(record.id as number);

  if (!identity) throw new Error(`Hero catalog import requires a named definition: ${record.id}`);

  const member = Object.entries(HeroIdentity).find(([, value]) => value === identity)![0];

  return {
    declaration:
      'import { heroDefinitionByIdentity } from "../../heroes/roster.ts";\nimport { HeroIdentity } from "@opencok/enums/hero-identity";',
    expression: `heroDefinitionByIdentity[HeroIdentity.${member}]`,
  };
}

export function namedHeroDefinition(record: object) {
  const identity = "id" in record ? identities.get(record.id as number) : undefined;

  if (!identity) throw new Error("Hero catalog import requires a named definition");

  return heroDefinitionByIdentity[identity as HeroIdentity];
}
