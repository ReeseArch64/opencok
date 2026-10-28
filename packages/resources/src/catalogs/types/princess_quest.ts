export interface PrincessQuestDefinition
{
    readonly "id": number;
    readonly "accept1": number;
    readonly "accept2": number | readonly number[];
    readonly "default"?: number;
    readonly "sort": number;
    readonly "type2": number;
    readonly "para2"?: number;
    readonly "reward"?: number;
    readonly "reward2"?: number;
    readonly "Order"?: number;
    readonly "Repeat"?: number;
    readonly "pos1": number;
    readonly "time": number;
    readonly "subtask"?: readonly number[];
    readonly "tips"?: number;
    readonly "para1"?: number | readonly number[];
    readonly "maintask"?: number;
    readonly "trigger"?: number;
    readonly "pre"?: number;
    readonly "add"?: number;
    readonly "accept3"?: number | readonly (readonly number[])[];
    readonly "Rate"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PrincessQuestDefinitionCatalog = CatalogTable<PrincessQuestDefinition>;
