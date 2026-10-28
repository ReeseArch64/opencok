export enum PostgresFailureKind
{
    StatementTimeout = "statement_timeout",
    QueryCancelled = "query_cancelled",
    LockTimeout = "lock_timeout",
    LockUnavailable = "lock_unavailable",
}
