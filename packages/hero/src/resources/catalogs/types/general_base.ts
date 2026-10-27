export interface GeneralBaseDefinition {
  readonly "id": number;
  readonly "newAccMaxLv": number;
  readonly "isUnlock": number;
  readonly "name": number;
  readonly "saleId"?: number;
  readonly "type": number;
  readonly "gender": number;
  readonly "baseLevel": number;
  readonly "baseQuality": number;
  readonly "baseSkill": number | readonly number[];
  readonly "baseStar": number;
  readonly "baseSkill3": number | string;
  readonly "baseSkill4": number | string;
  readonly "baseSkill5": number | string;
  readonly "breachGoods": readonly (readonly number[])[];
  readonly "starMaxLevel": number;
  readonly "starGoods": readonly (readonly number[])[];
  readonly "needPieces": readonly number[];
  readonly "piecesId": number;
  readonly "levelMax": number;
  readonly "talent": number;
  readonly "talentPointDivisor"?: number;
  readonly "generalAb": number | readonly number[] | string;
  readonly "loot": number;
  readonly "lootLevel": number;
  readonly "garrison": number;
  readonly "battle": number;
  readonly "lordExp": number;
  readonly "refineCard": number;
  readonly "refineEffect": readonly (readonly number[])[];
  readonly "refineEffectLock": readonly (readonly number[])[];
  readonly "refineNum": readonly (readonly number[])[];
  readonly "unlockLevel": number | readonly (readonly number[])[];
  readonly "unlockStar": number | readonly (readonly number[])[] | string;
  readonly "unlockGoodsNum": number | readonly (readonly number[])[];
  readonly "goodsId": number;
  readonly "baseSkill2"?: number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralBaseDefinitionCatalog = CatalogTable<GeneralBaseDefinition>;
