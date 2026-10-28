import { createChatRepository as createRepository } from "@opencok/repositories/chat";
import { ShareFeedRepository } from "@opencok/share/repositories/feed";
import { ShareFeedMaintenanceRepository } from "@opencok/share/repositories/feed-maintenance";

export function createChatRepository(
    config: Omit<Parameters<typeof createRepository>[0], "share">,
)
{
    return createRepository({
        ...config,
        share: {
            transaction: (tx, now) => new ShareFeedRepository(tx, now),
            maintenance: (db) => new ShareFeedMaintenanceRepository(db),
        },
    });
}
