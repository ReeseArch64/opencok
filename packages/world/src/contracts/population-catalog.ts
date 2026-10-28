export type WorldPopulationRule = Readonly<Record<string, string>>;

export interface WorldPopulationSettings
{
    readonly on_event2?: WorldPopulationRule;
    readonly on_event3?: WorldPopulationRule;
    readonly resources_death?: WorldPopulationRule;
    readonly resources_life?: WorldPopulationRule;
    readonly worldmap_city?: WorldPopulationRule;
    readonly "17_wk"?: WorldPopulationRule;
    readonly world_wood?: WorldPopulationRule;
    readonly world_stone?: WorldPopulationRule;
    readonly world_iron?: WorldPopulationRule;
    readonly world_food?: WorldPopulationRule;
    readonly world_fineiron?: WorldPopulationRule;
    readonly world_gold?: WorldPopulationRule;
    readonly function_on2?: WorldPopulationRule;
    readonly monster_event_config?: WorldPopulationRule;
    readonly world_barbarion?: WorldPopulationRule;
    readonly blackland_resource?: WorldPopulationRule;
    readonly resources_weight?: WorldPopulationRule;
    readonly monster?: WorldPopulationRule;
    readonly worldmap_explore?: WorldPopulationRule;
}

export interface WorldPopulationCatalog
{
    readonly kingdomId: number;
    readonly settings: WorldPopulationSettings;
    readonly resourceGroups?: ReadonlyMap<string, readonly WorldPopulationRule[]>;
    readonly monsterGroups?: ReadonlyMap<string, readonly WorldPopulationRule[]>;
    readonly barbarianSpawns?: ReadonlyMap<string, WorldPopulationRule>;
    readonly armyLayouts?: ReadonlyMap<string, WorldPopulationRule>;
}
