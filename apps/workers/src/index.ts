import { Effect } from "effect";
import { runService } from "@opencok/core/runtime";
import { logEvent } from "@opencok/core/logging";
import { telemetryScope } from "@opencok/core/telemetry-scope";
import { EnvironmentLive, readEnvironment } from "@opencok/env/effect";
import { workersSchema } from "@opencok/env/workers/schema";
import { telemetrySchema } from "@opencok/env/telemetry";
import { mailWorkerConfig } from "./config";
import { createMailWorkerApplication } from "./composition";

runService(
    "workers",
    Effect.scoped(Effect.gen(function*()
    {
        yield* telemetryScope("workers", yield* readEnvironment(telemetrySchema));
        const config = mailWorkerConfig(yield* readEnvironment(workersSchema));
        const app = yield* Effect.acquireRelease(
            Effect.tryPromise({
                try: () => createMailWorkerApplication(config),
                catch: () => new Error("Mail worker startup failed"),
            }),
            (application) => Effect.promise(() => application.close()),
        );
        const address = app.server.address();
        logEvent("started", {
            service: "workers",
            kingdom: config.kingdomId,
            port: typeof address === "object" && address ? address.port : undefined,
            outcome: "success",
        });
        yield* Effect.never;
    })).pipe(Effect.provide(EnvironmentLive)),
);
