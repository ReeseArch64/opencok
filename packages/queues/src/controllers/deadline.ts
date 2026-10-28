import type {
    ActivityDeadlineDispatcher,
    DeadlineRequest,
    DeadlineResponse,
} from "../contracts/deadline";
import { activityDeadlinePath } from "../contracts/deadline";
import { DeadlineOperation } from "../enums/deadline-operation";
import { ActivityDeadlineMapper } from "../mappings/deadline";
import { signActivityDeadline, verifyActivityDeadline } from "../identity/deadline";
import { readActivityDeadlineBody } from "../connection/body";
import { deadlineInteger } from "../validations/deadline";

export interface ActivityDeadlineControllerOptions
{
    kingdomId: number;
    signingSecret: string;
    dispatcher: ActivityDeadlineDispatcher;
    ready(): boolean;
    timeoutMs?: number;
    maxConcurrent?: number;
    now?: () => number;
}

export class ActivityDeadlineController
{
    private readonly mapper = new ActivityDeadlineMapper();
    private readonly active = new Set<Promise<Response>>();
    private readonly timeout: number;
    private readonly maximum: number;
    private readonly now: () => number;
    private stopping = false;

    public constructor(private readonly options: ActivityDeadlineControllerOptions)
    {
        this.timeout = options.timeoutMs ?? 5000;
        this.maximum = options.maxConcurrent ?? 8;
        this.now = options.now ?? Date.now;
        if (
            !deadlineInteger(options.kingdomId, 1, 2147483647)
            || options.signingSecret.length < 32 || !deadlineInteger(this.timeout, 100, 30000)
            || !deadlineInteger(this.maximum, 1, 32)
        )
        {
            throw new Error("Invalid activity deadline endpoint configuration");
        }
    }

    public readonly handle = async (request: Request): Promise<Response> => {
        if (request.method !== "POST" || new URL(request.url).pathname !== activityDeadlinePath)
        {
            return this.failure(404);
        }
        if (this.stopping || !this.options.ready())
        {
            return this.failure(503);
        }
        if (this.active.size >= this.maximum)
        {
            return this.failure(429);
        }
        if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? ""))
        {
            return this.failure(415);
        }
        const length = request.headers.get("content-length");
        if (length !== null && (!/^\d+$/.test(length) || Number(length) > 4096))
        {
            return this.failure(413);
        }
        const abort = new AbortController();
        let timer: ReturnType<typeof setTimeout> | undefined;
        const work = this.dispatch(request, abort.signal).catch(() => this.failure(503));
        this.active.add(work);
        void work.finally(() => this.active.delete(work));
        try
        {
            return await Promise.race([
                work,
                new Promise<Response>((resolve) => {
                    timer = setTimeout(() => {
                        abort.abort();
                        resolve(this.failure(503));
                    }, this.timeout);
                }),
            ]);
        }
        finally
        {
            clearTimeout(timer);
            abort.abort();
        }
    };

    public async close(): Promise<void>
    {
        this.stopping = true;
        await Promise.allSettled(this.active);
    }

    private async dispatch(request: Request, signal: AbortSignal): Promise<Response>
    {
        const body = await readActivityDeadlineBody(request.body, signal);
        if (
            !verifyActivityDeadline(
                body,
                request.headers.get("x-activity-time"),
                request.headers.get("x-activity-signature"),
                this.options.signingSecret,
                this.now(),
            )
        )
        {
            return this.failure(401);
        }
        let command: DeadlineRequest;
        try
        {
            command = this.mapper.decodeRequest(body);
        }
        catch
        {
            return this.failure(400);
        }
        if (command.kingdomId !== this.options.kingdomId)
        {
            return this.failure(403);
        }
        if (this.stopping || !this.options.ready() || signal.aborted)
        {
            return this.failure(503);
        }
        const envelope = {
            contractVersion: command.contractVersion,
            kingdomId: command.kingdomId,
            requestId: command.requestId,
        };
        const response: DeadlineResponse = command.operation === DeadlineOperation.Capabilities
            ? {
                ...envelope,
                operation: command.operation,
                types: await this.options.dispatcher.capabilities(),
            }
            : {
                ...envelope,
                operation: command.operation,
                result: command.operation === DeadlineOperation.Finish
                    ? await this.options.dispatcher.finish(command.snapshot)
                    : await this.options.dispatcher.restore(command.snapshot),
            };
        const output = this.mapper.encodeResponse(response);
        const timestamp = String(this.now());

        return new Response(output, {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-store",
                "x-activity-time": timestamp,
                "x-activity-signature": signActivityDeadline(
                    output,
                    timestamp,
                    this.options.signingSecret,
                    true,
                ),
            },
        });
    }

    private failure(status: number): Response
    {
        return new Response(null, { status, headers: { "cache-control": "no-store" } });
    }
}
