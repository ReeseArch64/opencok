import { randomBytes } from "node:crypto";
import { Cache } from "@opencok/storage/session";

export class DisposableRedis {
  readonly name = `opencok-ranking-redis-${randomBytes(8).toString("hex")}`;
  private created = false;
  async docker(args: string[]): Promise<string> {
    const child = Bun.spawn(["docker", ...args], { stdout: "pipe", stderr: "pipe" });
    const [output, , code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code) throw new Error(`Disposable Redis ${args[0]} failed (exit ${code})`);
    return output.trim();
  }
  async start(): Promise<string> {
    await this.docker([
      "run",
      "--detach",
      "--rm",
      "--name",
      this.name,
      "--publish",
      "127.0.0.1::6379",
      "redis:8.2.11-bookworm",
    ]);
    this.created = true;
    const port = Number((await this.docker(["port", this.name, "6379/tcp"])).split(":").at(-1));
    const url = `redis://127.0.0.1:${port}`;
    const cache = new Cache({ redisUrl: url, timeoutMs: 500, kingdomId: 1 });
    for (let attempt = 0; attempt < 50; attempt++) {
      try {
        if ((await cache.command("PING")) === "PONG") return url;
      } catch {}
      await Bun.sleep(100);
    }
    throw new Error("Disposable Redis readiness timed out");
  }
  async stop(): Promise<void> {
    if (this.created) {
      await this.docker(["rm", "--force", "--volumes", this.name]);
      this.created = false;
    }
  }
}
