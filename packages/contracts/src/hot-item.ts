import type { Row } from "./rows";

export interface HotItemState {
  v2: readonly Row[];
  v3: readonly Row[];
  bestV2?: Row;
  bestV3?: Row;
  refresh?: Row;
  purchases: readonly Row[];
  server: Row;
  scores: readonly Row[];
}

export interface HotItemWrite {
  version: 2 | 3;
  offers: readonly Row[];
  best?: Row;
  refresh: { count: number; todayTime: bigint };
  purchases: readonly Row[];
}

export interface HotItemOffer {
  goodsId: string;
  itemId: string;
  itemNum: number;
  priceType: number;
  price: number;
  priceHot: number;
  num: number;
  color: number;
  kind: number;
  refreshTime: bigint;
}
