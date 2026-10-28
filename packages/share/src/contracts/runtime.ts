import type { ShareFeedOperation, ShareFeedTransaction, ShareFeedResponse } from "./feed";

export interface ShareFeedRuntime
{
    randomUUID(): string;
    fail(code: string): never;
}

export interface ShareFeedPlanner
{
    handles(command: string): boolean;
    execute(input: ShareFeedOperation, tx: ShareFeedTransaction): Promise<ShareFeedResponse>;
}
