import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type {
    ActivityAction,
    PreparedActivity,
    TimedActivity,
} from "@opencok/base/contracts/activity";
import type { EquipmentCatalog, EquipmentContext } from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";
import { sfs, encode, str, int, type Fields } from "@opencok/messages/sfs";
import { EquipmentPolicy } from "../rules/equipment";
import { EquipmentMapper } from "../mappings/equipment";
import { invalidEquipment as invalid } from "../validations/invalid";
import { WorkshopCommand } from "../enums/workshop-command";
import { ActivityDomain } from "@opencok/base/domain/activity-domain";

export class WorkshopDomain<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
> extends ActivityDomain<TContext>
{
    public readonly commands = [
        WorkshopCommand.Create,
        WorkshopCommand.Queue,
        WorkshopCommand.Remove,
        WorkshopCommand.BuyQueue,
    ];
    public readonly types = [12];

    public constructor(
        private readonly runtime: EquipmentRuntime<TCatalog, TContext>,
        private readonly policy: EquipmentPolicy,
        private readonly mapper: EquipmentMapper,
    )
    {
        super();
    }

    private readonly workshopQueue = (context: TContext) => {
        const { num } = this.runtime;

        const row = context.state.queues.find((row) =>
            num(row, "type") === 12 && num(row, "qid") === 1
        );

        if (!row)
        {
            throw new GameError(errors.queue, "city_progression");
        }

        return row;
    };

    private readonly workshopDuration = (context: TContext, id: string) => {
        const { cityInteger, cityDuration } = this.runtime;

        const good = context.rules.goods.get(id),
            parts = good?.make?.split("|");

        if (!parts || good?.type !== "7")
        {
            invalid();
        }

        return cityDuration(
            cityInteger(parts![1]),
            context.effect(204) + context.effect(2157),
            context.effect(248) * 60 + context.effect(2156),
        );
    };

    public readonly prepare = async (
        context: TContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity> => {
        const { text, num, long, cityInteger, cityAmount, idleDeadline, queueView } = this.runtime;

        const { equipmentCosts } = this.policy;

        const row = this.workshopQueue(context),
            items = text(row, "itemId").split(";").filter(Boolean);
        let body: Fields = {};

        if (command === WorkshopCommand.Create)
        {
            const id = str(params, "itemId"),
                durationMs = this.workshopDuration(context, id),
                max = Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
                index = int(params, "index", 0);

            if (index < 0)
            {
                invalid();
            }

            if (items.length && index > 0 && index < items.length)
            {
                items[index] = id;
            }
            else
            {
                if (items.length >= max)
                {
                    throw new GameError(errors.full, "city_progression");
                }

                items.push(id);
            }

            const queueItemId = items.join(";") + ";";

            if (long(row, "updateTime") === idleDeadline)
            {
                return {
                    type: 12,
                    itemId: id,
                    queueItemId,
                    durationMs,
                    data: context.data("material"),
                    response: encode({ itemId: sfs.string(id) }),
                };
            }

            context.write.queueUpdates = [{ ...row, itemId: queueItemId }];
            body = queueView({ ...row, itemId: queueItemId }, {}, false);
        }
        else if (command === WorkshopCommand.Remove)
        {
            const index = cityInteger(int(params, "index"), 1, items.length - 1);
            items.splice(index, 1);
            context.write.queueUpdates = [{ ...row, itemId: items.join(";") + ";" }];
            body = queueView(context.write.queueUpdates[0]!, {}, false);
        }
        else if (command === WorkshopCommand.BuyQueue)
        {
            const prior = Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
                next = prior + 1;
            const superLevel = num(context.state.effects.vip ?? {}, "sLevel");

            if (
                next > 6
                && next
                    > 6
                        + Number(
                            context.rules.power.superVip?.get(String(7009 + superLevel))?.queue_num
                                ?? 0,
                        )
            )
            {
                invalid();
            }

            const rule = context.rules.role(next > 6 ? 50 + superLevel : prior),
                [type, amount] = rule.queue_unlock?.split("|") ?? [];

            if (type === "5")
            {
                context.economy.gold(-cityAmount(amount));
            }
            else
            {
                context.spend(equipmentCosts(`${type};${amount}`), false);
            }

            context.write.materialBackup = next;
            body = {
                materialBackup: sfs.int(next),
                gold: sfs.long(context.balance("gold")),
                resource: sfs.object(context.resource()),
            };
        }
        else
        {
            body = queueView(row, {}, false);
        }

        return { response: encode(body), event: null };
    };

    public readonly apply = async (
        context: TContext,
        action: ActivityAction,
        activity: TimedActivity,
    ): Promise<Fields> => {
        const { text, num, cityInteger, refreshQuests } = this.runtime;

        const { equipmentItem } = this.mapper;

        const row = this.workshopQueue(context),
            items = text(row, "itemId").split(";").filter(Boolean),
            id = items[0];

        if (!id || !activity.itemId.split(";").includes(id))
        {
            invalid();
        }

        if (action === TimedActivityAction.Start)
        {
            invalid();
        }

        if (action === TimedActivityAction.Restore && num(row, "para") > 0)
        {
            const completed = cityInteger(num(row, "para"), 0, items.length - 1);

            for (const prior of items.splice(0, completed))
            {
                context.economy.item(prior, 1);
            }

            context.write.queueUpdates = [{ ...row, itemId: items.join(";") + ";", para: 0 }];

            return { itemId: sfs.string(items[0]!) };
        }

        if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
        {
            return { itemId: sfs.string(id!) };
        }

        if (action === TimedActivityAction.Cancel)
        {
            context.write.queueUpdates = [{ ...row, itemId: "", para: 0 }];

            return {};
        }

        context.economy.item(id!, 1);
        items.shift();
        context.write.queueUpdates = [
            { ...row, itemId: items.length ? items.join(";") + ";" : "", para: 0 },
        ];
        refreshQuests(context, { main: 49, count: 1, key: String(Number(id) % 10) });

        return {
            add: sfs.object(
                equipmentItem(
                    id!,
                    context.economy.quantity?.(id!) ?? 0,
                    context.economy.itemState?.(id!),
                    context.rules,
                ),
            ),
        };
    };

    public readonly next = async (context: TContext, activity: TimedActivity) => {
        const { text } = this.runtime;

        const row = this.workshopQueue(context),
            id = text(row, "itemId").split(";").filter(Boolean)[0];

        if (!id)
        {
            return undefined;
        }

        return {
            type: 12,
            itemId: id,
            queueItemId: text(row, "itemId"),
            durationMs: this.workshopDuration(context, id),
            startedAt: context.now > activity.dueAt ? context.now : activity.dueAt,
            data: context.data("material"),
            response: encode({}),
        };
    };

    public readonly accelerate = async (
        context: TContext,
        activity: TimedActivity,
        remaining: bigint,
    ) => {
        const { num, long, cityInteger } = this.runtime;

        const mixed = context.state.quests?.mixed ?? {},
            today = context.now / 86400000n;
        const used = long(mixed, "materialCdTime") / 86400000n === today
            ? num(mixed, "materialCdNum")
            : 0;

        if (used >= cityInteger(context.rules.items.get("equip")?.k12))
        {
            invalid();
        }

        const id = activity.itemId.split(";")[0]!,
            make = context.rules.goods.get(id)?.make?.split("|");

        if (!make)
        {
            invalid();
        }

        const seconds = Number(remaining / 1000n),
            cost = Math.floor(
                Math.fround(cityInteger(make![2]) * Math.fround(seconds / cityInteger(make![1], 1)))
                    + 0.5,
            );
        context.economy.gold(-BigInt(cityInteger(cost)));
        context.write.materialAcceleration = {
            materialCdNum: used + 1,
            materialCdTime: context.now,
        };
    };
}
