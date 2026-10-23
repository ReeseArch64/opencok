import { randomBytes } from "node:crypto";
import { createConnection, type Connection } from "mysql2/promise";
import { legacyDriverOptions } from "../../src/client";

/** Owns exactly one disposable server; never accepts an external database URL. */
export class DisposableMariaDB {
  readonly name = `opencok-table-tests-${randomBytes(8).toString("hex")}`;
  readonly options = {
    host: "127.0.0.1", port: 0, user: "root", password: randomBytes(24).toString("hex"),
    charset: "utf8mb4", ...legacyDriverOptions,
  };
  private created = false;

  private async docker(args: string[]) {
    const child = Bun.spawn(["docker", ...args], {
      env: { ...process.env, MYSQL_ROOT_PASSWORD: this.options.password },
      stdin: "ignore", stdout: "pipe", stderr: "pipe",
    });
    const [output, , code] = await Promise.all([
      new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
    ]);
    if (code) throw new Error(`Disposable MariaDB ${args[0]} failed (exit ${code})`);
    return output.trim();
  }

  async start(): Promise<Connection> {
    await this.docker(["run", "--detach", "--rm", "--name", this.name,
      "--env", "MYSQL_ROOT_PASSWORD", "--publish", "127.0.0.1::3306",
      "mariadb:10.4.33", "--event-scheduler=OFF"]);
    this.created = true;
    return this.connect();
  }

  async connect(): Promise<Connection> {
    this.options.port = Number((await this.docker(["port", this.name, "3306/tcp"])).split(":").at(-1));
    for (let attempt = 0; attempt < 120; attempt++) {
      try { return await createConnection(this.options); }
      catch { await Bun.sleep(500); }
    }
    throw new Error("Disposable MariaDB readiness timed out");
  }

  async restart() {
    await this.docker(["restart", this.name]);
    // An ephemeral host port can change after restart.
    return this.connect();
  }

  async stop() {
    if (this.created) {
      await this.docker(["rm", "--force", "--volumes", this.name]);
      this.created = false;
    }
  }
}
