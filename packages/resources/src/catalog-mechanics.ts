import type { RoleDefinition } from "./catalogs/types/role.ts";
import type { AutomationCatalog, CatalogScalar, TileMapDefinition } from "./catalog-model.ts";
import type { VariableScope } from "@opencok/enums/catalog-kind";
import { mapTile } from "./catalog-model.ts";

export function roleLevelRewards(
  role: RoleDefinition,
): readonly { itemId: number; quantity: number }[] {
  const items = role.levelItem ?? [];
  const quantities = role.levelNum ?? [];
  if (items.length !== quantities.length) throw new Error("Mismatched role level rewards");
  return items.map((itemId, index) => ({ itemId, quantity: quantities[index]! }));
}

export function rulesForEvent(catalog: AutomationCatalog, eventCode: number) {
  return catalog.rules.filter((rule) => rule.events.some((event) => event.code === eventCode));
}

export function initialVariables(
  catalog: AutomationCatalog,
  scope: VariableScope,
): Map<string, CatalogScalar> {
  return new Map(
    catalog.variables
      .filter((variable) => variable.scope === scope && variable.initialValue !== undefined)
      .map((variable) => [variable.id, variable.initialValue!]),
  );
}

export function withMapTile(
  map: TileMapDefinition,
  layer: number,
  x: number,
  y: number,
  value: number,
): TileMapDefinition {
  mapTile(map, layer, x, y);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid tile ID");
  const selected = map.layers[layer]!;
  const tiles = [...selected.tiles];
  tiles[y * selected.width + x] = value;
  return {
    ...map,
    layers: map.layers.map((current, index) => (index === layer ? { ...current, tiles } : current)),
  };
}
