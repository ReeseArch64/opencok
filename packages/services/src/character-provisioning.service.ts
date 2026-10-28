import { characterSeed } from "@opencok/rules/character-seed";
import type { CharacterCreator, CharacterReservation } from "@opencok/contracts/provisioning";
import type { Rules } from "@opencok/rules/game";
import { reservationSchema } from "@opencok/validations/provisioning";

export class CharacterProvisioningService
{
    constructor(
        readonly execute: CharacterCreator,
        readonly rules: Rules,
    )
    {}

    async create(input: CharacterReservation)
    {
        const reservation = reservationSchema.parse(input);

        return this.execute(
            reservation,
            (now) => characterSeed({ ...reservation, createdAt: now }, this.rules),
        );
    }
}
