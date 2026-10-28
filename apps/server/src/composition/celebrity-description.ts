import type { createDatabases } from "@opencok/drizzle";
import type {
    CelebrityDescriptionStore,
    CelebrityDescriptionRuntime,
} from "@opencok/player/contracts/celebrity-description";
import { CelebrityDescriptionService } from "@opencok/player/services/celebrity-description";
import {
    readCelebrityDescription,
    saveCelebrityDescription,
} from "@opencok/player/repositories/celebrity-description";

export function createRealmCelebrityDescriptionService(
    store: Pick<CelebrityDescriptionStore, "getProfileById">,
    databases: ReturnType<typeof createDatabases>,
    kingdomId: number,
    runtime: CelebrityDescriptionRuntime,
)
{
    return new CelebrityDescriptionService(
        {
            getProfileById: (uid) => store.getProfileById(uid),
            celebrityDescription: (uid, realm) => readCelebrityDescription(databases, uid, realm),
            saveCelebrityDescription: (uid, now, read) =>
                saveCelebrityDescription(
                    databases.getKingdom(kingdomId).db,
                    uid,
                    kingdomId,
                    now,
                    read,
                ),
        },
        kingdomId,
        runtime,
    );
}
