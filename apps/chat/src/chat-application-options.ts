import type { ChatRepository, Log } from "@opencok/contracts/chat";

export interface ChatApplicationOptions
{
    repository: ChatRepository;
    signingSecret: string;
    mailboxSigningSecret?: string;
    mailboxSigningSecrets?: Readonly<Record<string, string>>;
    websocketUrl: string;
    log?: Log;
    instanceId?: string;
    cleanupIntervalMs?: number;
}
