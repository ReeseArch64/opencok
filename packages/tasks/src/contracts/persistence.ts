import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { AvatarSystemMail } from "@opencok/mail/contracts/system-mail";
import type { QuestRecordReaders } from "./runtime";

export type QuestTransaction = Parameters<
    Parameters<DatabaseClient<"kingdom">["transaction"]>[0]
>[0];

export interface QuestPersistenceRuntime extends Pick<QuestRecordReaders, "text" | "num">
{
    insertSystemMail(
        tx: QuestTransaction,
        message: AvatarSystemMail,
        owner: string,
        stem: string,
        createdAt: bigint,
        itemIdFlag: 0 | 1,
    ): Promise<void>;
}
