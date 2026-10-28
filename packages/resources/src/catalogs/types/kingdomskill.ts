export interface KingdomskillDefinition
{
    readonly "id": number;
    readonly "name": number;
    readonly "icon": string;
    readonly "shotTip": number;
    readonly "tip": number;
    readonly "isCanUseWhenCross": number;
    readonly "skillCategory": number;
    readonly "useType": number;
    readonly "effectType": number;
    readonly "effectValue": number | readonly number[] | string;
    readonly "value": number;
    readonly "needToRelease": number | readonly number[];
    readonly "costMaterial": number | readonly number[];
    readonly "privilige": number | readonly number[];
    readonly "cd": number;
    readonly "effectTime": number;
    readonly "serverLimit": number;
    readonly "targetLimit": number;
    readonly "releaseTimes": number;
    readonly "sucRatio": number;
    readonly "needEdition": string;
    readonly "showTab": number;
    readonly "tabIndex": number;
    readonly "test": string;
    readonly "online": string;
    readonly "typeTip"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type KingdomskillDefinitionCatalog = CatalogTable<KingdomskillDefinition>;
