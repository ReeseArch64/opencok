import type { NicknameChangeStore } from "@opencok/contracts/nickname-change";
import type { Rules } from "@opencok/rules/game";
import { nicknameAllianceTask } from "@opencok/rules/nickname-alliance";
import { avatarMailFromTemplate } from "@opencok/rules/avatar-mail";

export function createNicknameAllianceDelivery(options: {
    store: Pick<NicknameChangeStore, "deliverAlliance">;
    rules: Pick<Rules, "items" | "configuration" | "mail">;
    kingdomId: number;
    resolveMailReward?: (rewardId: string, owner: string) => string | null;
})
{
    return (owner: string, operationId: string, now: number) =>
        options.store.deliverAlliance(owner, operationId, now, (tasks, stem) => {
            const plan = nicknameAllianceTask(tasks, options.rules, options.kingdomId, now);
            const template = plan.complete ? options.rules.mail.get("10113") : undefined;

            return {
                ...plan,
                mail: template
                    ? avatarMailFromTemplate(
                        owner,
                        BigInt(now),
                        template,
                        stem,
                        options.resolveMailReward,
                    )
                    : null,
            };
        });
}
