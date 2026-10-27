import { dragonCatalogBindings } from "@opencok/constants/dragon-catalog-bindings";
import { DragonIdentity } from "@opencok/enums/dragon-identity";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { dragonDefinitionByIdentity } from "../src/dragons/roster.ts";

const identities = new Map<number, DragonIdentity>(
  Object.entries(dragonCatalogBindings.dragons).map(([identity, id]) => [
    id,
    identity as DragonIdentity,
  ]),
);

export function namedDragonDefinition(record: object) {
  const identity = "id" in record ? identities.get(record.id as number) : undefined;
  const definition = identity && dragonDefinitionByIdentity.get(identity);

  if (!definition) throw new Error("Dragon catalog import requires a named server configuration");

  return definition;
}

export function namedDragonRecord(catalog: string, record: object) {
  if (catalog !== GameplayCatalog.DragonBase) return undefined;

  const definition = namedDragonDefinition(record);
  const identity = identities.get(definition.id)!;
  const member = Object.entries(DragonIdentity).find(([, value]) => value === identity)![0];

  return {
    declaration:
      'import { dragonDefinitionByIdentity } from "../../dragons/roster.ts";\nimport { DragonIdentity } from "@opencok/enums/dragon-identity";',
    expression: `dragonDefinitionByIdentity.get(DragonIdentity.${member})!`,
  };
}
