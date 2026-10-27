import { AsyncLocalStorage } from "node:async_hooks";
import { logEvent } from "./logging.ts";
import { observeOperation } from "./operation.ts";

type Fields = Record<string, string | number | boolean | undefined>;
const pending = new AsyncLocalStorage<{ event: string; fields: Fields }[]>();

export function afterCommit(event: string, fields: Fields) {
  const events = pending.getStore();
  if (events) events.push({ event, fields });
  else logEvent(event, fields);
}

export function observeTransaction<T>(operation: string, run: () => Promise<T>): Promise<T> {
  const parent = pending.getStore();
  const events: { event: string; fields: Fields }[] = [];
  return observeOperation(operation, () =>
    pending.run(events, async () => {
      try {
        const result = await run();
        if (parent) parent.push(...events);
        else {
          logEvent("transaction_committed", {
            operation,
            effects: events.length,
            outcome: "success",
          });
          for (const event of events)
            logEvent(event.event, {
              ...event.fields,
              commitState: "committed",
              outcome: "success",
            });
        }
        return result;
      } catch (error) {
        logEvent(
          "transaction_failed",
          {
            operation,
            discardedEffects: events.length,
            commitState: "unconfirmed",
            outcome: "failure",
          },
          "error",
        );
        throw error;
      }
    }),
  );
}
