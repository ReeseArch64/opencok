import type { ActivityDeadlineDispatcher } from "@opencok/queues/contracts/deadline";
import type { TimedActivityService } from "@opencok/services/timed-activity";

export function createRealmActivityDeadlineDispatcher(
    activities: TimedActivityService,
    domains: ReadonlyMap<number, unknown>,
    assertReady: () => void,
    checkCurrentAuthority: () => Promise<void>,
): ActivityDeadlineDispatcher
{
    return {
        capabilities: async () => {
            assertReady();
            await checkCurrentAuthority();
            assertReady();

            return [...domains.keys()].sort((left, right) => left - right);
        },
        restore: async (snapshot) => {
            assertReady();

            return activities.restoreSnapshot(snapshot, [...domains.keys()]);
        },
        finish: async (snapshot) => {
            assertReady();

            return activities.finishSnapshot(snapshot, [...domains.keys()]);
        },
    };
}

export function validateRealmActivitySchedulerConfig(config: {
    activitySchedulerMode?: "local" | "external";
    activitySchedulerSecret?: string;
    loginSecret: string;
    provisioningSecret?: string;
    avatarChat?: { signingSecret: string; };
    nicknameChat?: { signingSecret: string; };
    mailChat?: { signingSecret: string; };
    chatSession?: { signingSecret: string; };
}): void
{
    const secret = config.activitySchedulerSecret;
    if (
        (config.activitySchedulerMode === "external" && !secret)
        || (secret !== undefined && (secret.length < 32 || [
            config.loginSecret,
            config.provisioningSecret,
            config.avatarChat?.signingSecret,
            config.nicknameChat?.signingSecret,
            config.mailChat?.signingSecret,
            config.chatSession?.signingSecret,
        ].includes(secret)))
    )
    {
        throw new Error("Invalid realm activity scheduler configuration");
    }
}
