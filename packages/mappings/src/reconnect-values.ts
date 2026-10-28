import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export function invalid(): never
{
    throw new GameError(errors.unsupported, "reconnect");
}

export function signed(value: unknown, bits: 32 | 64): bigint
{
    if (value === null || value === undefined)
    {
        return 0n;
    }

    if (typeof value === "number" && !Number.isSafeInteger(value))
    {
        return invalid();
    }

    if (!/^[+-]?\d+$/.test(String(value)))
    {
        return invalid();
    }

    const parsed = BigInt(String(value));

    if (BigInt.asIntN(bits, parsed) !== parsed)
    {
        return invalid();
    }

    return parsed;
}
