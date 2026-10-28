export function postgresFailureKind(error: unknown): string | undefined
{
    if (!(error instanceof Error) || !("code" in error))
    {
        return undefined;
    }

    if (error.code === "57014")
    {
        return error.message === "canceling statement due to statement timeout"
            ? "statement_timeout"
            : "query_cancelled";
    }

    if (error.code === "55P03")
    {
        return error.message === "canceling statement due to lock timeout"
            ? "lock_timeout"
            : "lock_unavailable";
    }

    return undefined;
}
