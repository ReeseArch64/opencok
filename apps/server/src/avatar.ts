import { sfs } from "@opencok/messages/sfs";
import { createAvatarVersion } from "@opencok/services/avatar-version";
import {
    commitAvatarVersion,
    deliverAvatarVersionMail,
    publishAvatarVersionEffect,
    nextAvatarVersionDelivery,
} from "@opencok/repositories/avatar-version";
import type { AvatarFiles } from "@opencok/contracts/files";
import type { ServerConfig } from "@opencok/contracts/server";
import type { Rules } from "@opencok/rules/game";
import type { Database } from "@opencok/repositories/game";
import type { Cache } from "@opencok/storage/session";
import type { RealmNotifications } from "@opencok/connection/notifications";
import { createAvatarCompletion } from "@opencok/services/avatar-completion";
import { commitAvatarFinish } from "@opencok/repositories/avatar-finish";
import { deliverAvatarMail } from "@opencok/repositories/avatar-mail";
import { publishAvatarProfile, publishAvatarChat } from "@opencok/repositories/avatar-profile";
import { nextAvatarDelivery } from "@opencok/repositories/avatar-delivery";
import { avatarSystemMail } from "@opencok/rules/avatar-mail";
import { avatarProfileUpdate, avatarChatUpdate } from "@opencok/rules/avatar-profile";
import { createChatAvatarProfilePublisher } from "@opencok/connection/chat-avatar-profile";

export function createAvatarRuntime(options: {
    db: { kingdom: Pick<Database["kingdom"], "db">; };
    files: AvatarFiles;
    rules: Rules;
    config: Pick<ServerConfig, "kingdomId" | "timeoutMs" | "avatarChat">;
    cache: Pick<Cache, "publishPlayerUpdateTime">;
    notifications: RealmNotifications;
    report(effect: "mail" | "profile" | "chat" | "notification"): void;
    fetch?: (url: string, options: RequestInit) => Promise<Response>;
    now?: () => number;
})
{
    const { db, files, rules, config, cache, notifications, report } = options;
    const publish = config.avatarChat
        ? createChatAvatarProfilePublisher({
            ...config.avatarChat,
            timeoutMs: config.timeoutMs,
            fetch: options.fetch,
            now: options.now,
        })
        : undefined;
    const service = createAvatarCompletion({
        files,
        rules,
        kingdomId: config.kingdomId,
        report,
        store: {
            commit: async (owner, query, find, inspect) => {
                try
                {
                    return await commitAvatarFinish(
                        db.kingdom.db,
                        config.kingdomId,
                        owner,
                        query,
                        find,
                        inspect,
                    );
                }
                catch (error)
                {
                    try
                    {
                        const recovered = await commitAvatarFinish(
                            db.kingdom.db,
                            config.kingdomId,
                            owner,
                            query,
                            find,
                            async () => {
                                throw error;
                            },
                            true,
                        );

                        if (recovered.picVer === undefined)
                        {
                            throw error;
                        }

                        return recovered;
                    }
                    catch
                    {
                        throw error;
                    }
                }
            },
        },
        mail: (owner, sequence) =>
            deliverAvatarMail(db.kingdom.db, config.kingdomId, owner, sequence, avatarSystemMail),
        profile: (owner, sequence) =>
            publishAvatarProfile(
                db.kingdom.db,
                config.kingdomId,
                owner,
                sequence,
                avatarProfileUpdate,
                async (update, signal) => {
                    signal.throwIfAborted();
                    await cache.publishPlayerUpdateTime(update.owner, update.updatedAt);
                },
                config.timeoutMs,
            ),
        chat: (owner, sequence) =>
            publish
                ? publishAvatarChat(
                    db.kingdom.db,
                    config.kingdomId,
                    owner,
                    sequence,
                    avatarChatUpdate,
                    publish,
                    config.timeoutMs,
                )
                : Promise.resolve({ profile: undefined, published: false }),
        notify: async (owner, command, body) => {
            await notifications.publish(owner, command, body);
        },
    });
    const versionService = createAvatarVersion({
        rules,
        kingdomId: config.kingdomId,
        report,
        commit: async (owner, operationId, now, inspect) => {
            try
            {
                return await commitAvatarVersion(
                    db.kingdom.db,
                    config.kingdomId,
                    owner,
                    operationId,
                    now,
                    inspect,
                );
            }
            catch (error)
            {
                try
                {
                    const recovered = await commitAvatarVersion(
                        db.kingdom.db,
                        config.kingdomId,
                        owner,
                        operationId,
                        now,
                        inspect,
                        true,
                    );

                    if (!recovered.intent)
                    {
                        throw error;
                    }

                    return recovered;
                }
                catch
                {
                    throw error;
                }
            }
        },
        mail: (owner, operationId) =>
            deliverAvatarVersionMail(db.kingdom.db, config.kingdomId, owner, operationId),
        profile: (owner, operationId) =>
            publishAvatarVersionEffect(
                2,
                db.kingdom.db,
                config.kingdomId,
                owner,
                operationId,
                async (update, signal) => {
                    signal.throwIfAborted();
                    await cache.publishPlayerUpdateTime(update.owner, update.updatedAt);
                },
                config.timeoutMs,
            ),
        chat: (owner, operationId) =>
            publish
                ? publishAvatarVersionEffect(
                    4,
                    db.kingdom.db,
                    config.kingdomId,
                    owner,
                    operationId,
                    publish,
                    config.timeoutMs,
                )
                : Promise.resolve(),
        notification: (owner, operationId) =>
            publishAvatarVersionEffect(
                8,
                db.kingdom.db,
                config.kingdomId,
                owner,
                operationId,
                async (update, signal) => {
                    signal.throwIfAborted();
                    await notifications.publish(
                        owner,
                        "push.picVer.update",
                        { uid: sfs.string(owner), picVer: sfs.int(update.picVer) },
                        signal,
                    );
                    signal.throwIfAborted();
                },
                config.timeoutMs,
            ),
        notify: async (owner, command, body) => {
            await notifications.publish(owner, command, body);
        },
    });

    return {
        service,
        versionService,
        nextVersion: (cursor?: Parameters<typeof nextAvatarVersionDelivery>[2]) =>
            nextAvatarVersionDelivery(db.kingdom.db, config.kingdomId, cursor),
        next: (cursor?: Parameters<typeof nextAvatarDelivery>[2]) =>
            nextAvatarDelivery(db.kingdom.db, config.kingdomId, cursor),
    };
}
