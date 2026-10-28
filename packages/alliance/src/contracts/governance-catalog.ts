export interface AlliancePolicyCatalog
{
    alliance: { ranks?: ReadonlyMap<string, Record<string, string>>; };
    items: ReadonlyMap<string, Record<string, string>>;
}
