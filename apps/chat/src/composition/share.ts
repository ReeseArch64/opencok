import { randomUUID } from "node:crypto";
import { ShareFeedService } from "@opencok/share/services/feed";
import { ShareFeedPolicy } from "@opencok/share/rules/feed";
import { ShareFeedMapper } from "@opencok/share/mappings/feed";
import { ChatSocialService } from "@opencok/services/chat-social";
import type { ChatSocialStore } from "@opencok/contracts/chat-social";
import { ChatCommandError } from "@opencok/errors/chat";

export function createChatSocialService(store: ChatSocialStore)
{
    const runtime = {
        randomUUID,
        fail(code: string): never
        {
            throw new ChatCommandError(code);
        },
    };
    const mapper = new ShareFeedMapper();

    return new ChatSocialService(
        store,
        new ShareFeedService(runtime, new ShareFeedPolicy(runtime), mapper),
        (value) => mapper.normalizeEnvelope(value),
    );
}
