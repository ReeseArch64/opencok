export interface DragonNewDefinition {
  readonly "id": number;
  readonly "baseId": number;
  readonly "level": number;
  readonly "nextLevelItemId"?: number;
  readonly "experience": number;
  readonly "expOnce": number;
  readonly "expGold": number;
  readonly "expResource": readonly number[];
  readonly "expCrit": readonly (readonly number[])[];
  readonly "levelItem": readonly number[];
  readonly "friendship": number;
  readonly "deadPercent": number;
  readonly "friendshipDecreaseTime": number;
  readonly "communicateFriendship": readonly number[];
  readonly "travel": readonly number[];
  readonly "damage": readonly (readonly number[])[];
  readonly "friendshipWin": number;
  readonly "friendshipLose": number;
  readonly "attack": number;
  readonly "attDistance": number;
  readonly "attInterval": number;
  readonly "critDamage": number;
  readonly "critRate": number;
  readonly "communicateCooltime": readonly number[];
  readonly "firstTarget"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonNewDefinitionCatalog = CatalogTable<DragonNewDefinition>;
