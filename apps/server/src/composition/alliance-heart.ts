import { AllianceHeartService } from "@opencok/alliance/services/heart";
import { AllianceHeartPublicationService } from "@opencok/alliance/services/heart-publication";
import { AllianceHeartRepository } from "@opencok/alliance/repositories/heart";
import { AllianceHeartPolicy } from "@opencok/alliance/rules/heart";
import { AllianceHeartMapper } from "@opencok/alliance/mappings/heart";
import type {
    AllianceHeartInterests,
    AllianceHeartPublisher,
    AllianceHeartWrite,
} from "@opencok/alliance/contracts/heart";
import type { AllianceTransaction } from "@opencok/alliance/contracts/persistence";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { CityDomain } from "@opencok/services/city-domain";
import { text, num } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";

function allianceHeartFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

const repository = new AllianceHeartRepository({
    cityInteger,
    recipient: playerItemGiftRecipient,
});

export function createRealmAllianceHeartPolicy()
{
    return new AllianceHeartPolicy({ cityInteger, allianceHeartFailure });
}

export function createRealmAllianceHeartDomain(
    connected: (uid: string) => boolean = () => false,
): CityDomain
{
    return new AllianceHeartService(
        {
            text,
            num,
            playerItemGiftRecipient,
            allianceHeartFailure,
            foreignAllianceFailure: (): never => {
                throw new GameError("152027");
            },
        },
        createRealmAllianceHeartPolicy(),
        new AllianceHeartMapper(),
        connected,
    );
}

export function publishAllianceHeartMutation(
    payload: Uint8Array,
    interested: AllianceHeartInterests,
    publish: AllianceHeartPublisher,
)
{
    return new AllianceHeartPublicationService(
        interested,
        publish,
        { playerItemGiftRecipient, allianceHeartFailure },
        new AllianceHeartMapper(),
    ).deliver(payload);
}

export function readAllianceHeart(
    tx: AllianceTransaction,
    owner: string,
    command: string,
    request?: Uint8Array,
)
{
    return repository.read(tx, owner, command, request);
}

export function writeAllianceHeart(
    tx: AllianceTransaction,
    owner: string,
    write: AllianceHeartWrite,
)
{
    return repository.write(tx, owner, write);
}

export function pendingAllianceHeartOwners(
    db: DatabaseClient<"kingdom">,
    online: readonly string[],
)
{
    return repository.pendingOwners(db, online);
}
