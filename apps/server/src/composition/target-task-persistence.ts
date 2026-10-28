import { TargetTaskRepository } from "@opencok/tasks/repositories/target-task";
import { text, long } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";

export function createRealmTargetTaskRepository(
    tx: ConstructorParameters<typeof TargetTaskRepository>[0],
    owner: string,
)
{
    return new TargetTaskRepository(tx, owner, { text, long, cityInteger, cityAmount });
}
