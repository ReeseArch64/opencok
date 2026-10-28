import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function questUnavailable(): never
{
    throw new GameError(errors.locked, "city_progression");
}
