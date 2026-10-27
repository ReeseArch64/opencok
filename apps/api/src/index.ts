import { Effect, Layer } from "effect";
import { runService } from "@opencok/core/runtime";
import { EnvironmentLive, readEnvironment } from "@opencok/env/effect";
import { telemetrySchema } from "@opencok/env/telemetry";
import { telemetryScope } from "@opencok/core/telemetry-scope";
import { ApiDependenciesLive, serveApi } from "./app.ts";
import { ApiConfigLive } from "./config.ts";

const dependencies = ApiDependenciesLive.pipe(
  Layer.provideMerge(ApiConfigLive),
  Layer.provide(EnvironmentLive),
);

runService(
  "api",
  Effect.scoped(
    Effect.gen(function* () {
      yield* telemetryScope("api", yield* readEnvironment(telemetrySchema));
      yield* serveApi.pipe(Effect.andThen(Effect.never), Effect.provide(dependencies));
    }),
  ).pipe(Effect.provide(EnvironmentLive)),
);
