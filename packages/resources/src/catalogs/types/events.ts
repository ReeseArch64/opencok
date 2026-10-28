export interface EventsDefinition
{
    readonly "id": number;
    readonly "readyTime": number;
    readonly "beginTime": number;
    readonly "name": number;
    readonly "event": number | readonly number[];
    readonly "target": readonly (readonly number[])[];
    readonly "reward": readonly (readonly number[])[];
    readonly "rankReward": readonly number[];
    readonly "pramTotal": number | string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EventsDefinitionCatalog = CatalogTable<EventsDefinition>;
