import { createCharacterCreator as createPlayerCharacterCreator } from "@opencok/player/repositories/character-provisioning";
import { allocateWorldBirth } from "@opencok/repositories/world-birth";
import { appendMutationRecords } from "@opencok/repositories/mutation";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function createCharacterCreator(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    mapSize: number,
    now = Date.now,
)
{
    return createPlayerCharacterCreator(
        db,
        {
            kingdomId: authority.kingdomId,
            assertReady: () => authority.assertReady(),
            fence: (tx) => fenceRealmTransaction(tx, authority),
            allocateBirth: (tx, size, rules, timestamp) =>
                allocateWorldBirth(tx, authority, size, rules, timestamp),
            appendRecords: (tx, command, result, timestamp) =>
                appendMutationRecords(tx, authority, command, result, timestamp),
        },
        mapSize,
        now,
    );
}
