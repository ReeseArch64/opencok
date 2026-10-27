import { expect, test } from "bun:test";
import { createHash, randomBytes } from "node:crypto";
import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { s3Client, S3ImageStore } from "@opencok/storage/images";
import sharp from "sharp";

test("S3 conditional writes, metadata integrity and restart persistence use isolated MinIO", async () => {
  const name = `opencok-files-test-${randomBytes(8).toString("hex")}`;
  const password = randomBytes(24).toString("hex");
  let created = false;
  const clients: S3Client[] = [];
  async function docker(args: string[]) {
    const child = Bun.spawn(["docker", ...args], {
      env: { ...process.env, MINIO_ROOT_PASSWORD: password },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [output, , status] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (status) {throw new Error(`Disposable MinIO ${args[0]} failed`);}
    return output.trim();
  }
  async function client() {
    const port = (await docker(["port", name, "9000/tcp"])).split(":").at(-1);
    const endpoint = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (
        await fetch(`${endpoint}/minio/health/live`)
          .then((r) => r.ok)
          .catch(() => false)
      ) {
        ready = true;
        break;
      }
      await Bun.sleep(100);
    }
    if (!ready) {throw new Error("Disposable MinIO readiness timeout");}
    const result = s3Client({
      endpoint,
      region: "us-east-1",
      forcePathStyle: true,
      credentials: { accessKeyId: "synthetic", secretAccessKey: password },
    });
    clients.push(result);
    return result;
  }
  try {
    await docker([
      "run",
      "--detach",
      "--rm",
      "--name",
      name,
      "--env",
      "MINIO_ROOT_USER=synthetic",
      "--env",
      "MINIO_ROOT_PASSWORD",
      "--publish",
      "127.0.0.1::9000",
      "ghcr.io/coollabsio/minio",
      "server",
      "/data",
    ]);
    created = true;
    const s3 = await client();
    const bucket = "synthetic-avatars";
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    let store = new S3ImageStore(s3, bucket);
    const owner = "1234567",
      sequence = "1";
    const nameHash = createHash("md5").update(`${owner}_${sequence}`).digest("hex");
    const path = `${owner.slice(-6)}/${nameHash}.jpg`;
    const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: "blue" } })
      .jpeg()
      .toBuffer();
    const hash = createHash("sha256").update(bytes).digest("hex");
    const writes = await Promise.allSettled([
      store.put(path, bytes, owner, sequence, hash),
      store.put(path, bytes, owner, sequence, hash),
    ]);
    expect(writes.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(writes.find((result) => result.status === "rejected")).toMatchObject({
      reason: { status: 409 },
    });
    expect(await store.find(owner, sequence)).toEqual({ owner, sequence, hash });
    const publicClient = s3Client({
      endpoint: "https://avatars.example.invalid",
      region: "us-east-1",
      forcePathStyle: true,
      credentials: { accessKeyId: "synthetic", secretAccessKey: password },
    });
    clients.push(publicClient);
    const splitStore = new S3ImageStore(s3, bucket, publicClient);
    expect(await splitStore.find(owner, sequence)).toEqual({ owner, sequence, hash });
    expect(await splitStore.get(path)).toEqual(new Uint8Array(bytes));
    const splitUrl = new URL(await splitStore.image(path));
    expect(splitUrl.origin).toBe("https://avatars.example.invalid");
    expect(splitUrl.searchParams.get("X-Amz-Signature")).toMatch(/^[a-f0-9]{64}$/);
    const signed = await store.image(path);
    const publicUrl = new URL(signed);
    expect(publicUrl.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(publicUrl.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
    const download = await fetch(signed);
    expect(download.status).toBe(200);
    expect(new Uint8Array(await download.arrayBuffer())).toEqual(new Uint8Array(bytes));
    expect(download.headers.get("cache-control")).toBe("private, no-store");
    const unsigned = new URL(publicUrl);
    unsigned.search = "";
    expect((await fetch(unsigned)).status).toBe(403);
    publicUrl.searchParams.set("X-Amz-Signature", "0".repeat(64));
    expect((await fetch(publicUrl)).status).toBe(403);

    await docker(["restart", name]);
    store = new S3ImageStore(await client(), bucket);
    expect(Buffer.from((await store.get(path))!)).toEqual(Buffer.from(bytes));
    expect(await store.get("missing.jpg")).toBeNull();
    const nextName = createHash("md5").update(`${owner}_2`).digest("hex");
    const nextPath = `${owner.slice(-6)}/${nextName}.jpg`;
    await store.put(nextPath, bytes, owner, "2", hash);
    await store.removePrevious(owner, "2");
    expect(await store.get(path)).toBeNull();
    await expect(store.put(path, bytes, owner, "1", hash)).rejects.toMatchObject({ status: 409 });
    expect(await store.find(owner, "1")).toEqual({ owner, sequence: "1", hash });
    expect(await store.get(nextPath)).not.toBeNull();
    await store.removePrevious(owner, "2");
    await docker(["restart", name]);
    store = new S3ImageStore(await client(), bucket);
    expect(await store.get(path)).toBeNull();
    expect(await store.find(owner, "1")).toEqual({ owner, sequence: "1", hash });
    expect(await store.get(nextPath)).not.toBeNull();
    await clients.at(-1)!.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Body: bytes,
        ContentType: "image/jpeg",
        Metadata: { owner: "wrong", sequence, sha256: hash },
      }),
    );
    await expect(store.find(owner, sequence)).rejects.toThrow("Avatar integrity mismatch");
  } finally {
    for (const item of clients) {item.destroy();}
    if (created) {await docker(["rm", "--force", "--volumes", name]);}
  }
}, 120000);
