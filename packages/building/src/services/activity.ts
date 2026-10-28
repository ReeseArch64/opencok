import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { ActivityAction, TimedActivity } from "@opencok/base/contracts/activity";
import type { ConstructionCatalog, ConstructionContext } from "../contracts/construction";
import type { ConstructionRuntime } from "../contracts/construction-runtime";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { ConstructionCompletion } from "./completion";

export class ConstructionActivity<
    TCatalog extends ConstructionCatalog,
    TContext extends ConstructionContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: ConstructionRuntime<TCatalog, TContext>,
        private readonly completion: ConstructionCompletion<TCatalog, TContext>,
    )
    {}

    public readonly apply = async (
        context: TContext,
        action: ActivityAction,
        activity: TimedActivity,
    ): Promise<Fields> => {
        const { text, num, progressionActivityData, building } = this.runtime;

        const row = context.ownBuilding(activity.itemId),
            data = progressionActivityData(activity.data);

        if (num(row, "opType") !== 1 && num(row, "opType") !== 2)
        {
            throw new GameError(errors.queue, "city_progression");
        }

        if (data && data.kind !== (num(row, "opType") === 1 ? "upgrade" : "destroy"))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        if (action === TimedActivityAction.Start)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
        {
            return building(row, context.rules, num(row, "opType") === 1, Number(context.now));
        }

        if (action === TimedActivityAction.Cancel)
        {
            if (num(row, "opType") === 1)
            {
                context.refund(data);
            }

            if (num(row, "level") === 0)
            {
                context.write.deletedBuildings = [text(row, "uuid")];
            }
            else
            {
                context.write.buildings = [{ ...row, opType: 0 }];
            }

            return { goods: sfs.array([]), resource: sfs.object(context.resource()) };
        }

        if (num(row, "opType") === 1)
        {
            return this.completion.complete(context, row, data);
        }

        const power = BigInt(this.completion.definition(context, row).power ?? 0);
        context.power(-power, -power);
        const previous = this.completion.history(context);
        context.write.buildingExperience = {
            ...previous,
            currentMax: previous.currentMax > this.completion.buildingExperience(context, row)
                ? previous.currentMax - this.completion.buildingExperience(context, row)
                : 0n,
        };
        context.write.deletedBuildings = [text(row, "uuid")];

        return { uuid: sfs.string(text(row, "uuid")), opType: sfs.int(2) };
    };
}
