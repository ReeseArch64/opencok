import { PollingWorker } from "@opencok/core/polling-worker";
import type { Schedule } from "@opencok/core/schedule";

export class MailGiftRelay extends PollingWorker
{
    public constructor(
        private readonly dispatch: () => Promise<number>,
        reportFailure: () => void,
        after?: Schedule,
    )
    {
        super(reportFailure, after);
        this.start();
    }

    protected execute(): Promise<number>
    {
        return this.dispatch();
    }
}

export function startMailGiftRelay(
    dispatch: () => Promise<number>,
    reportFailure: () => void,
    after?: Schedule,
): MailGiftRelay
{
    return new MailGiftRelay(dispatch, reportFailure, after);
}
