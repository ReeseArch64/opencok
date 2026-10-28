import { PostgresFailureKind } from "./enums/postgres-failure-kind";

export function postgresFailureKind(error: unknown): PostgresFailureKind | undefined
{
    if (!(error instanceof Error) || !("code" in error))
    {
        return undefined;
    }

    if (error.code === "57014")
    {
        return error.message === "canceling statement due to statement timeout"
            ? PostgresFailureKind.StatementTimeout
            : PostgresFailureKind.QueryCancelled;
    }

    if (error.code === "55P03")
    {
        return error.message === "canceling statement due to lock timeout"
            ? PostgresFailureKind.LockTimeout
            : PostgresFailureKind.LockUnavailable;
    }

    return undefined;
}
