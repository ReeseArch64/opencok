import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

export const environmentSchema = z
  .object({
    NODE_ENV: z.preprocess(
      blankToUndefined,
      z.enum(["development", "testing", "production"]).default("development"),
    ),
  })
  .readonly();

export type Environment = z.infer<typeof environmentSchema>;
export const parseEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(environmentSchema, source);
