import { heroCatalogBindings } from "@opencok/constants/hero-catalog-bindings";
import type { HeroIdentity } from "@opencok/enums/hero-identity";
import { heroRoster } from "@opencok/hero/domain/roster";
import { HeroDefinitionMapper } from "@opencok/hero/mappings/hero-definition";
import type { GeneralBaseDefinition } from "@opencok/hero/resources/catalogs/types/general_base";

const mapper = new HeroDefinitionMapper(heroCatalogBindings);

export const heroDefinitionByIdentity = Object.fromEntries(
  heroRoster.map((hero) => [hero.identity, mapper.toDefinition(hero)]),
) as Readonly<Record<HeroIdentity, GeneralBaseDefinition>>;

export const heroDefinitions = heroRoster.map((hero) => heroDefinitionByIdentity[hero.identity]);
