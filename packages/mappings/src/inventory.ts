import type { InventoryItem } from "@opencok/contracts/inventory";
import type { EconomyPosting } from "@opencok/contracts/mutation";
import { sfs, encode, decode, fields, str, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { inventoryItem } from "./bootstrap.ts";

export function inventoryPurchase(
  item: InventoryItem,
  rules: Rules,
  gold: bigint,
  cost: number,
): Fields {
  return {
    item: sfs.object(inventoryItem({ ...item }, rules)),
    remainGold: sfs.long(gold),
    costGold: sfs.int(cost),
  };
}
export function inventoryUse(item: InventoryItem, effect: Fields): Fields {
  return {
    itemId: sfs.string(item.itemId),
    count: sfs.int(item.count),
    itemEffectObj: sfs.object(effect),
  };
}
export function inventoryBuyUse(buy: Fields, use: Fields): Fields {
  return { buyRet: sfs.object(buy), useRet: sfs.object(use) };
}
export function inventoryComposition(items: readonly InventoryItem[]): Fields {
  return {
    itemlist: sfs.array(
      items.map((item) =>
        sfs.object({
          uuid: sfs.string(item.uuid),
          itemId: sfs.string(item.itemId),
          count: sfs.int(item.count),
        }),
      ),
    ),
  };
}
export function inventoryChanges(items: readonly InventoryItem[], rules: Rules): Fields {
  return {
    useritemlist: sfs.array(items.map((item) => sfs.object(inventoryItem({ ...item }, rules)))),
  };
}
export function inventoryEvent(postings: readonly EconomyPosting[]): Buffer {
  return encode({
    changes: sfs.array(
      postings.map((entry) =>
        sfs.object({
          asset: sfs.string(entry.asset),
          before: sfs.long(entry.before),
          after: sfs.long(entry.after),
          reason: sfs.string(entry.reason),
        }),
      ),
    ),
  });
}
export function inventoryResponse(
  body: Fields,
  pushes: readonly { command: string; body: Fields }[],
): Buffer {
  return encode({
    body: sfs.object(body),
    pushes: sfs.array(
      pushes.map((push) =>
        sfs.object({ command: sfs.string(push.command), body: sfs.object(push.body) }),
      ),
    ),
  });
}
export function inventoryReplay(response: Buffer, requestId: string) {
  const reply = decode(response),
    body = fields(reply.body);
  body.operationId = sfs.string(requestId);
  const pushes = (reply.pushes!.value as { value: Fields }[]).map((entry) => ({
    command: str(entry.value, "command"),
    body: fields(entry.value.body),
  }));
  return { body, pushes };
}
