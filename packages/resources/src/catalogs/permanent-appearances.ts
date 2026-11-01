import type { StatusDefinition } from "./types/status";
import type { GoodsDefinition } from "./types/goods";
import type { ShopNewDefinition } from "./types/shop_new";

enum AppearanceKind
{
    City = 100,
    March = 101,
    Ground = 102,
    Chat = 103,
    Nameplate = 104,
    Bubble = 105,
    Effect = 108,
    Wings = 109,
    Frame = 115,
    Aura = 116,
    Overlap = 200,
}
const appearanceKinds = new Set<number>([
    AppearanceKind.City,
    AppearanceKind.March,
    AppearanceKind.Ground,
    AppearanceKind.Chat,
    AppearanceKind.Nameplate,
    AppearanceKind.Bubble,
    AppearanceKind.Effect,
    AppearanceKind.Wings,
    AppearanceKind.Frame,
    AppearanceKind.Aura,
]);

export function permanentAppearanceStatuses(
    records: readonly StatusDefinition[],
    goods: readonly GoodsDefinition[],
    offers: readonly ShopNewDefinition[],
): readonly StatusDefinition[]
{
    const statuses = new Map(records.map((row) => [String(row.id), row]));
    const items = new Map(goods.map((row) => [String(row.id), row]));
    const family = (row: StatusDefinition) => `${row.type2}:${row.subgroup ?? row.id}`;
    const offered = new Set<string>();
    for (const offer of offers)
    {
        const item = items.get(String(offer.itemId));
        const status = item?.type === 4 ? statuses.get(String(item.para1)) : undefined;
        if (status && appearanceKinds.has(Number(status.type2)))
        {
            offered.add(family(status));
        }
    }
    return records.map((row) => {
        if (!offered.has(family(row)))
        {
            return row;
        }
        const permanent = { ...row, isForever: 1 };
        delete permanent.time;
        delete permanent.autoend;
        return permanent;
    });
}
