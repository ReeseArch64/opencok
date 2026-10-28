export interface ServerConfig
{
    paidGiftGateway?: import("./paid-gifts").PaidGiftGateway;
    provisioningSecret?: string;
    chatInterval?: number;
    feedMaxCount?: number;
    crossSearchEnabled?: boolean;
    avatarChat?: { url: string; signingSecret: string; };
    avatarFiles?: { origin: string; };
    nicknameChat?: { url: string; signingSecret: string; };
    mailIntegrationMode?: "local" | "external";
    mailChat?: { url: string; signingSecret: string; };
    chatSession?: { url: string; signingSecret: string; };
    mailTranslationEnabled?: boolean;
    host: string;
    port: number;
    healthPort: number;
    kingdomId: number;
    kingdomDatabase: string;
    playerKingdoms?: readonly { id: number; database: string; }[];
    globalDatabase: string;
    databaseUrl: string;
    redisUrl: string;
    zookeeper: string;
    zkPath: string;
    loginSecret: string;
    mapSize: number;
    timeoutMs: number;
}
