import type { ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import { avatarMailFromTemplate } from "./avatar-mail.ts";
import type { Rules } from "./game.ts";

export function reconnectMail(
    owner: string,
    now: bigint,
    generalResets: readonly string[],
    losses: { weakened: number; dead: number; },
    rules: Rules,
    stem: () => string,
    resolveReward: (rewardId: string, owner: string) => string | null,
): ReconnectProgressWrite["mail"]
{
    const result: ReconnectProgressWrite["mail"][number][] = [];

    for (const _uuid of generalResets)
    {
        result.push({
            ...avatarMailFromTemplate(
                owner,
                now,
                {
                    type: "1",
                    title: "Skill points reset",
                    message:
                        "Your skill choices contained an invalid prerequisite. Your skill points have been reset; open your skills to allocate them again.",
                },
                stem(),
            ),
            itemIdFlag: 0,
        });
    }

    if (losses.weakened > 0 || losses.dead > 0)
    {
        const template = rules.mail.get(losses.dead > 0 ? "12083" : "12082");

        if (template)
        {
            const parameters = losses.dead > 0
                ? [(losses.weakened + losses.dead) | 0, losses.weakened, losses.dead]
                : [losses.weakened];
            result.push({
                ...avatarMailFromTemplate(
                    owner,
                    now,
                    {
                        ...template,
                        type: "1",
                        message: `${template.message ?? ""}|${parameters.join("|")}`,
                    },
                    stem(),
                    resolveReward,
                ),
                itemIdFlag: 1,
            });
        }
    }

    return result;
}
