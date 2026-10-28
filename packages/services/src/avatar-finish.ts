import type {
    AvatarFinishStore,
    AvatarFiles,
    AvatarFinishSnapshot,
} from "@opencok/contracts/files";
import type { Rules, Rule } from "@opencok/rules/game";
import {
    avatarFinishQuery,
    avatarFinishMinimumLevel,
    avatarFinishInterval,
    avatarFinishPlan,
    checkAvatarLevel,
    checkAvatarRecord,
} from "@opencok/rules/avatar";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export async function finishAvatar(
    store: AvatarFinishStore,
    files: Pick<AvatarFiles, "find">,
    rules: Rules,
    owner: string,
    receipt: string,
    now: number,
    mailTemplate: Rule | undefined = rules.mail.get("10111"),
): Promise<AvatarFinishSnapshot>
{
    const query = avatarFinishQuery(receipt, now);

    if (!/^[0-9]{1,20}$/.test(owner))
    {
        throw new GameError(errors.invalid, "avatar_rule");
    }

    const template = mailTemplate ? { ...mailTemplate } : undefined;

    return store.commit(
        owner,
        query,
        (uid, sequence) => files.find(uid, sequence),
        async (profile, readers) => {
            const minimum = avatarFinishMinimumLevel(rules);

            if (minimum !== undefined)
            {
                checkAvatarLevel(await readers.castleLevel(), minimum);
                avatarFinishInterval(rules);
                const record = await readers.uploadRecord();

                if (record && record.uid !== owner)
                {
                    throw new GameError(errors.invalid, "avatar_rule");
                }

                checkAvatarRecord(rules, record, now);
            }

            return avatarFinishPlan(profile, query, minimum !== undefined, template);
        },
    );
}
