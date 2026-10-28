const digitZeros = [
    0x30,
    0x660,
    0x6f0,
    0x7c0,
    0x966,
    0x9e6,
    0xa66,
    0xae6,
    0xb66,
    0xbe6,
    0xc66,
    0xce6,
    0xd66,
    0xe50,
    0xed0,
    0xf20,
    0x1040,
    0x1090,
    0x17e0,
    0x1810,
    0x1946,
    0x19d0,
    0x1a80,
    0x1a90,
    0x1b50,
    0x1bb0,
    0x1c40,
    0x1c50,
    0xa620,
    0xa8d0,
    0xa900,
    0xa9d0,
    0xaa50,
    0xabf0,
    0xff10,
];

export function javaDigit(code: number): number | undefined
{
    const zero = digitZeros.find((zero) => code >= zero && code <= zero + 9);

    return zero === undefined ? undefined : code - zero;
}

export function javaDecimal(raw: unknown, bits: 32 | 64): bigint
{
    if (typeof raw !== "string" || raw.length > 65535)
    {
        throw new Error("Invalid decimal integer");
    }

    const negative = raw[0] === "-";
    const start = negative || raw[0] === "+" ? 1 : 0;

    if (start === raw.length)
    {
        throw new Error("Invalid decimal integer");
    }

    const bound = (1n << BigInt(bits - 1)) - (negative ? 0n : 1n);
    let value = 0n;

    for (let index = start; index < raw.length; index++)
    {
        const digit = javaDigit(raw.charCodeAt(index));

        if (digit === undefined)
        {
            throw new Error("Invalid decimal integer");
        }

        value = value * 10n + BigInt(digit);

        if (value > bound)
        {
            throw new Error("Invalid decimal integer");
        }
    }

    return negative ? -value : value;
}
