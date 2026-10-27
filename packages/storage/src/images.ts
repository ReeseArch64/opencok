import { Agent as HttpAgent } from "node:http";
import { Agent as HttpsAgent } from "node:https";
import { createHash } from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { FILE_LIMIT } from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";
import type { ImageStore, UploadReceipt } from "@opencok/contracts/files";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    private signingClient: S3Client = client,
  ) {}

  image(key: string): Promise<string> {
    if (!/^[0-9]{1,6}\/[a-f0-9]{32}\.jpg$/.test(key)) throw new Error("Invalid avatar object key");

    return getSignedUrl(
      this.signingClient,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: "image/jpeg",
        ResponseCacheControl: "private, no-store",
      }),
      { expiresIn: 300 },
    );
  }

  async put(key: string, bytes: Buffer, owner: string, seq: string, hash: string) {
    if (await this.archived(owner, seq)) throw new HttpError(409, "Image sequence already exists");

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

  private async archived(owner: string, sequence: string): Promise<UploadReceipt | null> {
    try {
      const object = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: `_receipts/${owner}/${sequence}` }),
        { abortSignal: AbortSignal.timeout(5000) },
      );

      if (!object.Body || !object.ContentLength || object.ContentLength > 256)
        throw new Error("Invalid archived avatar receipt");

      const bytes = await object.Body.transformToByteArray();

      if (bytes.length !== object.ContentLength || bytes.length > 256)
        throw new Error("Invalid archived avatar receipt");

      const receipt = JSON.parse(Buffer.from(bytes).toString("utf8"));

      if (
        receipt.owner !== owner ||
        receipt.sequence !== sequence ||
        typeof receipt.hash !== "string" ||
        !/^[a-f0-9]{64}$/.test(receipt.hash)
      )
        throw new Error("Invalid archived avatar receipt");

      return { owner, sequence, hash: receipt.hash };
    } catch (error) {
      if (status(error) === 404) return null;

      throw error;
    }
  }

  async removePrevious(owner: string, sequence: string): Promise<void> {
    if (!/^[0-9]{1,20}$/.test(owner) || !/^[1-9][0-9]{0,5}$/.test(sequence))
      throw new Error("Invalid avatar replacement");

    if (sequence === "1") return;

    const previous = String(Number(sequence) - 1);
    const receipt = await this.find(owner, previous);

    if (!receipt) return;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: `_receipts/${owner}/${previous}`,
          Body: JSON.stringify(receipt),
          ContentType: "application/json",
          IfNoneMatch: "*",
        }),
        { abortSignal: AbortSignal.timeout(5000) },
      );
    } catch (error) {
      if (![409, 412].includes(status(error) ?? 0)) throw error;

      const archived = await this.archived(owner, previous);

      if (!archived || archived.hash !== receipt.hash)
        throw new Error("Archived avatar receipt mismatch");
    }

    const name = createHash("md5").update(`${owner}_${previous}`).digest("hex");
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: `${owner.slice(-6)}/${name}.jpg`,
      }),
      { abortSignal: AbortSignal.timeout(5000) },
    );
  }

  async find(owner: string, sequence: string): Promise<UploadReceipt | null> {
    const name = createHash("md5").update(`${owner}_${sequence}`).digest("hex");
    const stored = await this.object(`${owner.slice(-6)}/${name}.jpg`);

    if (!stored) return this.archived(owner, sequence);

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
