import type { createDatabases } from "@opencok/drizzle";
import type { Rules } from "@opencok/rules/game";
import type {
    PublicProfileStore,
    PublicProfileRuntime,
} from "@opencok/player/contracts/public-profile-service";
import { PublicProfileService } from "@opencok/player/services/public-profile";
import { loadPublicProfile } from "@opencok/player/repositories/public-profile";
import { readProfileAlliance } from "@opencok/repositories/profile-alliance";
import { checkGameProfile } from "@opencok/services/game-profile";
import { publicProfileAlliance } from "@opencok/services/profile";
import { publicProfileGenerals } from "@opencok/hero/services/profile-generals";

export function createRealmPublicProfileService(
    store: Pick<PublicProfileStore, "getProfileById">,
    databases: ReturnType<typeof createDatabases>,
    rules: Rules,
    kingdomId: number,
    playerUpdateTimes: PublicProfileRuntime["playerUpdateTimes"],
    now = Date.now,
)
{
    return new PublicProfileService(
        {
            getProfileById: (uid) => store.getProfileById(uid),
            publicProfile: (uid, allianceId) =>
                loadPublicProfile(databases, kingdomId, uid, allianceId, readProfileAlliance),
        },
        rules,
        { kingdomId },
        {
            checkProfile: checkGameProfile,
            generals: publicProfileGenerals,
            alliance: publicProfileAlliance,
            playerUpdateTimes,
        },
        now,
    );
}
