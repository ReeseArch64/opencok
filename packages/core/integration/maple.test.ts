import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { initializeLogging, initializeTelemetry, logEvent, logHttpRequest } from "../src/logging";
import { observeOperation } from "../src/operation";

test("the pinned Maple container stores application signals and gateway access logs and metrics", async () => {
  const root = new URL("../../../", import.meta.url).pathname;
  const folder = await mkdtemp(join(tmpdir(), "opencok-maple-"));
  const project = `opencok-maple-${randomUUID().slice(0, 8)}`;
  const file = join(folder, "compose.json");
  const ingestKey = randomUUID();
  const accessToken = randomUUID();
  async function command(args: string[]) {
    const child = Bun.spawn(args, { cwd: root, stdout: "pipe", stderr: "pipe" });
    const [output, , code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code) throw new Error("Disposable Maple command failed");
    return output;
  }
  const compose = (args: string[]) =>
    command(["docker", "compose", "-p", project, "-f", file, ...args]);
  try {
    const source = JSON.parse(
      await command(["docker", "compose", "--profile", "dev", "config", "--format", "json"]),
    );
    const maple = source.services.maple;
    delete maple.profiles;
    maple.networks = ["telemetry"];
    maple.ports = [{ target: 4318, published: "0", host_ip: "127.0.0.1", protocol: "tcp" }];
    maple.volumes = [{ type: "volume", source: "telemetry", target: "/data" }];
    maple.environment.MAPLE_LOCAL_INGEST_KEY = ingestKey;
    maple.environment.MAPLE_LOCAL_ACCESS_TOKEN = accessToken;
    const gateway = source.services.gateway;
    delete gateway.profiles;
    delete gateway.depends_on;
    delete gateway.container_name;
    gateway.networks = ["telemetry"];
    gateway.extra_hosts = ["api:127.0.0.1"];
    gateway.ports = [{ target: 80, published: "0", host_ip: "127.0.0.1", protocol: "tcp" }];
    gateway.environment.CDN_URL = "http://unused:9000";
    gateway.command = gateway.command.map((argument: string) =>
      argument.includes(".headers.Authorization=")
        ? `${argument.split("=", 1)[0]}=Bearer ${ingestKey}`
        : argument,
    );
    await writeFile(
      file,
      JSON.stringify({
        services: { maple, gateway },
        networks: { telemetry: {} },
        volumes: { telemetry: {} },
      }),
      { mode: 0o600 },
    );
    await compose(["up", "--build", "-d", "--wait", "--wait-timeout", "120"]);
    const endpoint = `http://${(await compose(["port", "maple", "4318"])).trim()}`;
    const readyDeadline = Date.now() + 120000;
    let ready = false;
    while (Date.now() < readyDeadline) {
      ready = await fetch(`${endpoint}/health`, { signal: AbortSignal.timeout(2000) })
        .then((response) => response.ok)
        .catch(() => false);
      if (ready) break;
      await Bun.sleep(100);
    }
    expect(ready).toBe(true);
    const loginPage = await fetch(`${endpoint}/login`);
    expect(loginPage.headers.get("content-security-policy")).not.toContain("wasm-unsafe-eval");
    const login = await fetch(`${endpoint}/local/auth/login`, {
      method: "POST",
      headers: { origin: endpoint },
      body: new URLSearchParams({ token: accessToken }),
      redirect: "manual",
    });
    expect(login.status).toBe(303);
    const cookie = login.headers.get("set-cookie")!.split(";")[0]!;
    for (const path of ["/", "/services", "/assets/missing.js"]) {
      const dashboard = await fetch(`${endpoint}${path}`, { headers: { cookie } });
      expect(dashboard.headers.get("content-security-policy")).toContain(
        "script-src 'self' 'wasm-unsafe-eval'",
      );
      expect(dashboard.headers.get("content-security-policy")).not.toContain("'unsafe-eval'");
    }
    expect((await fetch(`${endpoint}/local/query`, { method: "POST", body: "{}" })).status).toBe(
      401,
    );
    for (const service of ["server", "api", "chat"]) {
      initializeLogging(service);
      const active = initializeTelemetry(service, { endpoint, ingestKey })!;
      try {
        await logHttpRequest(new Request("http://localhost/readyz"), async () => {
          await observeOperation("validation.processing", async () => {
            logEvent("artifact_generated", {
              count: 2,
              authorization: "Bearer private-synthetic-token",
            });
          });
          await expect(
            observeOperation("validation.failure", async () => {
              throw new Error("private-synthetic-password");
            }),
          ).rejects.toThrow();
          return new Response("ok");
        });
        await active.flush();
      } finally {
        await active.close();
      }
    }
    const query = async (sql: string) =>
      JSON.parse(await compose(["exec", "-T", "maple", "maple", "query", sql, "--local"]));
    for (const table of ["logs", "traces", "error_events", "metrics_histogram"]) {
      const rows = await query(
        `SELECT ServiceName, count() AS count FROM ${table} WHERE ServiceName IN ('server', 'api', 'chat') GROUP BY ServiceName ORDER BY ServiceName`,
      );
      expect(rows.map((row: { ServiceName: string }) => row.ServiceName)).toEqual([
        "api",
        "chat",
        "server",
      ]);
      expect(rows.every((row: { count: number }) => Number(row.count) > 0)).toBe(true);
    }
    const gatewayEndpoint = `http://${(await compose(["port", "gateway", "80"])).trim()}`;
    const response = await fetch(`${gatewayEndpoint}/private-synthetic-path?token=private-token`, {
      headers: { authorization: "Bearer private-synthetic-token" },
    });
    expect(response.status).toBe(404);
    const discovery = await fetch(`${gatewayEndpoint}/gameservice/getserverlist.php`);
    expect(discovery.status).toBe(502);
    const gatewayDeadline = Date.now() + 30000;
    let gatewayReady = false;
    while (Date.now() < gatewayDeadline) {
      const logs = await query("SELECT count() AS count FROM logs WHERE ServiceName = 'gateway'");
      const metrics = await query(
        "SELECT count() AS count FROM metrics_histogram WHERE ServiceName = 'gateway'",
      );
      gatewayReady = Number(logs[0].count) > 0 && Number(metrics[0].count) > 0;
      if (gatewayReady) break;
      await Bun.sleep(250);
    }
    expect(gatewayReady).toBe(true);
    const correlation = await query(
      "SELECT count() AS count FROM logs INNER JOIN traces USING (TraceId, SpanId) WHERE logs.ServiceName = 'server'",
    );
    expect(Number(correlation[0].count)).toBeGreaterThan(0);
    const logs = await query("SELECT Body, LogAttributes FROM logs");
    expect(JSON.stringify(logs)).not.toContain("private-");
    await compose(["restart", "maple"]);
    let retained = false;
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      try {
        retained = Number((await query("SELECT count() AS count FROM traces"))[0].count) > 0;
        if (retained) break;
      } catch {}
      await Bun.sleep(500);
    }
    expect(retained).toBe(true);
  } finally {
    await compose(["down", "--volumes", "--remove-orphans"]).catch(() => {});
    await rm(folder, { recursive: true, force: true });
  }
}, 240000);
