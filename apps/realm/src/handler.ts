import { Effect } from "effect";
import { decodePacket, encodePacket } from "@opencok/contracts/binary";
import { mapQuery } from "@opencok/contracts";
import { World } from "./modules/world/world";

export function handler(world = new World())
{
    return async (request: Request): Promise<Response> => {
        const url = new URL(request.url);
        if (request.method === "GET" && url.pathname === "/healthz")
        {
            return Response.json({ status: "ok", kingdomId: world.id });
        }
        if (request.method !== "POST" || url.pathname !== "/map/query")
        {
            return new Response("Not found", { status: 404 });
        }
        try
        {
            const reader = request.body?.getReader();
            if (!reader)
            {
                return new Response("Missing body", { status: 400 });
            }
            const bytes = new Uint8Array(26);
            let offset = 0;
            try
            {
                while (true)
                {
                    const { done, value } = await reader.read();
                    if (done)
                    {
                        break;
                    }
                    if (offset + value.length > bytes.length)
                    {
                        await reader.cancel();
                        return new Response("Body too large", { status: 413 });
                    }
                    bytes.set(value, offset);
                    offset += value.length;
                }
            }
            finally
            {
                reader.releaseLock();
            }
            const packet = decodePacket(bytes.subarray(0, offset));
            if (packet.opcode !== 16)
            {
                return new Response("Invalid packet", { status: 400 });
            }
            const query = mapQuery.parse(packet.value);
            const region = Effect.runSync(Effect.sync(() => world.query(query)));
            return new Response(encodePacket(17, region).slice().buffer, {
                headers: { "Content-Type": "application/octet-stream" },
            });
        }
        catch
        {
            return new Response("Invalid packet", { status: 400 });
        }
    };
}
