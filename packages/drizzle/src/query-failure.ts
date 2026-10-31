import { PostgresFailureKind } from "./enums/postgres-failure-kind";

export function postgresFailureKind(error: unknown): PostgresFailureKind | undefined
{
    if (!(error instanceof Error))
    {
        return undefined;
    }

    const code = "code" in error ? error.code : undefined;

    if (code === undefined && error.name === "Error" && error.message === "Query read timeout")
    {
        return PostgresFailureKind.DriverReadTimeout;
    }

    if (code === "57014")
    {
        return error.message === "canceling statement due to statement timeout"
            ? PostgresFailureKind.StatementTimeout
            : PostgresFailureKind.QueryCancelled;
    }

    if (code === "55P03")
    {
        return error.message === "canceling statement due to lock timeout"
            ? PostgresFailureKind.LockTimeout
            : PostgresFailureKind.LockUnavailable;
    }

    return undefined;
}
