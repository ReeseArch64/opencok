import { z } from "zod";
import { blankToUndefined } from "./validation";

export const telemetrySchema = z
  .object({
    OTEL_EXPORTER_OTLP_ENDPOINT: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          const url = new URL(value);
          return !url.username && !url.password && !url.search && !url.hash;
        })
        .optional(),
    ),
    MAPLE_LOCAL_INGEST_KEY: z.preprocess(blankToUndefined, z.string().min(16).optional()),
    OTEL_SLOW_OPERATION_MS: z.coerce.number().int().min(100).max(60000).default(1000),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  })
  .transform((value) => ({
    endpoint: value.OTEL_EXPORTER_OTLP_ENDPOINT,
    ingestKey: value.MAPLE_LOCAL_INGEST_KEY,
    intervalMs: 1000,
    slowOperationMs: value.OTEL_SLOW_OPERATION_MS,
    environment: value.NODE_ENV,
  }));
