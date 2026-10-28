export type AllianceScienceRule = Record<string, string>;

export interface AllianceScienceCatalog
{
    power: { allianceSciences?: ReadonlyMap<string, AllianceScienceRule>; };
    items: ReadonlyMap<string, AllianceScienceRule>;
}

export interface AllianceScienceStage
{
    stage: number;
    current: number;
    required: number;
    total: number;
}
