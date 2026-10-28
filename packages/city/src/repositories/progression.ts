import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import type { CityTransaction, CityProductionBoundary } from "../contracts/transaction";
import type {
    CityPersistenceAdapters,
    CityPersistenceSession,
} from "../contracts/persistence-session";
import { CitySnapshotReader } from "./snapshot";
import { CityPlanWriter } from "./plan-writer";
import { CityWorldTargets } from "./world-targets";

export class CityProgressionRepository implements CityProgressionStore
{
    public readonly getState: CityProgressionStore["getState"];
    public readonly update: CityProgressionStore["update"];
    public readonly birthPoint: NonNullable<CityProgressionStore["birthPoint"]>;
    public readonly treasurePoints: NonNullable<CityProgressionStore["treasurePoints"]>;

    public constructor(
        tx: CityTransaction,
        owner: string,
        now: bigint,
        boundary: CityProductionBoundary,
        adapters: CityPersistenceAdapters,
        mapSize = 1200,
    )
    {
        const session: CityPersistenceSession = {
            tx,
            owner,
            now,
            boundary,
            mapSize,
            readers: adapters.readers,
            research: adapters.research,
            troops: adapters.troops,
            buildings: adapters.buildings,
            equipment: adapters.equipment,
            quests: adapters.quests,
            targetTasks: adapters.targetTasks,
            cosmetics: adapters.cosmetics,
            recallTasks: adapters.recallTasks,
            writers: adapters.writers,
            birth: adapters.birth,
            alliance: "",
        };
        const snapshot = new CitySnapshotReader(session);
        const writer = new CityPlanWriter(session);
        const world = new CityWorldTargets(session);
        this.getState = snapshot.getState;
        this.update = writer.update;
        this.birthPoint = world.birthPoint;
        this.treasurePoints = world.treasurePoints;
    }
}
