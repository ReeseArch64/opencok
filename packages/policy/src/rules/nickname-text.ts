import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export function validateNicknameText(text: string): void
{
    if (typeof text !== "string" || text.length > 65535)
    {
        throw new GameError(errors.invalid);
    }
}

export function nicknameTrim(text: string): string
{
    validateNicknameText(text);
    let first = 0,
        last = text.length;

    while (first < last && text.charCodeAt(first) <= 32)
    {
        first++;
    }

    while (last > first && text.charCodeAt(last - 1) <= 32)
    {
        last--;
    }

    return text.slice(first, last);
}
