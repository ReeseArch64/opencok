import type { NicknameCheck, NicknameCheckProviders } from "../contracts/nickname-check.ts";
import {
    nicknameTrim,
    validateNicknameText as validateText,
} from "@opencok/policy/rules/nickname-text";
import { nicknameLength, nicknameCharactersAllowed } from "@opencok/rules/nickname";
import { mailBlank } from "@opencok/rules/mail";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export async function checkNickname(
    raw: string,
    type: number,
    providers: NicknameCheckProviders,
): Promise<NicknameCheck>
{
    validateText(raw);

    if (!Number.isInteger(type) || type < -2147483648 || type > 2147483647)
    {
        throw new GameError(errors.invalid);
    }

    const name = nicknameTrim(raw);
    const length = nicknameLength(name);
    const reportedLength = length + raw.split(" ").length - 1;
    const result: NicknameCheck = {
        occupied: 0,
        exist: mailBlank(raw) || name.startsWith("(") ? -1 : 0,
        length: reportedLength,
        remainLength: 16 - reportedLength,
    };

    if (length < 3 || length > 16 || !nicknameCharactersAllowed(name))
    {
        result.exist = -1;
    }
    else if (await providers.containsBadWords(name))
    {
        result.exist = -1;
    }
    else if (type === 0 && (await providers.occupied(name)))
    {
        result.exist = -1;
        result.occupied = 1;
    }

    return result;
}
