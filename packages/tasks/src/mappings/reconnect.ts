import { sfs, type Fields } from "@opencok/messages/sfs";
import { validateValue, validateFields } from "@opencok/messages/validations/fields";
import type { ReconnectTask, ReconnectTaskPlan } from "../contracts/reconnect";
import type { RewardRandom } from "@opencok/economy/contracts/reward-preview";
import type {
    ReconnectTaskMappingCatalog,
    ReconnectTaskMappingRuntime,
    ReconnectTaskPreviewContext,
} from "../contracts/reconnect-runtime";
import { reconnectTaskSchema, reconnectTasksSchema } from "../validations/reconnect";
import { ReconnectTaskPolicy } from "../rules/reconnect-task";
import { ReconnectTaskPush } from "../enums/reconnect-command";

export class ReconnectTaskMapper<TCatalog extends ReconnectTaskMappingCatalog>
{
    public constructor(private readonly runtime: ReconnectTaskMappingRuntime<TCatalog>)
    {}

    private serializeReconnectTasks(
        plan: ReconnectTaskPlan,
        rules: TCatalog,
        context: ReconnectTaskPreviewContext,
        random: RewardRandom,
    ): { fields: Fields; pushes: readonly { command: string; fields: Fields; }[]; }
    {
        const { signed, previewRewards, rewardPreviewArray } = this.runtime;
        const invalid: () => never = this.runtime.invalid;
        const visibleReconnectTasks = ReconnectTaskPolicy.visibleReconnectTasks;
        const taskObject = (task: ReconnectTask, reward: boolean) => {
            const fields: Fields = {
                id: sfs.string(task.id),
                num: sfs.int(Number(signed(task.num, 32))),
                state: sfs.int(Number(signed(task.state, 32))),
                type: sfs.int(Number(signed(task.type, 32))),
            };

            if (task.type === 3)
            {
                const maximum = rules.items.get("wb_info")?.k4;

                if (maximum === undefined)
                {
                    return invalid();
                }

                fields.currPhase = sfs.int(Number(signed(task.phase, 32)));
                fields.maxPhase = sfs.int(Number(signed(maximum, 32)));
            }

            if (reward)
            {
                fields.reward = rewardPreviewArray(
                    previewRewards(task.reward, rules, context, random),
                );
            }

            return validateValue(reconnectTaskSchema, sfs.object(fields));
        };
        const group = (tasks: readonly ReconnectTask[], reward: boolean): Fields => {
            if (tasks.length > 32767)
            {
                return invalid();
            }

            return {
                task: sfs.array(
                    tasks.filter((task) => task.type !== 3).map((task) => taskObject(task, reward)),
                ),
                ckfTask: sfs.array(
                    tasks.filter((task) => task.type === 3).map((task) => taskObject(task, reward)),
                ),
            };
        };
        const pushes = plan.pushes.map((push) => {
            if (push.command === ReconnectTaskPush.New)
            {
                return { command: push.command, fields: group(push.tasks, true) };
            }

            if (push.command === ReconnectTaskPush.CrossComplete)
            {
                const fields = group(push.tasks, false);

                if (!push.tasks.some((task) => task.type === 1))
                {
                    delete fields.task;
                }

                return { command: push.command, fields };
            }

            return {
                command: push.command,
                fields: { task: sfs.array(push.tasks.map((task) => taskObject(task, false))) },
            };
        });

        return {
            fields: {
                ...group(visibleReconnectTasks(plan.tasks), true),
                taskCompleteNum: sfs.int(
                    plan.tasks.filter((task) => !task.accepted && task.state === 2).length,
                ),
            },
            pushes,
        };
    }
    public readonly reconnectTasks = (
        ...args: Parameters<ReconnectTaskMapper<TCatalog>["serializeReconnectTasks"]>
    ): ReturnType<ReconnectTaskMapper<TCatalog>["serializeReconnectTasks"]> => {
        const result = this.serializeReconnectTasks(...args);
        validateFields(reconnectTasksSchema, result.fields);

        return result;
    };
}
