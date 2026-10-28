import { mysqlUnicodeWeights } from "./mysql-unicode-weights.ts";

function weights(code: number): number[]
{
    let left = 0,
        right = mysqlUnicodeWeights.length - 1;

    while (left <= right)
    {
        const middle = (left + right) >>> 1;
        const row = mysqlUnicodeWeights[middle]!;

        if (code < row[0]!)
        {
            right = middle - 1;
        }
        else if (code > row[1]!)
        {
            left = middle + 1;
        }
        else
        {
            const result = row.slice(3);

            if (result.length)
            {
                result[result.length - 1]! += (code - row[0]!) * row[2]!;
            }

            return result;
        }
    }

    const base = code >= 0x3400 && code <= 0x4db5
        ? 0xfb80
        : code >= 0x4e00 && code <= 0x9fa5
        ? 0xfb40
        : 0xfbc0;

    return [base + (code >>> 15), (code & 0x7fff) | 0x8000];
}

export function mysqlUtf8UnicodeKey(text: string): string
{
    if (typeof text !== "string" || text.length > 65535)
    {
        throw new Error("Invalid utf8_unicode_ci text");
    }

    const result: number[] = [];

    for (let index = 0; index < text.length; index++)
    {
        const code = text.charCodeAt(index);

        if (code >= 0xd800 && code <= 0xdfff)
        {
            throw new Error("Invalid utf8_unicode_ci character");
        }

        result.push(...weights(code));
    }

    while (result.at(-1) === 0x0209)
    {
        result.pop();
    }

    return result.map((weight) => weight.toString(16).padStart(4, "0")).join("");
}

export function mysqlUtf8UnicodeCandidates(texts: readonly string[]): string
{
    const allowed = new Set<number>([0x0209]);

    for (const text of texts)
    {
        const key = mysqlUtf8UnicodeKey(text);

        for (let index = 0; index < key.length; index += 4)
        {
            allowed.add(Number.parseInt(key.slice(index, index + 4), 16));
        }
    }

    const ranges: number[][] = [];

    for (let code = 1; code <= 0xffff; code++)
    {
        if (code >= 0xd800 && code <= 0xdfff)
        {
            continue;
        }

        if (!weights(code).every((weight) => allowed.has(weight)))
        {
            continue;
        }

        const last = ranges.at(-1);

        if (last && last[1] === code - 1)
        {
            last[1] = code;
        }
        else
        {
            ranges.push([code, code]);
        }
    }

    const escape = (code: number) => `\\u${code.toString(16).padStart(4, "0")}`;

    return `^[${
        ranges
            .map(([first, last]) =>
                first === last ? escape(first!) : `${escape(first!)}-${escape(last!)}`
            )
            .join("")
    }]*$`;
}
