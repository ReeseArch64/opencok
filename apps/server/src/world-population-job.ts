import type { WorldResourceNewExecutor } from "@opencok/contracts/world-resource-new";
import type { WorldResourceRefreshExecutor } from "@opencok/contracts/world-resource-refresh";
import type { WorldMonsterRefreshExecutor } from "@opencok/contracts/world-monster-refresh";
import type { Rules } from "@opencok/rules/game";
import { refreshWorldResourceNew } from "@opencok/services/world-resource-new";
import { refreshWorldResources } from "@opencok/services/world-resource-refresh";
import { refreshWorldMonsters } from "@opencok/services/world-monster-refresh";

export class WorldPopulationJob
{
    public constructor(
        private readonly sharedResources: WorldResourceNewExecutor,
        private readonly resources: WorldResourceRefreshExecutor,
        private readonly monsters: WorldMonsterRefreshExecutor,
        private readonly rules: Rules,
        private readonly mapSize: number,
        private readonly worldEffects: () => Promise<ReadonlyMap<number, number>>,
        private readonly reportFailure: (event: string) => void,
    )
    {}

    public async run(): Promise<void>
    {
        try
        {
            await this.sharedResources.execute(
                undefined,
                (store) => refreshWorldResourceNew(store, this.rules, this.mapSize),
            );
        }
        catch
        {
            this.reportFailure("world_shared_resource_recovery_failed");
        }

        try
        {
            await this.resources.execute(
                undefined,
                async (store) =>
                    refreshWorldResources(
                        store,
                        this.rules,
                        this.mapSize,
                        await this.worldEffects(),
                    ),
            );
        }
        catch
        {
            this.reportFailure("world_resource_recovery_failed");
        }

        try
        {
            await this.monsters.execute(
                undefined,
                (store) => refreshWorldMonsters(store, this.rules, this.mapSize),
            );
        }
        catch
        {
            this.reportFailure("world_monster_recovery_failed");
        }
    }
}
