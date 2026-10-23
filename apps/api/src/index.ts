import { Effect, Layer } from "effect";
import { runService } from "@opencok/core/runtime";
import { EnvironmentLive } from "@opencok/env/effect";
import { ApiDependenciesLive, serveApi } from "./app.ts";
import { ApiConfigLive } from "./config.ts";

const dependencies = ApiDependenciesLive.pipe(
  Layer.provideMerge(ApiConfigLive),
  Layer.provide(EnvironmentLive),
);

runService(
  "api",
  Effect.scoped(serveApi.pipe(Effect.andThen(Effect.never))).pipe(Effect.provide(dependencies)),
);
