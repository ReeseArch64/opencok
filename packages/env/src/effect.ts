import { Context, Effect, Layer } from "effect";
import type { z } from "zod";
import { loadEnvironment, workspaceRoot } from "./load";
import { databaseSchema } from "./database.schema";
import { EnvironmentError, requireEnvironment, validateEnvironment } from "./validation";

export class EnvironmentSource extends Context.Service<
  EnvironmentSource,
  Readonly<Record<string, string | undefined>>
>()("@opencok/env/EnvironmentSource") {}

export const EnvironmentLive = Layer.effect(
  EnvironmentSource,
  Effect.try({
    try: () => Object.freeze(loadEnvironment(process.env)),
    catch: () => new EnvironmentError(["root .env"]),
  }),
);

export function readEnvironment<T extends z.ZodType>(schema: T) {
  return Effect.flatMap(EnvironmentSource, (source) =>
    Effect.try({
      try: () => validateEnvironment(schema, source),
      catch: (error) =>
        error instanceof EnvironmentError ? error : new EnvironmentError(["environment"]),
    }),
  );
}

export const databaseUrl = Effect.flatMap(readEnvironment(databaseSchema), (settings) =>
  Effect.try({
    try: () => requireEnvironment(settings, "DATABASE_URL"),
    catch: () => new EnvironmentError(["DATABASE_URL"], "missing"),
  }),
);

export { workspaceRoot };
