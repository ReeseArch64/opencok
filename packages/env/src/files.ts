import { z } from "zod";
import { validateEnvironment } from "./validation";

export const filesSchema = z.object({
  S3_PUBLIC_ENDPOINT: z.url({ protocol: /^https?$/ }).refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password && !url.search && !url.hash && url.pathname === "/";
  }),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(3),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
});
export const parseFilesEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(filesSchema, source);
