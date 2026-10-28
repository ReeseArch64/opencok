import { ChatSocialAction } from "@opencok/enums/chat-social-action";
import { planChatSocial } from "./chat-social-plan.ts";
import type { ChatSocialCommand, ChatSocialStore } from "@opencok/contracts/chat-social";
import { chatSocialParams } from "@opencok/validations/chat-social";
import { ChatCommandError } from "@opencok/errors/chat";
import type { ShareFeedPlanner } from "@opencok/share/contracts/runtime";
import type { ShareFeedNormalizer } from "@opencok/share/contracts/envelope";

export const chatSocialCommands: readonly ChatSocialCommand[] = Object.values(ChatSocialAction);

export class ChatSocialService
{
    public constructor(
        private readonly store: ChatSocialStore,
        private readonly share: ShareFeedPlanner,
        private readonly normalizeFeed: ShareFeedNormalizer,
    )
    {}

    public async execute(owner: string, command: ChatSocialCommand, params: unknown, key: unknown)
    {
        const parsed = chatSocialParams.safeParse(params);

        if (!parsed.success || typeof key !== "string" || !/^[a-zA-Z0-9_:-]{1,128}$/.test(key))
        {
            throw new ChatCommandError("invalid_request");
        }

        const value = parsed.data;
        const sequence = Number(value.seqId ?? value.seqid ?? 0);

        if (!Number.isSafeInteger(sequence))
        {
            throw new ChatCommandError("invalid_cursor");
        }

        const operation = {
            owner,
            operationId: key,
            command,
            target: value.friendUid
                ?? value.reportUid
                ?? (typeof value.uid === "string" ? value.uid : undefined)
                ?? value.uuid
                ?? "",
            room: value.roomId ?? value.id ?? value.room ?? "",
            name: value.name ?? "",
            body: value.msg ?? value.content ?? value.banMsg ?? "",
            description: value.description ?? "",
            members: [...new Set(value.members ?? [])],
            ids: (Array.isArray(value.uid) ? value.uid : undefined)
                ?? value.roomids
                ?? value.uuids?.split(",").filter(Boolean)
                ?? value.ids?.split(",").filter(Boolean)
                ?? [],
            duration: (value.time ?? 3600) * 1000,
            sequence,
            limit: value.count ?? 100,
            ...this.normalizeFeed(value),
        };

        return this.store.execute(operation, (tx) => planChatSocial(operation, tx, this.share));
    }
}

export type ChatSocialServiceFactory = (store: ChatSocialStore) => ChatSocialService;
