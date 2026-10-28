import type { DeadlineRequest, DeadlineResponse } from "../contracts/deadline";
import { DeadlineOperation } from "../enums/deadline-operation";
import { ActivityDispatchResult } from "../enums/dispatch-result";
import {
    deadlineRecord,
    deadlineInteger,
    validDeadlineTypes,
    validDueActivitySnapshot,
    validLegacyActivitySnapshot,
} from "../validations/deadline";

function envelope(value: unknown): value is Record<string, unknown> & {
    contractVersion: 1;
    kingdomId: number;
    requestId: string;
}
{
    return deadlineRecord(value) && value.contractVersion === 1
        && deadlineInteger(value.kingdomId, 1, 2147483647)
        && typeof value.requestId === "string"
        && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value.requestId);
}

function instant(value: unknown): bigint
{
    if (typeof value !== "string" || !/^(0|[1-9][0-9]{0,18})$/.test(value))
    {
        throw new Error("Invalid activity deadline instant");
    }

    return BigInt(value);
}

export class ActivityDeadlineMapper
{
    public encodeRequest(request: DeadlineRequest): string
    {
        const body = JSON.stringify(
            request,
            (_, value) => typeof value === "bigint" ? String(value) : value,
        );
        this.decodeRequest(body);

        return body;
    }

    public decodeRequest(body: string): DeadlineRequest
    {
        const value: unknown = JSON.parse(body);
        if (!envelope(value))
        {
            throw new Error("Invalid activity deadline envelope");
        }
        const base = {
            contractVersion: value.contractVersion,
            kingdomId: value.kingdomId,
            requestId: value.requestId,
        };
        if (value.operation === DeadlineOperation.Capabilities && Object.keys(value).length === 4)
        {
            return { ...base, operation: DeadlineOperation.Capabilities };
        }
        if (Object.keys(value).length !== 5 || !deadlineRecord(value.snapshot))
        {
            throw new Error("Invalid activity deadline request");
        }
        if (value.operation === DeadlineOperation.Finish)
        {
            const snapshot = { ...value.snapshot, dueAt: instant(value.snapshot.dueAt) };
            if (validDueActivitySnapshot(snapshot))
            {
                return { ...base, operation: DeadlineOperation.Finish, snapshot };
            }
        }
        if (value.operation === DeadlineOperation.Restore)
        {
            const snapshot = {
                ...value.snapshot,
                startTime: value.snapshot.startTime === null
                    ? null
                    : instant(value.snapshot.startTime),
                updateTime: instant(value.snapshot.updateTime),
            };
            if (validLegacyActivitySnapshot(snapshot))
            {
                return { ...base, operation: DeadlineOperation.Restore, snapshot };
            }
        }

        throw new Error("Invalid activity deadline request");
    }

    public encodeResponse(response: DeadlineResponse): string
    {
        const body = JSON.stringify(response);
        this.decodeResponse(body);

        return body;
    }

    public decodeResponse(body: string): DeadlineResponse
    {
        const value: unknown = JSON.parse(body);
        if (!envelope(value) || Object.keys(value).length !== 5)
        {
            throw new Error("Invalid activity deadline response");
        }
        const base = {
            contractVersion: value.contractVersion,
            kingdomId: value.kingdomId,
            requestId: value.requestId,
        };
        if (value.operation === DeadlineOperation.Capabilities && validDeadlineTypes(value.types))
        {
            return { ...base, operation: DeadlineOperation.Capabilities, types: value.types };
        }
        if (
            (value.operation === DeadlineOperation.Restore
                || value.operation === DeadlineOperation.Finish)
            && Object.values(ActivityDispatchResult).includes(
                value.result as ActivityDispatchResult,
            )
        )
        {
            return {
                ...base,
                operation: value.operation,
                result: value.result as ActivityDispatchResult,
            };
        }

        throw new Error("Invalid activity deadline response");
    }
}
