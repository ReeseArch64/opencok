import { Effect } from "effect";
import { readEnvironment } from "@opencok/env/effect";
import { filesSchema } from "@opencok/env/files";
import { acquireResource } from "@opencok/core/resource";
import { createHandler } from "@opencok/api/files";
import { s3Client, S3ImageStore } from "@opencok/storage/images";
import { createAvatarTickets } from "@opencok/storage/avatar-tickets";

export const createFiles = (command: (name: string, ...args: string[]) => Promise<unknown>) =>
  Effect.gen(function* () {
    const config = yield* readEnvironment(filesSchema);
    const client = yield* acquireResource(
      "files.storage",
      async () =>
        s3Client({
          credentials: {
            accessKeyId: config.S3_ACCESS_KEY_ID,
            secretAccessKey: config.S3_SECRET_ACCESS_KEY,
          },
          region: config.S3_REGION,
          endpoint: config.S3_PUBLIC_ENDPOINT,
          forcePathStyle: true,
        }),
      async (resource) => resource.destroy(),
    );
    return createHandler(new S3ImageStore(client, config.S3_BUCKET), createAvatarTickets(command));
  });
