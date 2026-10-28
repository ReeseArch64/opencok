import { TimedActivityAction } from "@opencok/enums/timed-activity-action";

import type { ActivityAction, TimedActivity } from "@opencok/base/contracts/activity";
import type { EquipmentCatalog, EquipmentContext } from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";
import { sfs } from "@opencok/messages/sfs";

import { EquipmentMapper } from "../mappings/equipment";
import { invalidEquipment as invalid } from "../validations/invalid";
import { EquipmentAccess } from "./access";

export class EquipmentActivity<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: EquipmentRuntime<TCatalog, TContext>,
        private readonly access: EquipmentAccess<TCatalog, TContext>,
        private readonly mapper: EquipmentMapper,
    )
    {}

    public readonly apply = async (
        context: TContext,
        action: ActivityAction,
        activity: TimedActivity,
    ) => {
        const { text, num, progressionActivityData, refreshQuests } = this.runtime;

        const { equipment } = this.mapper;

        const row = this.access.own(context, activity.itemId),
            data = progressionActivityData(activity.data);

        if (num(row, "on") !== 2 || (data && data.kind !== "equipment"))
        {
            invalid();
        }

        if (action === TimedActivityAction.Start)
        {
            invalid();
        }

        if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
        {
            return equipment(row);
        }

        if (action === TimedActivityAction.Cancel)
        {
            context.write.deletedEquipment = [text(row, "uuid")];
            context.refund(data);

            return { resource: sfs.object(context.resource()) };
        }

        const value = { ...row, on: 0, cost: "" };
        context.write.equipment = [value];
        refreshQuests(context, { daily: 36, legacy: 14, count: 1 });

        return equipment(value);
    };
}
