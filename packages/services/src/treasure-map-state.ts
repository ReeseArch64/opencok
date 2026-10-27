import { text, type Row } from "@opencok/contracts/rows";
import type { CityProgressionContext } from "./city-progression";

export function treasureMapRoster(context: CityProgressionContext) {
  const rows = new Map(
    (context.state.worldMutation?.treasures ?? []).map((row) => [text(row, "uuid"), row]),
  );
  for (const row of context.write.worldMutation?.treasures ?? []) rows.set(text(row, "uuid"), row);
  for (const id of context.write.worldMutation?.deletedTreasures ?? []) rows.delete(id);
  return [...rows.values()];
}
export function writeTreasureMap(context: CityProgressionContext, row: Row) {
  const write = (context.write.worldMutation ??= {});
  write.treasures = [...(write.treasures ?? []).filter((prior) => prior.uuid !== row.uuid), row];
}
export function deleteTreasureMap(context: CityProgressionContext, id: string) {
  const write = (context.write.worldMutation ??= {});
  write.deletedTreasures = [...(write.deletedTreasures ?? []), id];
  write.treasures = (write.treasures ?? []).filter((row) => row.uuid !== id);
}
