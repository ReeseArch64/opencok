import { javaNicknameCharacter } from "./java-nickname-characters.ts";

function word(codePoint: number): boolean
{
    return codePoint === 95 || javaNicknameCharacter(codePoint) === 1;
}

function base(text: string, index: number): boolean
{
    for (; index >= 0; index--)
    {
        const kind = javaNicknameCharacter(text.codePointAt(index)!);

        if (kind === 1)
        {
            return true;
        }

        if (kind !== 2)
        {
            return false;
        }
    }

    return false;
}

function boundary(text: string, index: number): boolean
{
    let left = false,
        right = false;

    if (index > 0)
    {
        const last = text.charCodeAt(index - 1);
        const previous = index > 1 ? text.charCodeAt(index - 2) : 0;
        const codePoint =
            last >= 0xdc00 && last <= 0xdfff && previous >= 0xd800 && previous <= 0xdbff
                ? text.codePointAt(index - 2)!
                : last;
        left = word(codePoint) || (javaNicknameCharacter(codePoint) === 2 && base(text, index - 1));
    }

    if (index < text.length)
    {
        const codePoint = text.codePointAt(index)!;
        right = word(codePoint) || (javaNicknameCharacter(codePoint) === 2 && base(text, index));
    }

    return left !== right;
}

function asciiWord(text: string, entry: string): boolean
{
    const name = text.replace(/[A-Z]/g, (character) => character.toLowerCase());
    const target = entry.toLowerCase();

    for (let start = 0; start <= name.length;)
    {
        const found = name.indexOf(target, start);

        if (found < 0)
        {
            return false;
        }

        if (boundary(text, found) && boundary(text, found + target.length))
        {
            return true;
        }

        start = found + 1;
    }

    return false;
}

function space(unit: number): boolean
{
    return unit === 32 || (unit >= 9 && unit <= 13);
}

function end(text: string, index: number): boolean
{
    if (index === text.length)
    {
        return true;
    }

    if (index === text.length - 2)
    {
        return text.endsWith("\r\n");
    }

    if (index !== text.length - 1)
    {
        return false;
    }

    const unit = text.charCodeAt(index);

    return unit === 10
        ? text.charCodeAt(index - 1) !== 13
        : [13, 133, 0x2028, 0x2029].includes(unit);
}

function expandedPattern(entry: string): { branches: number[][]; supplementary: boolean; }
{
    const branches: number[][] = [[]];
    let supplementary = false;

    for (let index = 0; index < entry.length; index++)
    {
        const unit = entry.charCodeAt(index);

        if (unit >= 0xd800 && unit <= 0xdfff)
        {
            supplementary = true;
        }

        if (unit === 124)
        {
            branches.push([]);
        }
        else
        {
            branches.at(-1)!.push(unit === 94 ? -2 : unit === 36 ? -3 : unit);
        }

        branches.at(-1)!.push(-1);
    }

    return { branches, supplementary };
}

function expanded(text: string, entry: string): boolean
{
    const { branches, supplementary } = expandedPattern(entry);
    const initial = new Uint8Array(text.length + 1);

    for (
        let index = 0;
        index <= text.length;
        index += supplementary && text.codePointAt(index)! > 65535 ? 2 : 1
    )
    {
        initial[index] = 1;
    }

    for (const branch of branches)
    {
        let positions = initial;

        for (const token of branch)
        {
            const next = new Uint8Array(text.length + 1);

            if (token === -1)
            {
                for (let index = 0; index <= text.length; index++)
                {
                    if (positions[index] || next[index])
                    {
                        next[index] = 1;

                        if (index < text.length && space(text.charCodeAt(index)))
                        {
                            next[index + 1] = 1;
                        }
                    }
                }
            }
            else
            {
                for (let index = 0; index <= text.length; index++)
                {
                    if (positions[index])
                    {
                        if ((token === -2 && index === 0) || (token === -3 && end(text, index)))
                        {
                            next[index] = 1;
                        }
                        else if (token >= 0 && text.codePointAt(index) === token)
                        {
                            next[index + 1] = 1;
                        }
                    }
                }
            }

            positions = next;

            if (!positions.some(Boolean))
            {
                break;
            }
        }

        if (positions.some(Boolean))
        {
            return true;
        }
    }

    return false;
}

function replaceWord(text: string, entry: string): string
{
    const name = text.replace(/[A-Z]/g, (character) => character.toLowerCase());
    const target = entry.toLowerCase();
    const parts: string[] = [];
    let copied = 0;

    for (let start = 0; start <= text.length;)
    {
        const found = name.indexOf(target, start);

        if (found < 0)
        {
            break;
        }

        const last = found + target.length;

        if (boundary(text, found) && boundary(text, last))
        {
            parts.push(text.slice(copied, found), "**");
            copied = last;
            start = Math.max(last, found + 1);
        }
        else
        {
            start = found + 1;
        }
    }

    parts.push(text.slice(copied));

    return parts.join("");
}

function replaceExpanded(text: string, entry: string): string
{
    const { branches, supplementary } = expandedPattern(entry);
    const fold = (unit: number) => (unit >= 65 && unit <= 90 ? unit + 32 : unit);
    const ends = new Int32Array(text.length + 1).fill(-1);

    for (const branch of branches)
    {
        let next = Int32Array.from({ length: text.length + 1 }, (_, index) => index);

        for (let tokenIndex = branch.length - 1; tokenIndex >= 0; tokenIndex--)
        {
            const token = branch[tokenIndex]!;
            const current = new Int32Array(text.length + 1).fill(-1);

            for (let index = text.length; index >= 0; index--)
            {
                if (token === -1)
                {
                    current[index] = next[index]!;

                    if (index < text.length && space(text.charCodeAt(index)))
                    {
                        current[index] = Math.max(current[index]!, current[index + 1]!);
                    }
                }
                else if ((token === -2 && index === 0) || (token === -3 && end(text, index)))
                {
                    current[index] = next[index]!;
                }
                else if (
                    token >= 0
                    && index < text.length
                    && fold(text.codePointAt(index)!) === fold(token)
                )
                {
                    current[index] = next[index + 1]!;
                }
            }

            next = current;
        }

        for (let index = 0; index <= text.length; index++)
        {
            if (ends[index] === -1)
            {
                ends[index] = next[index]!;
            }
        }
    }

    const parts: string[] = [];
    let copied = 0;

    for (let index = 0; index <= text.length;)
    {
        const last = ends[index]!;

        if (last >= 0)
        {
            parts.push(text.slice(copied, index), "**");
            copied = last;
            index = Math.max(last, index + 1);
        }
        else
        {
            index += supplementary && text.codePointAt(index)! > 65535 ? 2 : 1;
        }
    }

    parts.push(text.slice(copied));

    return parts.join("");
}

export function filterNicknameBadWords(
    text: string,
    entries: readonly string[],
    locked = false,
): string
{
    if (locked)
    {
        return text;
    }

    let filtered = text;

    try
    {
        if (typeof text !== "string" || text.length > 65535)
        {
            throw new Error("Invalid nickname filter input");
        }

        for (const entry of entries)
        {
            if (typeof entry !== "string")
            {
                throw new Error("Invalid nickname filter entry");
            }

            filtered = !/[^A-Za-z0-9_]/.test(entry)
                ? replaceWord(filtered, entry)
                : replaceExpanded(filtered, entry);
        }
    }
    catch
    {
    }

    return filtered;
}

export function containsNicknameBadWords(
    text: string,
    entries: readonly string[],
    locked = false,
): boolean
{
    if (locked)
    {
        return true;
    }

    try
    {
        if (typeof text !== "string" || text.length > 65535)
        {
            throw new Error("Invalid nickname filter input");
        }

        for (const entry of entries)
        {
            if (typeof entry !== "string")
            {
                throw new Error("Invalid nickname filter entry");
            }

            if (!/[^A-Za-z0-9_]/.test(entry) ? asciiWord(text, entry) : expanded(text, entry))
            {
                return true;
            }
        }
    }
    catch
    {
    }

    return false;
}

export function nicknameBadWordEntries(
    entries: readonly string[],
    previous: readonly string[] = [],
): string[]
{
    const added = entries.filter((entry) => entry.length > 0);
    added.sort((left, right) => right.length - left.length);
    const result = [...previous, ...added];

    for (const omitted of [" ", "v"])
    {
        const index = result.indexOf(omitted);

        if (index >= 0)
        {
            result.splice(index, 1);
        }
    }

    return result;
}
