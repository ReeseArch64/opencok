import { z } from "zod";
import { packets } from "./world";

export const maxPacketBytes = 65536;
export type WireSchema = {
    type: string;
    maximum?: number;
    maxLength?: number;
    maxItems?: number;
    properties?: Record<string, WireSchema>;
    items?: WireSchema;
};
export const wireSchema = (schema: z.ZodType) => z.toJSONSchema(schema) as unknown as WireSchema;

export function encodePacket(opcode: number, value: unknown): Uint8Array
{
    const packet = packets.find((p) => p.opcode === opcode);
    if (!packet)
    {
        throw new Error("Unknown packet");
    }
    const parsed = packet.schema.parse(value);
    const bytes = new Uint8Array(maxPacketBytes);
    const view = new DataView(bytes.buffer);
    bytes.set([1, opcode]);
    let offset = 2;
    function uint(n: number)
    {
        if (offset + 4 > bytes.length)
        {
            throw new Error("Packet too large");
        }
        view.setUint32(offset, n);
        offset += 4;
    }
    function write(schema: WireSchema, v: any)
    {
        if (schema.type === "integer")
        {
            uint(v);
        }
        else if (schema.type === "string")
        {
            const encoded = new TextEncoder().encode(v);
            if (encoded.length > schema.maxLength!)
            {
                throw new Error("String too long");
            }
            uint(encoded.length);
            if (offset + encoded.length > bytes.length)
            {
                throw new Error("Packet too large");
            }
            bytes.set(encoded, offset);
            offset += encoded.length;
        }
        else if (schema.type === "array")
        {
            uint(v.length);
            for (const item of v)
            {
                write(schema.items!, item);
            }
        }
        else if (schema.type === "object")
        {
            for (const [key, child] of Object.entries(schema.properties!))
            {
                write(child, v[key]);
            }
        }
        else
        {
            throw new Error("Unsupported schema");
        }
    }
    write(wireSchema(packet.schema), parsed);
    return bytes.slice(0, offset);
}

export function decodePacket(bytes: Uint8Array): {
    opcode: number;
    value: unknown;
}
{
    if (bytes.length < 2 || bytes.length > maxPacketBytes || bytes[0] !== 1)
    {
        throw new Error("Invalid packet");
    }
    const packet = packets.find((p) => p.opcode === bytes[1]);
    if (!packet)
    {
        throw new Error("Unknown packet");
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 2;
    function uint()
    {
        if (offset + 4 > bytes.length)
        {
            throw new Error("Truncated packet");
        }
        const n = view.getUint32(offset);
        offset += 4;
        return n;
    }
    function read(schema: WireSchema): unknown
    {
        if (schema.type === "integer")
        {
            return uint();
        }
        if (schema.type === "string")
        {
            const count = uint();
            if (count > schema.maxLength! || offset + count > bytes.length)
            {
                throw new Error("Invalid string");
            }
            const value = new TextDecoder("utf-8", { fatal: true }).decode(
                bytes.subarray(offset, offset + count),
            );
            offset += count;
            return value;
        }
        if (schema.type === "array")
        {
            const count = uint();
            if (count > schema.maxItems!)
            {
                throw new Error("Invalid array");
            }
            return Array.from({ length: count }, () => read(schema.items!));
        }
        if (schema.type === "object")
        {
            return Object.fromEntries(
                Object.entries(schema.properties!).map(([key, child]) => [
                    key,
                    read(child),
                ]),
            );
        }
        throw new Error("Unsupported schema");
    }
    const value = packet.schema.parse(read(wireSchema(packet.schema)));
    if (offset !== bytes.length)
    {
        throw new Error("Trailing packet bytes");
    }
    return { opcode: packet.opcode, value };
}
