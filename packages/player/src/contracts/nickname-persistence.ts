import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { Row } from "@opencok/contracts/rows";
import type { AvatarSystemMail } from "@opencok/contracts/files";

type Transaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

export interface NicknamePersistenceRuntime
{
    captureCostFact(
        tx: Transaction,
        event: {
            kingdomId: number;
            ownerUid: string;
            requestId: string;
            eventId: string;
            payload: Uint8Array;
        },
        now: bigint,
        witnessedPostings?: readonly Row[],
    ): Promise<void>;
    readSharedUserProfile(tx: Transaction, uid: string, kingdomId: number): Promise<Row>;
    insertSystemMail(
        tx: Transaction,
        input: AvatarSystemMail,
        owner: string,
        stem: string,
        createdAt: bigint,
    ): Promise<void>;
}
