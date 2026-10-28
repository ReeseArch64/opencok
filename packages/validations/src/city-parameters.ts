import { Type, type Fields } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function progressionBoolean(params: Fields, name: string, fallback = false)
{
    if (!params[name])
    {
        return fallback;
    }

    if (params[name]!.type !== Type.Bool || typeof params[name]!.value !== "boolean")
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    return params[name]!.value as boolean;
}
