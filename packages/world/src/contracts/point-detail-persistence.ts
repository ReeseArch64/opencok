import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { Row } from "./rows";
import type { WorldCityEffects, WorldResourceOwnerIdentity } from "./world-point-detail";

export type WorldDetailReader = Pick<DatabaseClient<"kingdom">, "select">;

export interface WorldDetailReaders<
    TEffects extends WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity,
>
{
    readPlayerEffects(
        reader: WorldDetailReader,
        profile: Row,
        includeBuffs: boolean,
    ): Promise<TEffects>;
    readResourceOwner(reader: WorldDetailReader, owner: string): Promise<TOwner | undefined>;
    checkResourceOwner(reader: WorldDetailReader): Promise<void>;
    mailBlank(value: string | null | undefined): boolean;
}
