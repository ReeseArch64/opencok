import { Agent as HttpAgent } from "node:http";
import { Agent as HttpsAgent } from "node:https";
import { createHash } from "node:crypto";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { FILE_LIMIT } from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";
import type { ImageStore, UploadReceipt } from "@opencok/contracts/files";

export function s3Client(config: {
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
  credentials?: { accessKeyId: string; secretAccessKey: string; sessionToken?: string };
}) {
  return new S3Client({
    region: config.region,
    credentials: config.credentials,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    maxAttempts: 1,
    requestHandler: {
      httpAgent: new HttpAgent({ keepAlive: false }),
      httpsAgent: new HttpsAgent({ keepAlive: false }),
    },
  });
}

function status(error: unknown) {
  return (error as { $metadata?: { httpStatusCode?: number } } | null)?.$metadata?.httpStatusCode;
}

export class S3ImageStore implements ImageStore {
  constructor(
    private client: S3Client,
    private bucket: string,
  ) {}

  async put(key: string, bytes: Buffer, owner: string, seq: string, hash: string) {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: bytes,
          ContentType: "image/jpeg",
          IfNoneMatch: "*",
          Metadata: { owner, sequence: seq, sha256: hash },
        }),
        { abortSignal: AbortSignal.timeout(5000) },
      );
    } catch (error) {
      if (status(error) === 409 || status(error) === 412)
        throw new HttpError(409, "Image sequence already exists");
      throw error;
    }
  }

  private async object(key: string) {
    try {
      const object = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { abortSignal: AbortSignal.timeout(5000) },
      );
      if (!object.Body || !object.ContentLength || object.ContentLength > FILE_LIMIT)
        throw new Error("Invalid avatar object");
      const bytes = await object.Body.transformToByteArray();
      if (bytes.length !== object.ContentLength || bytes.length > FILE_LIMIT)
        throw new Error("Invalid avatar object size");
      return { object, bytes };
    } catch (error) {
      if (status(error) === 404) return null;
      throw error;
    }
  }

  async get(key: string): Promise<Uint8Array | null> {
    return (await this.object(key))?.bytes ?? null;
  }

  async find(owner: string, sequence: string): Promise<UploadReceipt | null> {
    const name = createHash("md5").update(`${owner}_${sequence}`).digest("hex");
    const stored = await this.object(`${owner.slice(-6)}/${name}.jpg`);
    if (!stored) return null;
    const { object, bytes } = stored;
    const hash = createHash("sha256").update(bytes).digest("hex");
    if (
      object.ContentType !== "image/jpeg" ||
      bytes[0] !== 0xff ||
      bytes[1] !== 0xd8 ||
      object.Metadata?.owner !== owner ||
      object.Metadata.sequence !== sequence ||
      object.Metadata.sha256 !== hash
    )
      throw new Error("Avatar integrity mismatch");
    return { owner, sequence, hash };
  }
}
