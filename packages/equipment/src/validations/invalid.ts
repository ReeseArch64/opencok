import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function invalidEquipment(): never
{
    throw new GameError(errors.invalid, "city_progression");
}
