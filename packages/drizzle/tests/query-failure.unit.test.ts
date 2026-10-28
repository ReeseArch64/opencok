import { expect, test } from "bun:test";
import { PostgresFailureKind } from "../src/enums/postgres-failure-kind";
import { postgresFailureKind } from "../src/query-failure";

test.each(
    [
        [
            "57014",
            "canceling statement due to statement timeout",
            PostgresFailureKind.StatementTimeout,
        ],
        ["57014", "canceling statement due to user request", PostgresFailureKind.QueryCancelled],
        ["55P03", "canceling statement due to lock timeout", PostgresFailureKind.LockTimeout],
        [
            "55P03",
            "could not obtain lock on row in relation synthetic",
            PostgresFailureKind.LockUnavailable,
        ],
        ["55P03", "localized private diagnostic", PostgresFailureKind.LockUnavailable],
        ["08006", "synthetic outage", undefined],
    ] as const,
)("postgresFailureKind_%s_%s_returns_%s", (code, message, expected) => {
    expect(postgresFailureKind(Object.assign(new Error(message), { code }))).toBe(expected);
});

test("postgresFailureKind_applicationCancellation_doesNotClaimADatabaseTimeout", () => {
    expect(postgresFailureKind(new DOMException("cancelled", "AbortError"))).toBeUndefined();
    expect(postgresFailureKind(new DOMException("deadline", "TimeoutError"))).toBeUndefined();
    expect(postgresFailureKind(undefined)).toBeUndefined();
});
