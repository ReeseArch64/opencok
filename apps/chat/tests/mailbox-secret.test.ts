import { expect, test } from "bun:test";
import { createHash, randomUUID } from "node:crypto";
import { once } from "node:events";
import type { ChatRepository } from "@opencok/contracts/chat";
import { encodeChatMailbox } from "@opencok/contracts/chat-mailbox";
import { encodeChatNickname } from "@opencok/contracts/chat-nickname";
import { encodeAvatarProfile } from "@opencok/contracts/chat-avatar-profile";
import { signChatMailbox } from "@opencok/identity/chat-mailbox";
import { signChatNickname } from "@opencok/identity/chat-nickname";
import { signChatAvatarProfile } from "@opencok/identity/chat-avatar-profile";
import { createChatApp } from "../src/app";

for (const kingdomId of [1, 2])
{
    test(`shared Chat key authenticates private routes for realm ${kingdomId}`, async () => {
        const backendSecret = "synthetic-backend-secret";
        const wrongSecret = "synthetic-wrong-secret";
        const calls = { mailbox: 0, nickname: 0, avatar: 0, session: 0 };
        const repository: ChatRepository = {
            profiles: {
                publish: async () => {
                    calls.avatar++;
                    return "applied";
                },
                find: async () => null,
            },
            nicknames: {
                refresh: async () => {
                    calls.nickname++;
                    return "applied";
                },
            },
            mailbox: {
                list: async () => [],
                apply: async () => {
                    calls.mailbox++;
                    return "applied";
                },
            },
            sessions: {
                create: async () => {
                    calls.session++;
                },
                getById: async () => null,
            },
            messages: {
                create: async () => {
                    throw new Error("unused");
                },
                getAll: async () => [],
                getAllByRange: async () => [],
            },
            getPlayerStateById: async () => null,
            health: async () => {},
            deleteExpired: async () => ({ messages: 0, sessions: 0 }),
        };

        const app = createChatApp({
            repository,
            signingSecret: backendSecret,
            websocketUrl: "ws://localhost/chat/ws",
        });
        try
        {
            app.server.listen(0, "127.0.0.1");
            await once(app.server, "listening");
            await app.runMaintenance();
            const address = app.server.address();
            if (!address || typeof address === "string")
            {
                throw new Error("Missing Chat port");
            }
            const origin = `http://127.0.0.1:${address.port}`;
            const identity = { owner: "1", kingdomId, operationId: randomUUID() };
            const mailbox = encodeChatMailbox({
                ...identity,
                effectIndex: 0,
                action: "read",
                others: "2",
                types: [1],
                requestedAt: Date.now(),
            });
            const signed = async (
                path: string,
                body: string,
                sign: typeof signChatMailbox,
                secret: string,
            ) => {
                const timestamp = String(Date.now());
                return fetch(`${origin}${path}`, {
                    method: "POST",
                    body,
                    headers: {
                        "content-type": "application/json",
                        "x-opencok-timestamp": timestamp,
                        "x-opencok-signature": sign(body, timestamp, secret),
                    },
                });
            };
            expect(
                (await signed("/_internal/mailbox", mailbox, signChatMailbox, wrongSecret))
                    .status,
            )
                .toBe(403);
            expect(
                (await signed("/_internal/mailbox", mailbox, signChatMailbox, backendSecret))
                    .status,
            )
                .toBe(200);

            const timestamp = String(Date.now());
            const changedRealm = JSON.stringify({
                ...JSON.parse(mailbox),
                kingdomId: kingdomId + 1,
            });
            expect(
                (await fetch(`${origin}/_internal/mailbox`, {
                    method: "POST",
                    body: changedRealm,
                    headers: {
                        "content-type": "application/json",
                        "x-opencok-timestamp": timestamp,
                        "x-opencok-signature": signChatMailbox(mailbox, timestamp, backendSecret),
                    },
                })).status,
            ).toBe(403);
            expect(
                (await signed("/_internal/mailbox", mailbox, signChatNickname, backendSecret))
                    .status,
            )
                .toBe(403);

            const nickname = encodeChatNickname(identity);
            const avatar = encodeAvatarProfile({
                owner: "1",
                kingdomId,
                sequence: 1,
                picVer: 1,
                committedAt: 1000n,
                updatedAt: "1",
                userName: "Player",
                platform: "test",
            });
            expect(
                (await signed("/_internal/nickname", nickname, signChatNickname, wrongSecret))
                    .status,
            )
                .toBe(403);
            expect(
                (await signed(
                    "/_internal/avatar-profile",
                    avatar,
                    signChatAvatarProfile,
                    wrongSecret,
                )).status,
            )
                .toBe(403);
            const session = async (secret: string) => {
                const form = new URLSearchParams({
                    appid: "synthetic",
                    ttl: "86400",
                    uid: "1",
                    userinfo: "{}",
                });
                form.set(
                    "sign",
                    createHash("md5").update(
                        [...form].map(([key, value]) => `${key}${value}`).join("") + secret,
                    ).digest("hex"),
                );
                return fetch(`${origin}/external/session`, { method: "POST", body: form });
            };
            expect((await session(wrongSecret)).status).toBe(403);
            expect(
                (await signed("/_internal/nickname", nickname, signChatNickname, backendSecret))
                    .status,
            ).toBe(200);
            expect(
                (await signed(
                    "/_internal/avatar-profile",
                    avatar,
                    signChatAvatarProfile,
                    backendSecret,
                )).status,
            ).toBe(200);
            expect((await session(backendSecret)).status).toBe(200);
            expect(calls).toEqual({
                mailbox: 1,
                nickname: 1,
                avatar: 1,
                session: 1,
            });
        }
        finally
        {
            await app.close();
        }
    });
}
