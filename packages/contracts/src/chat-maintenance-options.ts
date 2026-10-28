import type { ChatRepository, Log } from "./chat.ts";

export interface ChatMaintenanceOptions
{
    repository: Pick<ChatRepository, "health" | "deleteExpired" | "archivePending">;
    distribution?: { poll(): Promise<void>; isReady(): boolean; };
    log: Log;
}
