import type { WorldResourceNewExecutor } from "@opencok/world/contracts/world-resource-new";
import type { WorldResourceRefreshExecutor } from "@opencok/world/contracts/world-resource-refresh";
import type { WorldMonsterRefreshExecutor } from "@opencok/world/contracts/world-monster-refresh";
import type { WorldResourceNewService } from "@opencok/world/services/world-resource-new";
import type { WorldResourceRefreshService } from "@opencok/world/services/world-resource-refresh";
import type { WorldMonsterRefreshService } from "@opencok/world/services/world-monster-refresh";

export class WorldPopulationJob
{
    public constructor(
        private readonly sharedResources: WorldResourceNewExecutor,
        private readonly resources: WorldResourceRefreshExecutor,
        private readonly monsters: WorldMonsterRefreshExecutor,
        private readonly services: {
            shared: Pick<WorldResourceNewService, "refresh">;
            resources: Pick<WorldResourceRefreshService, "refresh">;
            monsters: Pick<WorldMonsterRefreshService, "refresh">;
        },
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
                (store) => this.services.shared.refresh(store),
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
                async (store) => this.services.resources.refresh(store, await this.worldEffects()),
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
                (store) => this.services.monsters.refresh(store),
            );
        }
        catch
        {
            this.reportFailure("world_monster_recovery_failed");
        }
    }
}
