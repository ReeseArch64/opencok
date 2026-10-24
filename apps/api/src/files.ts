import { readFile } from "node:fs/promises";
import { Effect } from "effect";
import { readEnvironment } from "@opencok/env/effect";
import { filesSchema } from "@opencok/env/files";
import { acquireResource, fromPromise } from "@opencok/core/resource";
import { createHandler } from "@opencok/api/files";
import { s3Client, S3ImageStore } from "@opencok/storage/images";

export const createFiles = Effect.gen(function* () {
  const config = yield* readEnvironment(filesSchema);
  const key = yield* fromPromise("files.signing-key", async () => {
    const value = await readFile(config.FILES_SIGNING_KEY_FILE, "utf8");
    if (!/^[a-f0-9]{64}\n?$/.test(value)) throw new Error("Invalid image signing key");
    return Buffer.from(value.trim(), "hex");
  });
  const client = yield* acquireResource(
    "files.storage",
    async () =>
      s3Client({
        credentials:
          config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY
            ? {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
                sessionToken: config.AWS_SESSION_TOKEN,
              }
            : undefined,
        region: config.S3_REGION,
        endpoint: config.S3_ENDPOINT,
        forcePathStyle: config.S3_FORCE_PATH_STYLE,
      }),
    async (resource) => resource.destroy(),
  );
  return createHandler(new S3ImageStore(client, config.S3_BUCKET), key);
});
