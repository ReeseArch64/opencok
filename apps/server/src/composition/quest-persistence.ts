import { QuestRepository } from "@opencok/tasks/repositories/progression";
import { text, num } from "@opencok/contracts/rows";
import { insertSystemMail } from "@opencok/repositories/system-mail";

export function createRealmQuestRepository(
    tx: ConstructorParameters<typeof QuestRepository>[0],
    owner: string,
)
{
    return new QuestRepository(tx, owner, { text, num, insertSystemMail });
}
