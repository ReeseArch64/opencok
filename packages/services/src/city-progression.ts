import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import type { Rules } from "@opencok/rules/game";
import type { InventoryEffects } from "./inventory";
import type { CityDomain } from "./city-domain.ts";
import { CityProgressionService } from "./city-progression.service.ts";

export type { CityDomain } from "./city-domain.ts";
export { CityProgressionContext } from "./city-progression-context.ts";

export function createCityProgressionHandlers<T>(
    store: (tx: T, owner: string, now: bigint) => CityProgressionStore,
    domains: readonly CityDomain[],
    rules: Rules,
    effects: InventoryEffects,
): CityProgressionService<T>
{
    return new CityProgressionService(store, domains, rules, effects);
}
