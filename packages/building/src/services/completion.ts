import { randomUUID } from "node:crypto";
import type { ProgressionActivityData } from "@opencok/economy/contracts/progression-activity";
import type {
    ConstructionCatalog,
    ConstructionContext,
    ConstructionRecord as Row,
} from "../contracts/construction";
import type { ConstructionRuntime } from "../contracts/construction-runtime";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { buildingQueueType as cityQueueType } from "../rules/queues";

export class ConstructionCompletion<
    TCatalog extends ConstructionCatalog,
    TContext extends ConstructionContext<TCatalog>,
>
{
    public constructor(private readonly runtime: ConstructionRuntime<TCatalog, TContext>)
    {}

    public definition(context: TContext, row: Row)
    {
        const { text, num } = this.runtime;

        return context.rules.building(
            text(row, "itemId"),
            num(row, "level"),
            num(row, "star"),
            num(row, "progress"),
        );
    }

    public history(context: TContext)
    {
        const { long } = this.runtime;

        let total = 0n;

        for (const row of context.state.buildings)
        {
            total += this.buildingExperience(context, row);
        }

        return {
            currentMax: context.state.buildingExperience.currentMax === undefined
                ? total
                : long(context.state.buildingExperience, "currentMax"),
            historyMax: context.state.buildingExperience.historyMax === undefined
                ? total
                : long(context.state.buildingExperience, "historyMax"),
        };
    }

    public buildingExperience(context: TContext, row: Row)
    {
        const { text, num } = this.runtime;

        let total = 0n;

        for (let level = 0; level < num(row, "level"); level++)
        {
            total += BigInt(context.rules.building(text(row, "itemId"), level).experience ?? 0);
        }

        if (num(row, "level") === 30)
        {
            for (let star = 0; star <= num(row, "star"); star++)
            {
                const rule = context.rules.building(text(row, "itemId"), 30, star);

                for (const step of rule.upgrades?.experience ?? [])
                {
                    if (star < num(row, "star") || step.progress <= num(row, "progress"))
                    {
                        total += BigInt(step.value);
                    }
                }
            }
        }

        return total;
    }

    public makeDomainQueue(context: TContext, row: Row)
    {
        const { num, idleDeadline } = this.runtime;

        const type = cityQueueType(num(row, "itemId"));

        if (
            type === undefined
            || context.state.queues.some((queue) =>
                num(queue, "type") === type && num(queue, "qid") === 1
            )
        )
        {
            return;
        }

        context.write.queues = [
            {
                uuid: randomUUID(),
                ownerId: context.owner,
                type,
                qid: 1,
                itemId: "",
                startTime: idleDeadline,
                endTime: idleDeadline,
                updateTime: idleDeadline,
                totalTime: 0n,
                para: 0,
                isHelped: 0,
            },
        ];
    }

    public complete(
        context: TContext,
        row: Row,
        data: ProgressionActivityData | undefined,
    ): Fields
    {
        const {
            building,
            text,
            num,
            long,
            cityInteger,
            refreshPrayerBuilding,
            recordTargetTask,
            enrollCastleLevel,
            recordExpeditionScore,
        } = this.runtime;

        const current = this.definition(context, row);
        const next = data?.target
            ?? (() => {
                const rule = context.rules.nextBuilding(
                    text(row, "itemId"),
                    num(row, "level"),
                    num(row, "star"),
                    num(row, "progress"),
                    Number(context.now),
                );

                return { level: rule.level, star: rule.starLevel, progress: rule.starProgress };
            })();
        const completed = {
            ...row,
            ...next,
            opType: 0,
            unlockFlag: 0,
            costUnlockTimes: next.progress === 0 ? 0 : num(row, "costUnlockTimes"),
            refreshTime: num(row, "level") === 0 ? context.now : long(row, "refreshTime"),
            updateTime: context.now,
            reward: num(row, "itemId") === 400000 ? 1 : 0,
        };
        const after = this.definition(context, completed);
        const addedPower = BigInt(after.power ?? 0) - BigInt(current.power ?? 0);
        context.power(addedPower, addedPower);

        if (addedPower > 0n)
        {
            recordExpeditionScore(context, 3, 1, cityInteger(addedPower));
        }

        const previous = this.history(context),
            earned = BigInt(current.experience ?? 0),
            currentMax = previous.currentMax + earned;
        const experience = currentMax > previous.historyMax ? currentMax - previous.historyMax : 0n;
        context.write.buildingExperience = {
            currentMax,
            historyMax: currentMax > previous.historyMax ? currentMax : previous.historyMax,
        };

        if (experience)
        {
            context.experience(cityInteger(experience));
        }

        context.write.buildings = [completed];
        refreshPrayerBuilding(context, row, completed);

        if (!context.completing)
        {
            recordTargetTask(context, 3, 1);
        }

        enrollCastleLevel(context, completed);
        this.makeDomainQueue(context, completed);

        return {
            ...building(completed, context.rules, false, Number(context.now)),
            updateTime: sfs.long(context.now),
            remainGold: sfs.long(context.balance("gold")),
        };
    }
}
