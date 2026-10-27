import { randomBytes } from "node:crypto";
import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { s3Client, S3ImageStore } from "@opencok/storage/images";
import sharp from "sharp";

export class DisposableAvatarStorage {
  readonly name = `opencok-avatar-${randomBytes(8).toString("hex")}`;
  readonly password = randomBytes(24).toString("hex");
  private created = false;
  private clients: ReturnType<typeof s3Client>[] = [];
  private async docker(args: string[]) {
    const child = Bun.spawn(["docker", ...args], {
      env: { ...process.env, MINIO_ROOT_PASSWORD: this.password },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [output, , status] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (status) {throw new Error("Disposable avatar storage failed");}
    return output.trim();
  }
  async start() {
    await this.docker([
      "run",
      "--detach",
      "--rm",
      "--name",
      this.name,
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
    this.created = true;
    const store = await this.connect();
    await this.clients.at(-1)!.send(new CreateBucketCommand({ Bucket: "synthetic-avatars" }));
    return store;
  }
  private async connect() {
    const port = (await this.docker(["port", this.name, "9000/tcp"])).split(":").at(-1);
    const endpoint = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 100; i++) {
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
    if (!ready) {throw new Error("Disposable avatar storage readiness timed out");}
    const client = s3Client({
      endpoint,
      region: "us-east-1",
      forcePathStyle: true,
      credentials: { accessKeyId: "synthetic", secretAccessKey: this.password },
    });
    this.clients.push(client);
    return new S3ImageStore(client, "synthetic-avatars");
  }
  async restart() {
    await this.docker(["restart", this.name]);
    return this.connect();
  }
  async close() {
    this.clients.forEach((c) => c.destroy());
    if (this.created) {await this.docker(["rm", "--force", "--volumes", this.name]);}
  }
  image() {
    return sharp({ create: { width: 4, height: 4, channels: 3, background: "blue" } })
      .png()
      .toBuffer();
  }
}
