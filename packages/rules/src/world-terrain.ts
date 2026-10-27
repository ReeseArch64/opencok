import { cityInteger } from "./city-progression";
import type { Rules } from "./game";
import type { WorldTerrain, WorldTerrainRules } from "@opencok/contracts/world-terrain";

export const worldTerrainKey = "opencok.world.terrain.v1";

export const worldTerrainOwner = "@world:0";

export function worldTerrainRules(rules: Rules): WorldTerrainRules {
  const city = rules.items.get("worldmap_city");

  return {
    size: cityInteger(city?.k3, 2, 4000),
    bornSide: cityInteger(city?.k1, 1),
    resourceSide: cityInteger(city?.k6, 1),
    monsterSide: cityInteger(rules.items.get("worldmap_explore")?.k1, 1),
  };
}

export function sourceWorldArea(size: number, side: number, x: number, y: number) {
  const normal = Math.floor(size / side);

  if (!normal) {throw new Error("Terrain area exceeds dimensions");}

  if (x < normal * side && y < normal * side)
    {return Math.floor(x / side) * normal + Math.floor(y / side) + 1;}

  if (size % side === 1) {return normal * normal + 1;}

  return size % side > 1 && x >= normal * side && y < side ? normal * normal + 1 : 0;
}

export function worldTerrainPoint(terrain: WorldTerrain, rules: WorldTerrainRules, index: number) {
  const size = terrain.size;

  if (rules.size !== size || !Number.isInteger(index) || index < 0 || index >= size * size)
    {throw new Error("Invalid terrain point");}

  const x = index % size,
    y = Math.floor(index / size),
    id = index + 1,
    bornAreaId =
      Math.floor(x / rules.bornSide) * Math.ceil(size / rules.bornSide) +
      Math.floor(y / rules.bornSide) +
      1;
  let pointType = 0,
    pointItem: string | null = null,
    resLevel = 0;

  if (Math.abs(x - 600) <= 1 && Math.abs(y - 600) <= 1) {
    pointType = x === 600 && y === 600 ? 10 : 11;

    if (pointType === 11) {pointItem = String(1 + 600 + 600 * size);}
  }

  for (const [tx, ty] of [
    [605, 605],
    [605, 596],
    [596, 596],
    [596, 605],
  ])
    {if (x >= tx! - 1 && x <= tx! && y >= ty! - 1 && y <= ty!) {
      pointType = x === tx && y === ty ? 12 : 13;
      pointItem = pointType === 13 ? String(1 + tx! + ty! * size) : null;
    }}

  if (x === 604 && y === 600) {
    pointType = 48;
    resLevel = 1;
  }

  return {
    id,
    worldId: 0,
    x,
    y,
    bornAreaId,
    areaId: sourceWorldArea(size, rules.resourceSide, x, y),
    monsterAreaId: sourceWorldArea(size, rules.monsterSide, x, y),
    gridType: terrain.grid[index]!,
    grid2Type: terrain.overlay[index]!,
    pointType,
    pointItem,
    resLevel,
    resInitValue: 0,
    startTime: 0n,
    flushTime: 0n,
  };
}
