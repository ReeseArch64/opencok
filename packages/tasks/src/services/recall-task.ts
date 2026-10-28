import { randomInt } from "node:crypto";
import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import { sfs, encode, str, type Fields } from "@opencok/messages/sfs";
import type { QuestRecord as Row } from "../contracts/records";
import type { RecallTaskCatalog, RecallTaskContext } from "../contracts/recall-context";
import type { RecallTaskRuntime } from "../contracts/recall-runtime";
import { RecallTaskCommand } from "../enums/recall-command";
import { RecallTaskMapper } from "../mappings/recall-task";
import { RecallTaskAccess } from "./recall-access";
import { RecallTaskProgression } from "./recall-progression";

export class RecallTaskDomain<
    TCatalog extends RecallTaskCatalog,
    TContext extends RecallTaskContext<TCatalog>,
> extends ActivityDomain<TContext>
{
    public readonly commands = [
        RecallTaskCommand.Initialize,
        RecallTaskCommand.Info,
        RecallTaskCommand.Receive,
    ];
    public readonly types: readonly number[] = [];
    private readonly access: RecallTaskAccess<TCatalog, TContext>;
    private readonly progression: RecallTaskProgression<TCatalog, TContext>;
    public readonly recordRecallTask: RecallTaskProgression<TCatalog, TContext>["recordRecallTask"];

    public constructor(
        private readonly runtime: RecallTaskRuntime<TCatalog, TContext>,
        private readonly mapper: RecallTaskMapper,
    )
    {
        super();
        this.access = new RecallTaskAccess(runtime);
        this.progression = new RecallTaskProgression(runtime, this.access);
        this.recordRecallTask = this.progression.recordRecallTask;
    }

    public readonly prepare: ActivityDomain<TContext>["prepare"] = async (
        context,
        command,
        params,
    ) => {
        const {
            text,
            num,
            long,
            cityInteger,
            regionalRecallBand,
            regionalRecallEligible,
            eventTimestamp,
            pinProgressionReward,
            grantNativeProgressionReward,
            applyProgressionStatus,
            previewRewards,
            rewardPreviewArray,
        } = this.runtime;

        const regionalRecallFailure: () => never = this.runtime.regionalRecallFailure;

        const { enabled, saved } = this.access;

        const { recordRecallTask } = this.progression;

        const { recallTaskView, recallTaskClaim } = this.mapper;

        if (!enabled(context))
        {
            return { response: encode({}), event: null };
        }

        let state = saved(context);
        const rule = [...(context.rules.advanced.recallActivities?.values() ?? [])].find(
            (rule) => rule.k10 === state.country && state.country !== "",
        );

        if (command === RecallTaskCommand.Initialize)
        {
            if (!rule)
            {
                return { response: encode({}), event: null };
            }

            const start = eventTimestamp(rule.k3),
                end = eventTimestamp(rule.k4),
                castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
                level = num(castle ?? {}, "level");

            if (start === undefined || end === undefined || end < start)
            {
                regionalRecallFailure();
            }

            if (context.now <= start || context.now >= end || level < cityInteger(rule.k11))
            {
                return { response: encode({}), event: null };
            }

            if (!state.notes)
            {
                const ladder = regionalRecallBand(rule, level + num(castle ?? {}, "star")),
                    ids = rule.k7?.split("|")[ladder]?.split(";").filter(Boolean);

                if (!ids?.length || ids.length > 64 || new Set(ids).size !== ids.length)
                {
                    regionalRecallFailure();
                }

                const notes: Row = {
                    uid: context.owner,
                    version: text(context.state.profile, "appVersion"),
                    receive_mode: 0,
                    refreshTime: 0n,
                    beginTime: context.now,
                    endTime: context.now + BigInt(cityInteger(rule.k5, 1)) * 86400000n,
                    opendTime:
                        regionalRecallEligible(rule, context.state.profile, level, context.now)
                            ? context.now
                            : 0n,
                    country: state.country,
                    lastLoginTime: context.now,
                };
                const tasks = ids.map((id) => {
                    const task = context.rules.advanced.recallTasks?.get(id),
                        values = task?.num?.split(";").map((value) => cityInteger(value, 1));

                    if (!task || !values?.length || values.length > 2)
                    {
                        regionalRecallFailure();
                    }

                    const target = values.length === 1
                        ? values[0]!
                        : values[0]! + randomInt(cityInteger(values[0]! - values[1]!, 1));

                    return {
                        uid: context.owner,
                        id,
                        num: 0,
                        target_num: target,
                        state: 0,
                        type_level: level + num(castle ?? {}, "star"),
                        receive: 0,
                    };
                });
                context.write.recallTask = { notes, tasks, reset: true };
            }
            else
            {
                recordRecallTask(context, 26, 1);

                if (long(state.notes, "lastLoginTime") / 86400000n !== context.now / 86400000n)
                {
                    recordRecallTask(context, 27, 1);
                }

                context.write.recallTask = {
                    ...context.write.recallTask,
                    notes: { ...state.notes, lastLoginTime: context.now },
                };
            }

            return { response: encode({}), event: null };
        }

        if (command === RecallTaskCommand.Info)
        {
            const rows = state.tasks.map((row) => {
                const task = context.rules.advanced.recallTasks?.get(text(row, "id"));

                if (!task)
                {
                    regionalRecallFailure();
                }

                return {
                    reward: rewardPreviewArray(
                        previewRewards(
                            task.rewardall!,
                            context.rules,
                            {
                                kingdomId: context.rules.kingdomId,
                                version: "12.06.0",
                                now: Number(context.now),
                            },
                            randomInt,
                        ),
                    ),
                    num: sfs.int(num(row, "num")),
                    target_num: sfs.int(num(row, "target_num")),
                    state: sfs.bool(num(row, "state") > 0),
                    taskid: sfs.string(text(row, "id")),
                    receive: sfs.bool(num(row, "receive") > 0),
                };
            });

            return {
                response: encode(
                    recallTaskView(rows, state.notes ? long(state.notes, "opendTime") : undefined),
                ),
                event: null,
            };
        }

        const id = str(params, "id"),
            original = state.tasks.find((row) => row.id === id);

        if (
            !original || num(original, "state") <= 0 || num(original, "receive") > 0 || !state.notes
        )
        {
            return { response: encode({}), event: null };
        }

        const task = context.rules.advanced.recallTasks?.get(id);

        if (!task)
        {
            regionalRecallFailure();
        }

        const body: Fields = {
            id: sfs.string(id),
            reward: sfs.array(
                grantNativeProgressionReward(
                    context,
                    pinProgressionReward(context, task.rewardall!),
                ),
            ),
        };
        context.write.recallTask = {
            tasks: state.tasks.map((row) => (row.id === id ? { ...row, receive: 1 } : row)),
            notes: { ...state.notes, refreshTime: context.now },
        };
        state = saved(context);

        if (rule)
        {
            const completed = state.tasks.filter((row) => num(row, "state") > 0).length;
            let milestone = "0";
            const statuses = (rule.k8 ?? "").split("|");

            for (let index = statuses.length - 1; index > 0; index--)
            {
                const [threshold, status] = statuses[index]!.split(";");

                if (status && cityInteger(threshold) <= completed)
                {
                    milestone = status;
                    break;
                }
            }

            const rewards = (rule.k9 ?? "").split("|");

            for (let index = rewards.length - 1; index > 0; index--)
            {
                const [threshold, reward] = rewards[index]!.split(";");

                if (reward && cityInteger(threshold) > completed)
                {
                    milestone = reward;
                    break;
                }
            }

            if (milestone !== "0" && Number(milestone) !== num(state.notes!, "receive_mode"))
            {
                if (context.rules.power.statuses?.has(milestone))
                {
                    applyProgressionStatus(context, milestone);
                    body.status = sfs.string(milestone);
                }
                else
                {
                    body.receive_reward = sfs.array(
                        grantNativeProgressionReward(
                            context,
                            pinProgressionReward(context, milestone),
                        ),
                    );
                }

                context.write.recallTask.notes = {
                    ...state.notes!,
                    receive_mode: cityInteger(milestone),
                    refreshTime: context.now,
                };
            }
        }

        return { response: encode(recallTaskClaim(body)), event: null };
    };

    public readonly apply: ActivityDomain<TContext>["apply"] = async () => {
        const regionalRecallFailure: () => never = this.runtime.regionalRecallFailure;

        regionalRecallFailure();
    };
}
