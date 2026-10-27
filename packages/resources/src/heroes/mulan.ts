import { heroCatalogBindings } from "@opencok/constants/hero-catalog-bindings";
import { Mulan } from "@opencok/hero/domain/mulan";
import { HeroDefinitionMapper } from "@opencok/hero/mappings/hero-definition";

export const mulan = new HeroDefinitionMapper(heroCatalogBindings).toDefinition(new Mulan());
