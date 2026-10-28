import { RecallTaskRepository } from "@opencok/tasks/repositories/recall-task";
import { text, long } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";

export function createRealmRecallTaskRepository(
    tx: ConstructorParameters<typeof RecallTaskRepository>[0],
    owner: string,
)
{
    return new RecallTaskRepository(tx, owner, { text, long, cityInteger, cityAmount });
}
