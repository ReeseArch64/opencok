import { expect, test } from "bun:test";
import { createChatDeliveryService } from "@opencok/services/chat-delivery";
import type { Peer, Frame } from "@opencok/contracts/chat";

test("durable distribution excludes revoked sessions while advancing the persisted cursor", async () => {
    const frames: Frame[] = [],
        acks: string[] = [];
    const peers = new Set<Peer>([
        {
            uid: "bob",
            connection: { joinedRooms: new Set(["global_public"]) },
            sendFrame: (frame) => {
                frames.push(frame);
            },
            authorizeSession: async () => false,
        },
    ]);
    const delivery = createChatDeliveryService({
        instance: "synthetic-consumer",
        peers,
        authorizeRoom: async () => ({ group: "global", roomId: "global_public" }),
        log: () => {},
        store: {
            acquire: async () => {},
            release: async () => {},
            acknowledge: async (_instance, _token, cursor) => {
                acks.push(cursor);
            },
            poll: async () => ({
                resync: false,
                events: [
                    {
                        id: "event-1",
                        sequence: "1",
                        owner: "alice",
                        target: null,
                        roomId: "global_public",
                        frame: null,
                        message: {
                            sequenceId: 1,
                            roomId: "global_public",
                            senderUid: "alice",
                            idempotencyKey: "1",
                            body: "Private to authorized sessions",
                            createdAt: new Date().toISOString(),
                        },
                    },
                ],
            }),
        },
    });
    try
    {
        await delivery.poll();
        expect(frames).toEqual([]);
        expect(acks).toEqual(["1"]);
    }
    finally
    {
        await delivery.close();
    }
});
