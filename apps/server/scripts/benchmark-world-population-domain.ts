import {
    createRealmWorldResourceNewExecutor,
    createRealmWorldResourceRefreshExecutor,
    createRealmWorldMonsterRefreshExecutor,
    createRealmWorldResourceNewService,
    createRealmWorldResourceRefreshService,
    createRealmWorldMonsterRefreshService,
} from "../src/composition/world-population";
import type { cityHarness } from "../integration/support/city";

export function populationWork(h: Awaited<ReturnType<typeof cityHarness>>, size: number)
{
    const shared = createRealmWorldResourceNewExecutor(h.db.db, h.authority, size, 1);
    const resources = createRealmWorldResourceRefreshExecutor(h.db.db, h.authority, size);
    const monsters = createRealmWorldMonsterRefreshExecutor(h.db.db, h.authority, size);
    const sharedService = createRealmWorldResourceNewService(h.rules, size, () => 0);
    const resourceService = createRealmWorldResourceRefreshService(h.rules, size, () => 0);
    const monsterService = createRealmWorldMonsterRefreshService(h.rules, size, () => 0);
    return async (now: bigint) => {
        await shared.execute(now, (store) => sharedService.refresh(store));
        await resources.execute(now, (store) => resourceService.refresh(store, new Map()));
        await monsters.execute(now, (store) => monsterService.refresh(store));
    };
}
