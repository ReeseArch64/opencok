import type { PoolClient } from "pg";
import { observeDependencyOperation } from "@opencok/core/operation";
import { errorReason, logEvent } from "@opencok/core/logging";
import { afterCommit } from "@opencok/core/transaction";

const commands = new Set([
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "BEGIN",
  "COMMIT",
  "ROLLBACK",
  "SAVEPOINT",
  "RELEASE",
  "SET",
  "CREATE",
  "ALTER",
  "DROP",
  "TRUNCATE",
  "WITH",
]);

export function observePostgresClient(
  client: PoolClient,
  role: string,
  tables: ReadonlySet<string>,
) {
  const query = client.query;
  client.query = function (this: PoolClient, ...args: unknown[]) {
    const input = args[0];
    const text = typeof input === "string" ? input : (input as { text?: unknown } | null)?.text;
    const first =
      typeof text === "string" ? /^\s*([a-z]+)/i.exec(text)?.[1]?.toUpperCase() : undefined;
    const command = first && commands.has(first) ? first : "OTHER";
    const candidate =
      typeof text === "string"
        ? /\b(?:into|update|from)\s+(?:"[A-Za-z0-9_]+"\.)?"?([A-Za-z0-9_]+)"?/i.exec(text)?.[1]
        : undefined;
    const table = candidate && tables.has(candidate) ? candidate : "unknown";
    const operation = `postgresql.${role}.${command.toLowerCase()}`;
    return observeDependencyOperation(
      operation,
      () => {
        const result = Reflect.apply(query, this, args);
        if (!(result instanceof Promise)) return result;
        return result.then(
          (value: { rowCount?: number; rows?: unknown[] }) => {
            logEvent("database_result", {
              operation,
              rowCount: value?.rowCount ?? undefined,
              table,
              outcome: "success",
              commitState: "statement_completed",
            });
            if (["INSERT", "UPDATE", "DELETE"].includes(command))
              afterCommit("database_rows_changed", {
                operation,
                table,
                rowCount: value?.rowCount ?? 0,
              });
            return value;
          },
          (error: unknown) => {
            const code = error instanceof Error && "code" in error ? error.code : undefined;
            logEvent(
              "database_failed",
              {
                operation,
                table,
                databaseRole: role,
                reason: errorReason(error),
                sqlState: typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? code : undefined,
                outcome: "failure",
              },
              "error",
            );
            throw error;
          },
        );
      },
      {
        component: "postgresql",
        databaseRole: role,
        table,
        "db.system.name": "postgresql",
        "db.operation.name": command,
      },
    );
  } as typeof client.query;
}
