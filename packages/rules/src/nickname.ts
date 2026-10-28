import { validateNicknameText as validateText } from "@opencok/policy/rules/nickname-text";
import { javaGbkLength } from "./java-gbk.ts";
import { mailBlank } from "./mail.ts";

export { nicknameTrim } from "@opencok/policy/rules/nickname-text";

export function nicknameLength(text: string): number
{
    validateText(text);

    if (mailBlank(text))
    {
        return 0;
    }

    const encoded = text.replace(/[\u007e-\u05ff]/g, "");

    return text.length - encoded.length + javaGbkLength(encoded);
}

export function nicknameCharactersAllowed(text: string): boolean
{
    validateText(text);

    if (/[\b\f\n\r\t"\\/\u2600-\u27bf]|[\u{10000}-\u{10ffff}]/u.test(text))
    {
        return false;
    }

    let depth = 0;

    for (const character of text)
    {
        if (character === "{")
        {
            depth++;
        }

        if (character === "}" && --depth < 0)
        {
            return false;
        }
    }

    return depth === 0;
}
