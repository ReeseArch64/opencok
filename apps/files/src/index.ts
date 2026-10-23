import { Effect } from "effect";
import { EnvironmentLive } from "@opencok/env/effect";
import { runService } from "@opencok/core/runtime";
import { serveFiles } from "./app";

runService(
  "files",
  Effect.scoped(serveFiles.pipe(Effect.andThen(Effect.never))).pipe(
    Effect.provide(EnvironmentLive),
  ),
);
