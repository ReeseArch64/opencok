import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export function invalid(): never
{
    throw new GameError(errors.unsupported, "public_profile");
}

export function integer(value: unknown): number
{
    if (!/^[+-]?\d+$/.test(String(value)))
    {
        return invalid();
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number < -2147483648 || number > 2147483647)
    {
        return invalid();
    }

    return number;
}

export function deadline(value: unknown): bigint
{
    if (typeof value === "number" && !Number.isSafeInteger(value))
    {
        return invalid();
    }

    if (!/^[+-]?\d+$/.test(String(value)))
    {
        return invalid();
    }

    const number = BigInt(String(value));

    if (BigInt.asIntN(64, number) !== number)
    {
        return invalid();
    }

    return number;
}
