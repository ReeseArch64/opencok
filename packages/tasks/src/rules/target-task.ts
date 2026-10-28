import type { TargetTaskCatalog } from "../contracts/target-context";
import type { QuestRule as Rule } from "../contracts/records";
import type { QuestNumericRuntime } from "../contracts/runtime";
import { targetTaskTypes } from "../constants/target-types";
import { targetFailure } from "../validations/target-failure";

const day = 86400000n, week = 7n * day;

export class TargetTaskPolicy<TCatalog extends TargetTaskCatalog>
{
    public constructor(private readonly runtime: QuestNumericRuntime)
    {}

    private readonly monday = (now: bigint) => {
        return (((now / day + 3n) / 7n) * 7n - 3n) * day;
    };

    public readonly targetSchedule = (rule: Rule, now: bigint, openedAt: bigint) => {
        const { cityInteger } = this.runtime;

        const count = cityInteger(rule.k3, 1, 5),
            compensation = cityInteger(rule.k4, 0, 7 - count),
            delay = cityInteger(rule.k1),
            weekday = cityInteger(rule.k2, 0, 7);
        const start = this.monday(now) + BigInt(Math.max(0, weekday - 1)) * day,
            end = start + BigInt(count + compensation) * day;
        const elapsed = now >= openedAt ? now / day - openedAt / day : openedAt / day - now / day;
        const first = this.monday(
            elapsed <= BigInt(delay)
                ? now + elapsed * day + week
                : openedAt + BigInt(delay) * day + week,
        );

        return {
            start,
            end,
            first,
            count,
            compensation,
            active: now >= openedAt && now >= first && now >= start && now < end,
        };
    };

    private readonly weighted = (
        pool: readonly Rule[],
        random: (maximum: number) => number,
    ): Rule => {
        const { cityInteger } = this.runtime;

        const total = cityInteger(
                pool.reduce((sum, rule) => sum + cityInteger(rule.rate), 0),
                1,
            ),
            draw = cityInteger(random(total), 0, total - 1);
        let sum = 0;

        for (const rule of pool)
        {
            sum += cityInteger(rule.rate);

            if (draw < sum)
            {
                return rule;
            }
        }

        return targetFailure();
    };

    public readonly selectTargetTasks = (
        rules: TCatalog,
        config: Rule,
        castle: number,
        random: (maximum: number) => number,
    ): readonly Rule[] => {
        const { cityInteger } = this.runtime;

        const all = [...(rules.advanced.targetTasks?.values() ?? [])];

        if (all.length > 4096)
        {
            targetFailure();
        }

        const eligible = all.filter((rule) => {
            if (!targetTaskTypes.has(cityInteger(rule.type, 1, 29)))
            {
                return false;
            }

            const bounds = (rule.accept ?? "").split(";").map((value) => cityInteger(value));

            if (bounds.length !== 2 || bounds[0]! > bounds[1]!)
            {
                targetFailure();
            }

            return bounds[0]! <= castle && castle <= bounds[1]!;
        });
        const selected: Rule[] = [];

        if (config.k6 === "1")
        {
            const groups = (config.k7 ?? "").split("|");

            if (!groups.length || groups.length > 5)
            {
                targetFailure();
            }

            for (const group of groups)
            {
                const choices = group.split(";").filter(Boolean);

                if (!choices.length || choices.length > 128)
                {
                    targetFailure();
                }

                const pair = choices[cityInteger(random(choices.length), 0, choices.length - 1)]!
                    .split(
                        "-",
                    );

                if (pair.length !== 2)
                {
                    targetFailure();
                }

                const rule = eligible.find(
                    (rule) =>
                        rule.type === pair[0]
                        && rule.extend_type === pair[1]
                        && !selected.some((prior) => prior.id === rule.id),
                );

                if (!rule)
                {
                    targetFailure();
                }

                selected.push(rule);
            }
        }
        else
        {
            for (let i = 0; i < cityInteger(config.k3, 1, 5); i++)
            {
                const pool = eligible.filter((rule) =>
                    !selected.some((prior) => prior.id === rule.id)
                );
                selected.push(this.weighted(pool, random));
            }
        }

        return selected;
    };

    public readonly targetQuantity = (rule: Rule, random: (maximum: number) => number): number => {
        const { cityInteger } = this.runtime;

        const values = (rule.num ?? "").split(";").map((value) => cityInteger(value, 1));

        if (values.length === 1)
        {
            return values[0]!;
        }

        if (values.length !== 2)
        {
            targetFailure();
        }

        const minimum = Math.min(...values),
            maximum = Math.max(...values);

        return (
            minimum
            + (maximum === minimum
                ? 0
                : cityInteger(random(maximum - minimum), 0, maximum - minimum - 1))
        );
    };
}
