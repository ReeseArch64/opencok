import type { createDatabases } from "@opencok/drizzle";
import { NicknameService } from "@opencok/player/services/nickname";
import type { NicknameStore, NicknameRuntime } from "@opencok/player/contracts/nickname-service";
import { nicknameOccupied } from "@opencok/player/repositories/nickname";
import { checkGameProfile } from "@opencok/services/game-profile";

export function createRealmNicknameService(
    store: Pick<NicknameStore, "getProfileById">,
    databases: ReturnType<typeof createDatabases>,
    kingdomId: number,
    runtime: Omit<NicknameRuntime, "checkProfile">,
    now = Date.now,
)
{
    return new NicknameService(
        {
            getProfileById: (uid) => store.getProfileById(uid),
            nicknameOccupied: (name) => nicknameOccupied(databases.global.db, name),
        },
        kingdomId,
        { ...runtime, checkProfile: checkGameProfile },
        now,
    );
}
