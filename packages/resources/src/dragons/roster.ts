import { dragonCatalogBindings } from "@opencok/constants/dragon-catalog-bindings";
import type { DragonIdentity } from "@opencok/enums/dragon-identity";
import { dragonRoster } from "@opencok/dragon/domain/roster";
import { DragonDefinitionMapper } from "@opencok/dragon/mappings/dragon-definition";
import type { DragonBaseCatalogRecord } from "@opencok/dragon/contracts/dragon-base-catalog";

const mapper = new DragonDefinitionMapper(dragonCatalogBindings);

export const dragonDefinitionByIdentity: ReadonlyMap<DragonIdentity, DragonBaseCatalogRecord> =
    new Map(
        dragonRoster
            .filter((dragon) => dragon.server !== undefined)
            .map((dragon) => [dragon.identity, mapper.toDefinition(dragon)]),
    );

export const dragonDefinitions = [...dragonDefinitionByIdentity.values()];
