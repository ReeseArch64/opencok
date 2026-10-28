import { expect, test } from "bun:test";
import { postgresFailureKind } from "../src/query-failure";

test.each([
    ["57014", "canceling statement due to statement timeout", "statement_timeout"],
    ["57014", "canceling statement due to user request", "query_cancelled"],
    ["55P03", "canceling statement due to lock timeout", "lock_timeout"],
    ["55P03", "could not obtain lock on row in relation synthetic", "lock_unavailable"],
    ["55P03", "localized private diagnostic", "lock_unavailable"],
    ["08006", "synthetic outage", undefined],
])("postgresFailureKind_%s_%s_returns_%s", (code, message, expected) => {
    expect(postgresFailureKind(Object.assign(new Error(message), { code }))).toBe(expected);
});

test("postgresFailureKind_applicationCancellation_doesNotClaimADatabaseTimeout", () => {
    expect(postgresFailureKind(new DOMException("cancelled", "AbortError"))).toBeUndefined();
    expect(postgresFailureKind(new DOMException("deadline", "TimeoutError"))).toBeUndefined();
    expect(postgresFailureKind(undefined)).toBeUndefined();
});
