import { randomUUID } from "node:crypto";
import { observedFetch } from "@opencok/core/fetch";
import type {
    ActivityDeadlineDispatcher,
    DeadlineRequest,
    DeadlineResponse,
} from "../contracts/deadline";
import { activityDeadlinePath } from "../contracts/deadline";
import { DeadlineOperation } from "../enums/deadline-operation";
import { ActivityDeadlineMapper } from "../mappings/deadline";
import { signActivityDeadline, verifyActivityDeadline } from "../identity/deadline";
import { deadlineInteger } from "../validations/deadline";
import { readActivityDeadlineBody } from "./body";

export interface ActivityDeadlinePublisherOptions
{
    url: string;
    kingdomId: number;
    signingSecret: string;
    timeoutMs: number;
    now?: () => number;
}

export function createActivityDeadlinePublisher(
    options: ActivityDeadlinePublisherOptions,
): ActivityDeadlineDispatcher
{
    const url = new URL(options.url);
    if (
        !deadlineInteger(options.kingdomId, 1, 2147483647) || options.signingSecret.length < 32
        || !deadlineInteger(options.timeoutMs, 100, 30000)
        || !["http:", "https:"].includes(url.protocol)
        || url.pathname !== activityDeadlinePath || url.username || url.password || url.search
        || url.hash
    )
    {
        throw new Error("Invalid activity deadline endpoint");
    }
    const now = options.now ?? Date.now;
    const mapper = new ActivityDeadlineMapper();
    const send = async (request: DeadlineRequest): Promise<DeadlineResponse> => {
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), options.timeoutMs);
        try
        {
            const body = mapper.encodeRequest(request);
            const timestamp = String(now());
            const response = await observedFetch("scheduler.dispatch", url, {
                method: "POST",
                redirect: "error",
                body,
                headers: {
                    "content-type": "application/json",
                    "x-activity-time": timestamp,
                    "x-activity-signature": signActivityDeadline(
                        body,
                        timestamp,
                        options.signingSecret,
                    ),
                },
                signal: abort.signal,
            });
            if (!response.ok)
            {
                await response.body?.cancel();
                throw new Error("Activity owner unavailable");
            }
            const output = await readActivityDeadlineBody(response.body, abort.signal);
            if (
                !verifyActivityDeadline(
                    output,
                    response.headers.get("x-activity-time"),
                    response.headers.get("x-activity-signature"),
                    options.signingSecret,
                    now(),
                    true,
                )
            )
            {
                throw new Error("Invalid activity owner response");
            }
            const result = mapper.decodeResponse(output);
            if (
                result.kingdomId !== request.kingdomId || result.requestId !== request.requestId
                || result.operation !== request.operation
            )
            {
                throw new Error("Activity owner response mismatch");
            }

            return result;
        }
        catch
        {
            throw new Error("Activity owner unavailable");
        }
        finally
        {
            clearTimeout(timer);
            abort.abort();
        }
    };
    const envelope = () => ({
        contractVersion: 1 as const,
        kingdomId: options.kingdomId,
        requestId: randomUUID(),
    });

    return {
        capabilities: async () => {
            const result = await send({ ...envelope(), operation: DeadlineOperation.Capabilities });
            if (result.operation !== DeadlineOperation.Capabilities)
            {
                throw new Error("Activity capability response mismatch");
            }

            return result.types;
        },
        restore: async (snapshot) => {
            const result = await send({
                ...envelope(),
                operation: DeadlineOperation.Restore,
                snapshot,
            });
            if (result.operation !== DeadlineOperation.Restore)
            {
                throw new Error("Activity restoration response mismatch");
            }

            return result.result;
        },
        finish: async (snapshot) => {
            const result = await send({
                ...envelope(),
                operation: DeadlineOperation.Finish,
                snapshot,
            });
            if (result.operation !== DeadlineOperation.Finish)
            {
                throw new Error("Activity completion response mismatch");
            }

            return result.result;
        },
    };
}
