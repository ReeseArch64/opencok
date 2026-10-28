export type AllianceGiftRule = Record<string, string>;

export interface AllianceGiftCatalog
{
    alliance: { gifts?: ReadonlyMap<string, AllianceGiftRule>; };
}
