import { sfs, type Fields } from "@opencok/messages/sfs";
import { recallTaskSchema, recallTaskClaimSchema } from "@opencok/validations/recall-task";
import { validateFields } from "./validation";

export function recallTaskView(tasks: readonly Fields[], openedAt?: bigint)
{
    return validateFields(recallTaskSchema, {
        targetList: sfs.array(tasks.map(sfs.object)),
        ...(openedAt === undefined ? {} : { opentime: sfs.long(openedAt) }),
    });
}

export function recallTaskClaim(fields: Fields)
{
    return validateFields(recallTaskClaimSchema, fields);
}
