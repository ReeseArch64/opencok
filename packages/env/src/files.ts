import { z } from "zod";
import { port } from "./service.schema";
import { blankToUndefined, validateEnvironment } from "./validation";
export const filesSchema = z
  .object({
    FILES_HOST: z.string().min(1).default("127.0.0.1"),
    FILES_PORT: port(8084),
    FILES_SIGNING_KEY_FILE: z.string().min(1).default("/run/opencok/image-upload-key"),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_SESSION_TOKEN: z.string().min(1).optional(),
    S3_BUCKET: z.string().min(3),
    S3_REGION: z.string().min(1).default("us-east-1"),
    S3_ENDPOINT: z.preprocess(blankToUndefined, z.url({ protocol: /^https?$/ }).optional()),
    S3_FORCE_PATH_STYLE: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
  })
  .refine((value) => !!value.AWS_ACCESS_KEY_ID === !!value.AWS_SECRET_ACCESS_KEY, {
    path: ["AWS_ACCESS_KEY_ID"],
    message: "Configure both credential fields",
  });
export const parseFilesEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(filesSchema, source);
