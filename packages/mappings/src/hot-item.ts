import { sfs, type Fields } from "@opencok/messages/sfs";
import { hotItemOffer, hotItemType, hotBusinessMan } from "@opencok/rules/hot-item";
import { num, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
export function hotItemView(row: Row, version: 2 | 3): Fields {
  const offer = hotItemOffer(row);
  return {
    itemNum: sfs.int(offer.itemNum),
    itemId: sfs.string(offer.itemId),
    priceType: sfs.int(offer.priceType),
    price: sfs.int(offer.price),
    price_hot: sfs.int(offer.priceHot),
    num: sfs.int(offer.num),
    color: sfs.int(offer.color),
    type: sfs.int(hotItemType(offer.itemId)),
    ...(version === 3 ? { kind: sfs.int(offer.kind) } : {}),
  };
}
export function hotBestItemView(row: Row): Fields {
  const id = text(row, "goodsId");
  hotItemOffer({
    goodsId: id,
    itemId: id.split(";")[0] ?? "",
    num: 1,
    priceType: row.price_type ?? null,
    price: row.price ?? null,
    price_hot: row.price_hot ?? 0,
    para1: row.color ?? 0,
    refreshTime: 0n,
  });
  return {
    goodsId: sfs.string(id),
    color: sfs.int(num(row, "color")),
    priceType: sfs.int(num(row, "price_type")),
    price: sfs.int(num(row, "price")),
    price_hot: sfs.int(num(row, "price_hot")),
    type: sfs.int(hotItemType(id.split(";")[0]!)),
  };
}
export function hotBusinessManView(rules: Rules, now: bigint): Fields {
  const state = hotBusinessMan(rules, now);
  return {
    startTime: sfs.long(state.start),
    endTime: sfs.long(state.end),
    isOpen: sfs.int(state.isOpen),
    k8: sfs.int(state.k8),
  };
}
