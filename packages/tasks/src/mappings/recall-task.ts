import { sfs, type Fields } from "@opencok/messages/sfs";
import { recallTaskSchema, recallTaskClaimSchema } from "../validations/recall-task";
import { validateFields } from "@opencok/messages/validations/fields";

export class RecallTaskMapper
{
    public readonly recallTaskView = (tasks: readonly Fields[], openedAt?: bigint) => {
        return validateFields(recallTaskSchema, {
            targetList: sfs.array(tasks.map(sfs.object)),
            ...(openedAt === undefined ? {} : { opentime: sfs.long(openedAt) }),
        });
    };

    public readonly recallTaskClaim = (fields: Fields) => {
        return validateFields(recallTaskClaimSchema, fields);
    };
}
