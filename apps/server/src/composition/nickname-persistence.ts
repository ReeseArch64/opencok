import { createNicknameChangeStore } from "@opencok/player/repositories/nickname-change";
import { captureCostFact } from "@opencok/repositories/continued-cost-facts";
import { readSharedUserProfile } from "@opencok/repositories/shared-user";
import { insertSystemMail } from "@opencok/repositories/system-mail";

type StoreArguments = Parameters<typeof createNicknameChangeStore>;

export function createRealmNicknameChangeStore(
    databases: StoreArguments[0],
    kingdomId: StoreArguments[1],
    configuration: StoreArguments[2],
    notifications?: StoreArguments[4],
)
{
    return createNicknameChangeStore(databases, kingdomId, configuration, {
        captureCostFact,
        readSharedUserProfile,
        insertSystemMail,
    }, notifications);
}
