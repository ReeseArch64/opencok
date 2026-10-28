export interface RankDefinition
{
    readonly "id": number;
    readonly "allmail": number;
    readonly "member": number;
    readonly "trade": number;
    readonly "help": number;
    readonly "rankdetails": number;
    readonly "quit"?: number;
    readonly "rankup"?: number;
    readonly "rankdown"?: number;
    readonly "slogan"?: number;
    readonly "recruitment"?: number;
    readonly "announcement"?: number;
    readonly "invite"?: number;
    readonly "kick"?: number;
    readonly "alliancescience"?: number;
    readonly "allianceshop"?: number;
    readonly "alliancelanguage"?: number;
    readonly "comment"?: number;
    readonly "allianceactivity"?: number;
    readonly "quest"?: number;
    readonly "name"?: number;
    readonly "briefname"?: number;
    readonly "flag"?: number;
    readonly "rankname"?: number;
    readonly "dissolve"?: number;
    readonly "transfer"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type RankDefinitionCatalog = CatalogTable<RankDefinition>;
