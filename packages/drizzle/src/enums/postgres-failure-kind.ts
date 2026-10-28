export enum PostgresFailureKind
{
    DriverReadTimeout = "driver_read_timeout",
    StatementTimeout = "statement_timeout",
    QueryCancelled = "query_cancelled",
    LockTimeout = "lock_timeout",
    LockUnavailable = "lock_unavailable",
}
