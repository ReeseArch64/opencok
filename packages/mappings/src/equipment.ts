import { inventoryItem } from "./bootstrap";
import type { InventoryItem } from "@opencok/contracts/inventory";
import type { Rules } from "@opencok/rules/game";
import { publicEquipment } from "./profile";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { text, num, type Row } from "@opencok/contracts/rows";
export function equipment(row: Row): Fields {
  return {
    ...publicEquipment({ ...row, lockProperty: text(row, "lockProperty") || null }, true),
    ...(num(row, "generalid") > 0 ? { generalid: sfs.string(text(row, "generalid")) } : {}),
  };
}
export function equipmentItem(
  id: string,
  count: number,
  item: InventoryItem | undefined,
  rules: Rules,
): Fields {
  return item
    ? inventoryItem({ ...item }, rules)
    : { itemId: sfs.string(id), count: sfs.int(count) };
}
export function equipmentItems(
  items: ReadonlyMap<string, number>,
  quantity: (id: string) => number,
  rules: Rules,
  itemState?: (id: string) => InventoryItem | undefined,
) {
  return sfs.array(
    [...items].map(([id, count]) =>
      sfs.object({
        ...equipmentItem(id, quantity(id), itemState?.(id), rules),
        num: sfs.int(count),
      }),
    ),
  );
}
