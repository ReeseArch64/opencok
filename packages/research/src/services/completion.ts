import { randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { ProgressionActivityData } from "@opencok/contracts/city-progression";
import { text, num, type Row } from "@opencok/contracts/rows";
import { sfs } from "@opencok/messages/sfs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { researchDefinition } from "../rules/research";
import type { ResearchContext, ResearchCompletionHooks } from "../contracts/context";
import type { ResearchMapper } from "../mappings/research";

export class ResearchCompletion
{
    public constructor(
        private readonly hooks: ResearchCompletionHooks,
        private readonly mapper: ResearchMapper,
    )
    {}

    public complete(context: ResearchContext, row: Row, data?: ProgressionActivityData)
    {
        const level = data?.target?.level ?? num(row, "level") + 1;

        if (level !== num(row, "level") + 1)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const before = researchDefinition(context.rules, text(row, "itemId"), num(row, "level")),
            after = researchDefinition(context.rules, text(row, "itemId"), level);
        const completed = { ...row, level, cd: idleDeadline };
        context.write.sciences = [completed];

        if (!context.completing)
        {
            this.hooks.target(context, 12, 1);
        }

        const delta = cityAmount(after.power ?? 0) - cityAmount(before.power ?? 0);
        context.power(delta);
        context.recordHero(6, "2", delta);

        if (delta > 0n)
        {
            this.hooks.expedition(context, 3, 2, cityInteger(delta));
        }

        if (["army", "trap", "up"].includes(after.para1 ?? ""))
        {
            const id = cityInteger(after.para2),
                armyId = String(Math.trunc(id / 10) * 10),
                unlocked = after.para1 === "up" ? level : (id % 10) + 1;

            if (!context.rules.arms.has(armyId))
            {
                throw new GameError(errors.unsupported, "city_progression");
            }

            if (after.para1 === "trap")
            {
                const saved = context.state.forts.find((fort) => fort.armyId === armyId);
                context.write.forts = [
                    {
                        uid: context.owner,
                        armyId,
                        num: 0,
                        build: 0,
                        finishTime: 0n,
                        ...saved,
                        level: Math.max(num(saved ?? {}, "level"), unlocked),
                    },
                ];
            }
            else
            {
                const saved = context.state.armies.find((army) => army.armyId === armyId);
                context.write.armies = [
                    {
                        uid: context.owner,
                        armyId,
                        free: 0,
                        defence: 0,
                        pve: 0,
                        march: 0,
                        train: 0,
                        finishTime: 0n,
                        foodCostTime: context.now,
                        ...saved,
                        level: Math.max(num(saved ?? {}, "level"), unlocked),
                    },
                ];
            }
        }

        if (after.skill)
        {
            if (
                !["622800", "622900"].includes(after.skill)
                || !context.state.effects.generals.length
            )
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            const saved = context.state.skills.find((skill) => skill.skillId === after.skill);
            context.write.skills = [
                {
                    uuid: randomUUID(),
                    ownerId: context.owner,
                    skillId: after.skill,
                    startTime: idleDeadline,
                    endTime: idleDeadline,
                    actTime: 0n,
                    param1: 0,
                    param2: 0,
                    ...saved,
                    stat: 0,
                },
            ];
        }

        const power = context.state.sciences.reduce(
            (sum, science) =>
                sum
                + cityAmount(
                    researchDefinition(
                        context.rules,
                        text(science, "itemId"),
                        num(science, "level"),
                    )
                        .power
                        ?? 0,
                ),
            0n,
        )
            + cityAmount(after.power ?? 0)
            - cityAmount(before.power ?? 0);

        return {
            ...this.mapper.research(completed, context.rules),
            sciencePower: sfs.int(cityInteger(power)),
        };
    }
}
