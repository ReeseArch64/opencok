import { Effect } from "effect";
import { runService } from "@opencok/core/runtime";
import { logEvent } from "@opencok/core/logging";
import { telemetryScope } from "@opencok/core/telemetry-scope";
import { EnvironmentLive, readEnvironment } from "@opencok/env/effect";
import { schedulerSchema } from "@opencok/env/scheduler/schema";
import { telemetrySchema } from "@opencok/env/telemetry";
import { schedulerConfig } from "./config";
import { createSchedulerApplication } from "./composition";

runService(
    "scheduler",
    Effect.scoped(Effect.gen(function*()
    {
        yield* telemetryScope("scheduler", yield* readEnvironment(telemetrySchema));
        const config = schedulerConfig(yield* readEnvironment(schedulerSchema));
        const app = yield* Effect.acquireRelease(
            Effect.tryPromise({
                try: () => createSchedulerApplication(config),
                catch: () => new Error("Scheduler startup failed"),
            }),
            (application) => Effect.promise(() => application.close()),
        );
        const address = app.server.address();
        logEvent("started", {
            service: "scheduler",
            kingdom: config.kingdomId,
            port: typeof address === "object" && address ? address.port : undefined,
            outcome: "success",
        });
        yield* Effect.never;
    })).pipe(Effect.provide(EnvironmentLive)),
);
