import { randomInt } from "node:crypto";
import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import { sfs, encode, str, int } from "@opencok/messages/sfs";
import type { TargetTaskCatalog, TargetTaskContext } from "../contracts/target-context";
import type { TargetTaskRuntime } from "../contracts/target-runtime";
import type { TargetTaskPaymentGateway } from "../contracts/target-task";
import { TargetTaskPolicy } from "../rules/target-task";
import { TargetTaskPaymentIdentity } from "../rules/target-payment";
import { TargetTaskMapper } from "../mappings/target-task";
import { TargetTaskCommand } from "../enums/target-command";
import { targetFailure } from "../validations/target-failure";
import { TargetTaskAccess } from "./target-access";
import { TargetTaskRewards } from "./target-rewards";
import { TargetTaskProgression } from "./target-progression";

export class TargetTaskDomain<
    TCatalog extends TargetTaskCatalog,
    TContext extends TargetTaskContext<TCatalog>,
> extends ActivityDomain<TContext>
{
    public readonly commands = [
        TargetTaskCommand.Initialize,
        TargetTaskCommand.Info,
        TargetTaskCommand.Item,
        TargetTaskCommand.Receive,
        TargetTaskCommand.Paid,
    ];
    public readonly types: readonly number[] = [];
    public readonly prepare: ActivityDomain<TContext>["prepare"];
    public readonly apply: ActivityDomain<TContext>["apply"] = async () => {
        targetFailure();
    };
    public readonly recordTargetTask: TargetTaskProgression<TCatalog, TContext>["recordTargetTask"];

    public constructor(
        runtime: TargetTaskRuntime<TCatalog, TContext>,
        policy: TargetTaskPolicy<TCatalog>,
        mapper: TargetTaskMapper,
        identity: TargetTaskPaymentIdentity,
        gateway?: TargetTaskPaymentGateway,
        random: (maximum: number) => number = randomInt,
    )
    {
        super();
        const access = new TargetTaskAccess(runtime);
        const rewards = new TargetTaskRewards(runtime, access);
        const progression = new TargetTaskProgression(runtime, access, rewards, policy);
        this.recordTargetTask = progression.recordTargetTask;

        this.prepare = async (context, command, params) => {
            const { text, num, long, cityInteger, previewRewards, rewardPreviewArray } = runtime;

            const { open } = access;

            const { recover } = progression;

            const { grant } = rewards;

            const { targetTaskView } = mapper;

            const { targetTaskPurchaseOperationId } = identity;

            const empty = () => ({ response: encode({}), event: null });

            if (!open(context))
            {
                if (command === TargetTaskCommand.Initialize)
                {
                    return empty();
                }

                targetFailure();
            }

            let proof: { exchangeId: string; occurredAt: bigint; } | undefined;

            if (command === TargetTaskCommand.Paid)
            {
                const eventId = str(params, "eventId");

                if (
                    !gateway
                    || str(params, "operationId")
                        !== targetTaskPurchaseOperationId(context.owner, eventId)
                )
                {
                    targetFailure();
                }

                proof = (await gateway.accepted({ owner: context.owner, eventId })) ?? undefined;

                if (
                    !proof
                    || typeof proof.occurredAt !== "bigint"
                    || proof.occurredAt < 0n
                    || proof.occurredAt > context.now
                )
                {
                    targetFailure();
                }
            }

            const state = recover(context, random),
                notes = state.notes;

            if (command === TargetTaskCommand.Initialize)
            {
                return empty();
            }

            const begin = notes ? long(notes, "beginTime") : 0n,
                day = begin > 0n && context.now >= begin
                    ? cityInteger((context.now - begin) / 86400000n)
                    : undefined;

            if (command === TargetTaskCommand.Info)
            {
                const rows = state.tasks
                    .slice()
                    .sort((a, b) => num(a, "type_level") - num(b, "type_level"))
                    .map((row) => {
                        const rule = context.rules.advanced.targetTasks?.get(text(row, "id"));

                        if (!rule)
                        {
                            targetFailure();
                        }

                        return {
                            reward: rewardPreviewArray(
                                previewRewards(
                                    rule.rewardall,
                                    context.rules,
                                    {
                                        kingdomId: context.rules.kingdomId,
                                        version: "12.06.0",
                                        now: Number(context.now),
                                    },
                                    random,
                                ),
                            ),
                            num: sfs.int(num(row, "num")),
                            target_num: sfs.int(num(row, "target_num")),
                            state: sfs.bool(num(row, "state") > 0),
                            day_type: sfs.int(num(row, "type_level")),
                            taskid: sfs.string(text(row, "id")),
                            rewardDouble: sfs.int(num(row, "rewardDouble")),
                        };
                    });

                return {
                    response: encode(
                        targetTaskView(
                            rows,
                            state.config.k5 ?? "",
                            state.tasks.length + cityInteger(state.config.k4) - 1,
                            day,
                            !notes || num(notes, "receive_mode") > 0,
                        ),
                    ),
                    event: null,
                };
            }

            if (command === TargetTaskCommand.Paid)
            {
                if (proof!.exchangeId !== state.config.k5)
                {
                    targetFailure();
                }

                if (!notes)
                {
                    return empty();
                }

                if (
                    num(notes, "receive_mode") > 0
                    || proof!.occurredAt < begin
                    || proof!.occurredAt >= long(notes, "endTime")
                )
                {
                    return empty();
                }

                const body = grant(context, 2);

                return {
                    response: encode(body),
                    event: encode({ owner: sfs.string(context.owner), body: sfs.object(body) }),
                };
            }

            if (command === TargetTaskCommand.Receive)
            {
                return { response: encode(grant(context, 1)), event: null };
            }

            if (
                !notes
                || num(notes, "receive_mode") > 0
                || context.now < begin
                || context.now >= long(notes, "endTime")
            )
            {
                targetFailure();
            }

            const action = cityInteger(int(params, "type"), 1, 2),
                index = cityInteger(int(params, "index"), 0, 4),
                itemId = str(params, "itemId"),
                count = cityInteger(int(params, "num"), 1),
                row = state.tasks.find((row) => num(row, "type_level") === index);

            if (!row)
            {
                targetFailure();
            }

            const next = { ...row };

            if (action === 1)
            {
                const parts = (state.config.k8 ?? "").split(";");

                if (
                    parts.length !== 2
                    || parts[0] !== itemId
                    || num(row, "state") !== 1
                    || num(row, "rewardDouble") >= cityInteger(parts[1], 0, 999)
                )
                {
                    targetFailure();
                }

                next.rewardDouble = cityInteger(num(row, "rewardDouble") + 1, 0, 999);
            }
            else
            {
                if (itemId !== state.config.k9 || num(row, "state") !== 0)
                {
                    targetFailure();
                }

                next.state = 1;
            }

            context.economy.item(itemId, -count);
            context.write.targetTask = {
                ...context.write.targetTask,
                tasks: state.tasks.map((row) => (row.id === next.id ? next : row)),
            };

            return {
                response: encode({
                    rewardDouble: sfs.int(num(next, "rewardDouble")),
                    state: sfs.bool(num(next, "state") > 0),
                }),
                event: null,
            };
        };
    }
}
