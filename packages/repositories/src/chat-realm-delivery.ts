import { eq } from "drizzle-orm";
import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import type { ChatRepository } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/errors/chat";
import type { Database } from "./game.ts";

export function createRealmChatEvents(
    databases: Database["databases"],
    repository: ChatRepository,
    render: (
        realm: number,
        owners: string[],
        events: import("@opencok/contracts/chat-delivery").ChatDeliveryEvent[],
    ) => Promise<unknown>,
)
{
    return async (
        owner: string,
        realm: number,
        command: string,
        params: Record<string, unknown>,
    ): Promise<Record<string, unknown>> => {
        const kingdom = databases.kingdoms.get(realm);

        if (
            !kingdom
            || !repository.delivery
            || owner !== `realm-${realm}`
            || typeof params.token !== "string"
            || typeof params.epoch !== "string"
        )
        {
            throw new ChatCommandError("unauthorized");
        }

        const [authority] = await kingdom.db
            .select()
            .from(realm_authority)
            .where(eq(realm_authority.kingdomId, realm))
            .limit(1);

        if (
            !authority
            || authority.instanceId !== params.token
            || String(authority.ownerEpoch) !== params.epoch
        )
        {
            throw new ChatCommandError("unauthorized");
        }

        const consumer = `realm-${realm}`;

        if (command === "realm.events.ack")
        {
            if (typeof params.cursor !== "string")
            {
                throw new ChatCommandError("invalid_cursor");
            }

            await repository.delivery.acknowledge(consumer, params.token, params.cursor);

            return {};
        }

        if (
            command !== "realm.events.poll"
            || !Array.isArray(params.owners)
            || params.owners.length > 4
            || params.owners.some((uid) =>
                typeof uid !== "string" || !/^[a-zA-Z0-9_-]{1,40}$/.test(uid)
            )
        )
        {
            throw new ChatCommandError("invalid_request");
        }

        if (
            params.end !== undefined
            && (typeof params.end !== "string" || !/^\d+$/.test(params.end))
        )
        {
            throw new ChatCommandError("invalid_cursor");
        }

        await repository.delivery.acquire(consumer, params.token);
        const batch = await repository.delivery.poll(consumer, params.token, 20);
        const events = params.end
            ? batch.events.filter((event) => BigInt(event.sequence) <= BigInt(params.end as string))
            : batch.events;

        return {
            cursor: events.at(-1)?.sequence ?? "",
            resync: batch.resync,
            deliveries: await render(realm, params.owners as string[], events),
        };
    };
}
