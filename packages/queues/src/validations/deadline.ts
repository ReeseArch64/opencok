import type { DueActivitySnapshot, LegacyActivitySnapshot } from "../contracts/deadline";

export function deadlineRecord(value: unknown): value is Record<string, unknown>
{
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deadlineIdentifier(value: unknown, maximum = 40): value is string
{
    return typeof value === "string" && value.length > 0 && value.length <= maximum
        && value.isWellFormed() && !value.includes("\0");
}

export function deadlineInstant(value: unknown): value is bigint
{
    return typeof value === "bigint" && value >= 0n && value < 9223372036854775807n;
}

export function deadlineInteger(value: unknown, minimum = 0, maximum = 41): value is number
{
    return typeof value === "number" && Number.isInteger(value) && value >= minimum
        && value <= maximum;
}

export function validDueActivitySnapshot(value: unknown): value is DueActivitySnapshot
{
    return deadlineRecord(value) && Object.keys(value).length === 6
        && deadlineIdentifier(value.id) && deadlineIdentifier(value.ownerId)
        && deadlineIdentifier(value.queueId) && deadlineInteger(value.type)
        && deadlineInstant(value.dueAt) && deadlineInteger(value.version, 1, 2147483647);
}

export function validLegacyActivitySnapshot(value: unknown): value is LegacyActivitySnapshot
{
    return deadlineRecord(value) && Object.keys(value).length === 6
        && deadlineIdentifier(value.uuid) && deadlineIdentifier(value.ownerId)
        && deadlineIdentifier(value.itemId, 255) && deadlineInteger(value.type)
        && (value.startTime === null || deadlineInstant(value.startTime))
        && deadlineInstant(value.updateTime);
}

export function validDeadlineTypes(value: unknown): value is readonly number[]
{
    return Array.isArray(value) && value.length <= 42
        && value.every((type) => deadlineInteger(type))
        && new Set(value).size === value.length;
}
