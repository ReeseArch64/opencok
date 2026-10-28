import { ProtocolError } from "./sfs.ts";

export function decodeStoredJson(data: Buffer): unknown
{
    return decodeJson(data, 65535);
}

export function decodePublishedJson(data: Buffer): unknown
{
    return decodeJson(data, 4194304);
}

function decodeJson(data: Buffer, limit: number): unknown
{
    if (!Buffer.isBuffer(data) || data.length > limit)
    {
        throw new ProtocolError();
    }

    try
    {
        const decoded = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(data);
        let start = 0;
        let end = decoded.length;

        while (start < end && decoded.charCodeAt(start) <= 32)
        {
            start++;
        }

        while (end > start && decoded.charCodeAt(end - 1) <= 32)
        {
            end--;
        }

        const json = decoded.slice(start, end);

        return JSON.parse(json, (_key: string, value: unknown, context?: { source?: string; }) => {
            if (typeof value !== "number")
            {
                return value;
            }

            if (!context?.source)
            {
                throw new ProtocolError();
            }

            if (/^-?\d+$/.test(context.source))
            {
                return BigInt(context.source);
            }

            if (!Number.isFinite(value))
            {
                throw new ProtocolError();
            }

            return value;
        });
    }
    catch
    {
        throw new ProtocolError();
    }
}
