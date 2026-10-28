import { createHash } from "node:crypto";
import type { CharacterReservation } from "@opencok/contracts/provisioning";

export function provisionHash(input: CharacterReservation): string
{
    return createHash("sha256")
        .update(
            JSON.stringify({
                kingdomId: input.kingdomId,
                deviceUuid: input.deviceUuid,
                country: input.country,
                language: input.language,
                identityId: input.identityId,
                gameUid: input.gameUid,
                name: input.name,
                createdAt: input.createdAt,
                preset: input.preset,
            }),
        )
        .digest("hex");
}
