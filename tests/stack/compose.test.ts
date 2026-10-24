import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createServer } from "node:net";
import { randomBytes } from "node:crypto";
import { chmod, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "../../apps/server/integration/client";
import { fields, sfs, Type } from "@opencok/messages/sfs";

async function freePort() {
  const listener = createServer();
  await new Promise<void>((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const address = listener.address();
  if (!address || typeof address === "string") throw new Error("No disposable TCP port");
  await new Promise<void>((resolve) => listener.close(() => resolve()));
  return address.port;
}

async function eventually(check: () => Promise<boolean>, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check().catch(() => false)) return;
    await Bun.sleep(100);
  }
  throw new Error("Disposable stack readiness timed out");
}

async function createStack() {
  const root = new URL("../../", import.meta.url).pathname;
  const folder = await mkdtemp(join(tmpdir(), "opencok-stack-"));
  await chmod(folder, 0o755);
  const project = "opencok-stack-test-" + randomBytes(5).toString("hex");
  const httpPort = await freePort(),
    gamePort = await freePort(),
    databasePort = await freePort();
  const env = { ...process.env, COMPOSE_PROFILES: "", GAME_LOGIN_SECRET: "synthetic-secret" };
  const sourceConfig = Bun.spawn(
    [
      "docker",
      "compose",
      "--profile",
      "all",
      "-f",
      join(root, "docker-compose.yml"),
      "config",
      "--format",
      "json",
    ],
    { cwd: root, env, stdout: "pipe", stderr: "pipe" },
  );
  const [serialized, , configCode] = await Promise.all([
    new Response(sourceConfig.stdout).text(),
    new Response(sourceConfig.stderr).text(),
    sourceConfig.exited,
  ]);
  if (configCode) throw new Error("Base Compose configuration is invalid");
  const isolated = JSON.parse(serialized);
  isolated.name = project;
  for (const [name, service] of Object.entries(isolated.services) as [string, any][]) {
    service.container_name = project + "-" + name;
    expect(new Set(service.profiles)).toEqual(new Set(["all", "dev"]));
  }
  for (const [name, volume] of Object.entries(isolated.volumes) as [string, any][])
    volume.name = project + "_" + name;
  for (const [name, network] of Object.entries(isolated.networks) as [string, any][])
    network.name = project + "-" + name;
  for (const service of Object.values(isolated.services) as any[]) {
    for (const port of service.ports ?? []) {
      port.host_ip = "127.0.0.1";
      port.published = String(await freePort());
    }
  }
  const publishedPort = (service: string) => Number(isolated.services[service].ports[0].published);
  const pgadminPort = publishedPort("pgadmin");
  const insightPort = publishedPort("redisinsight");
  const portainerPort = publishedPort("portainer");

  isolated.services.portainer.volumes = isolated.services.portainer.volumes.filter(
    (volume: any) => volume.target !== "/var/run/docker.sock",
  );
  isolated.services.postgres.ports = [
    { target: 5432, published: String(databasePort), host_ip: "127.0.0.1", protocol: "tcp" },
  ];
  isolated.services.postgres.environment.POSTGRES_USER = "synthetic";
  isolated.services.postgres.environment.POSTGRES_PASSWORD = "synthetic-test-password";
  isolated.services["postgres-setup"].environment.POSTGRES_USER = "synthetic";
  isolated.services["postgres-setup"].environment.POSTGRES_PASSWORD = "synthetic-test-password";

  isolated.services.postgres.healthcheck.test = [
    "CMD",
    "pg_isready",
    "-U",
    "synthetic",
    "-d",
    "postgres",
  ];
  const databaseUrl = "postgres://synthetic:synthetic-test-password@postgres:5432/opencok_global";
  Object.assign(isolated.services.server.environment, {
    DATABASE_URL: databaseUrl,
    KINGDOM_ID: "2",
    KINGDOM_DATABASE_NAME: "opencok_kingdom_2",
    GAME_LOGIN_SECRET: "synthetic-secret",
    DEPENDENCY_TIMEOUT_MS: "1000",
  });
  isolated.services.server.volumes.find((v: any) => v.target === "/resources").source = folder;
  isolated.services.server.volumes.find(
    (v: any) => v.target === "/gameconfig/badwords.txt",
  ).source = join(folder, "badwords.txt");
  await Bun.write(join(folder, "badwords.txt"), "synthetic-filtered-word\n");
  Object.assign(isolated.services.api.environment, {
    DATABASE_URL: databaseUrl,
    KINGDOM_ID: "2",
    API_SERVERS_FILE: "",
    API_GAME_HOST: "127.0.0.1",
    API_GAME_PORT: String(gamePort),
    API_DEPENDENCY_TIMEOUT_MS: "500",
  });
  isolated.services.gateway.ports = [
    { target: 80, published: String(httpPort), host_ip: "127.0.0.1", protocol: "tcp" },
    { target: 9933, published: String(gamePort), host_ip: "127.0.0.1", protocol: "tcp" },
  ];
  isolated.services.minio.ports = [];
  Object.assign(isolated.services.pgadmin.environment, {
    PGADMIN_DEFAULT_EMAIL: "synthetic@example.com",
    PGADMIN_DEFAULT_PASSWORD: "synthetic-pgadmin-password",
  });
  isolated.services["minio-setup"].volumes.find((v: any) => v.target === "/source").source = join(
    folder,
    "cdn",
  );
  await Bun.write(join(folder, "compose.json"), JSON.stringify(isolated));
  const base = [
    "docker",
    "compose",
    "--project-name",
    project,
    "--project-directory",
    root,
    "-f",
    join(folder, "compose.json"),
    "--profile",
    "dev",
  ];
  async function compose(args: string[], input?: string) {
    const child = Bun.spawn([...base, ...args], {
      cwd: root,
      env,
      stdin: input ? new Blob([input]) : "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    const [output, errors, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code) {
      await Bun.write(join(folder, "compose-failure.log"), output + errors);
      throw new Error(
        `Disposable Compose ${args[0]} failed (${code}); diagnostic log: ${folder}/compose-failure.log`,
      );
    }
    return output;
  }
  await Bun.write(join(folder, "cdn/cok.eleximg.com/cok/test.bin"), "cdn-cok-synthetic");
  await Bun.write(join(folder, "cdn/asset.cok.chat/100001/test.bin"), "cdn-assets-synthetic");
  await Bun.write(join(folder, "cdn/cok-cdn.zip"), "synthetic-private-archive");
  const xml: Record<string, string> = {
    treasure: '<ItemSpec id="1" lv="1" exp="100" helper="1"/>',
    quest: "",
    building:
      '<ItemSpec id="400001" level="1" time="30"/><ItemSpec id="400002" level="2" time="40"/>',
    role: '<ItemSpec id="100101" player_exp="100000"/><ItemSpec id="100102" player_exp="200000"/>',
    position: '<ItemSpec id="9900" position="0"/><ItemSpec id="9906" position="6"/>',
    item: '<ItemSpec id="player_max" k3="30"/><ItemSpec id="resources_basics" k7="100" k8="300"/><ItemSpec id="on_trumpet" k2="0"/>',
  };
  for (const [name, records] of Object.entries(xml))
    await Bun.write(join(folder, name + ".xml"), `<database>${records}</database>`);
  let started = false;
  async function cleanup(passed: boolean) {
    try {
      if (started && !passed) {
        const logs = await compose(["logs", "--no-color", "--tail", "40"]).catch(
          () => "Unable to collect disposable service logs",
        );
        await Bun.write(join(folder, "service-failure.log"), logs);
      }
    } finally {
      if (started) await compose(["down", "--volumes", "--remove-orphans"]);
      if (passed) await rm(folder, { recursive: true, force: true });
    }
  }
  try {
    const config = JSON.parse(await compose(["config", "--format", "json"]));
    for (const excluded of ["chat", "media", "files", "gameservice", "gameserver"])
      expect(config.services).not.toHaveProperty(excluded);
    expect(config.services.api.environment).not.toHaveProperty("API_DB_HOST");
    expect(config.services.server.environment.DATABASE_URL).toContain(
      "@postgres:5432/opencok_global",
    );
    const allBase = [...base];
    allBase[allBase.length - 1] = "all";
    const allConfig = Bun.spawn([...allBase, "config", "--services"], {
      cwd: root,
      env,
      stdout: "pipe",
      stderr: "pipe",
    });
    const [allServices, allErrors, allCode] = await Promise.all([
      new Response(allConfig.stdout).text(),
      new Response(allConfig.stderr).text(),
      allConfig.exited,
    ]);
    if (allCode) throw new Error("All profile configuration failed: " + allErrors);
    expect(allServices.trim().split("\n").sort()).toEqual(Object.keys(config.services).sort());
    started = true;
    await compose(["up", "--build", "--detach", "--wait", "--wait-timeout", "120"]);
    return {
      compose,
      cleanup,
      gamePort,
      httpPort,
      pgadminPort,
      insightPort,
      portainerPort,
      folder,
      baseUrl: `http://127.0.0.1:${httpPort}`,
      services: Object.keys(config.services).sort(),
    };
  } catch (error) {
    await cleanup(false);
    throw error;
  }
}

type Stack = Awaited<ReturnType<typeof createStack>>;

async function checkService(stack: Stack, service: string) {
  const { compose } = stack;
  const rows = (await compose(["ps", "--all", "--format", "json", service]))
    .trim()
    .split("\n")
    .filter(Boolean)
    .flatMap((row) => {
      const parsed = JSON.parse(row);
      return Array.isArray(parsed) ? parsed : [parsed];
    });
  expect(rows).toHaveLength(1);
  const job = ["postgres-setup", "minio-setup"].includes(service);
  expect(rows[0].State).toBe(job ? "exited" : "running");
  expect(rows[0].ExitCode).toBe(0);

  const probe = async (container: string, script: string) =>
    compose(["exec", "-T", container, "bun", "--no-env-file", "-e", script]);
  const http = async (url: string, tls = false) =>
    fetch(url, {
      signal: AbortSignal.timeout(3000),
      ...(tls ? { tls: { rejectUnauthorized: false } } : {}),
    });
  const toolReady = async (url: string, tls = false) => {
    await eventually(async () => (await http(url, tls)).status === 200, 60000);
    return http(url, tls);
  };
  switch (service) {
    case "postgres": {
      const names = await compose([
        "exec",
        "-T",
        "postgres",
        "psql",
        "-U",
        "synthetic",
        "-d",
        "postgres",
        "-Atc",
        "SELECT datname FROM pg_database WHERE datname LIKE 'opencok_%' ORDER BY datname",
      ]);
      expect(names.trim().split("\n")).toEqual([
        "opencok_global",
        "opencok_kingdom_1",
        "opencok_kingdom_2",
      ]);
      break;
    }
    case "postgres-setup":
      expect(await compose(["logs", "--no-color", "postgres-setup"])).toContain(
        "Initialized global database and 2 kingdoms",
      );
      break;
    case "pgadmin": {
      const baseUrl = `http://127.0.0.1:${stack.pgadminPort}`;
      expect(await (await toolReady(baseUrl + "/misc/ping")).text()).toContain("PING");
      const login = await http(baseUrl + "/login");
      expect(login.status).toBe(200);
      const loginPage = await login.text();
      expect(loginPage.includes("csrfToken")).toBe(true);
      expect(loginPage.includes("login_user")).toBe(true);
      const registration = await compose([
        "exec",
        "-T",
        "pgadmin",
        "/venv/bin/python3",
        "-c",
        "import json; s=json.load(open('/configuration/servers.json')); assert s['Servers']['1']['Host']=='postgres'; assert s['Servers']['1']['Username']=='synthetic'; assert all('Password' not in v for v in s['Servers'].values()); print('registration-ok')",
      ]);
      expect(registration.trim()).toBe("registration-ok");
      break;
    }
    case "redis":
      expect((await compose(["exec", "-T", "redis", "redis-cli", "PING"])).trim()).toBe("PONG");
      expect(
        (
          await compose([
            "exec",
            "-T",
            "redis",
            "redis-cli",
            "SET",
            "synthetic:stack:ttl",
            "probe",
            "EX",
            "30",
          ])
        ).trim(),
      ).toBe("OK");
      expect(
        (await compose(["exec", "-T", "redis", "redis-cli", "GET", "synthetic:stack:ttl"])).trim(),
      ).toBe("probe");
      expect(
        Number(
          (
            await compose(["exec", "-T", "redis", "redis-cli", "TTL", "synthetic:stack:ttl"])
          ).trim(),
        ),
      ).toBeGreaterThan(0);
      await compose(["exec", "-T", "redis", "redis-cli", "DEL", "synthetic:stack:ttl"]);
      break;
    case "zookeeper":
      expect(
        await compose([
          "exec",
          "-T",
          "zookeeper",
          "bash",
          "-c",
          "printf srvr | nc -w 2 127.0.0.1 2181",
        ]),
      ).toContain("Mode: standalone");
      break;
    case "api":
    case "server": {
      const port = service === "api" ? 8080 : 18090;
      expect(
        await probe(
          service,
          `Promise.all(['/healthz','/readyz'].map(async path=>{const r=await fetch('http://127.0.0.1:${port}'+path);if(!r.ok)throw Error('service unavailable')})).catch(()=>process.exit(1))`,
        ),
      ).toBe("");
      break;
    }
    case "gateway":
      expect(
        await compose([
          "exec",
          "-T",
          "gateway",
          "traefik",
          "healthcheck",
          "--configFile=/etc/traefik/traefik.yml",
        ]),
      ).toContain("OK");
      expect((await http(stack.baseUrl + "/readyz")).status).toBe(200);
      break;
    case "minio":
      expect(
        await probe(
          "api",
          "Promise.all(['/minio/health/live','/minio/health/ready'].map(async path=>{const r=await fetch('http://minio:9000'+path);if(!r.ok)throw Error('storage unavailable')})).catch(()=>process.exit(1))",
        ),
      ).toBe("");
      break;
    case "minio-setup":
      expect(await compose(["logs", "--no-color", "minio-setup"])).toContain(
        "CDN host trees synchronized; uploads and source archives are not public",
      );
      expect(await (await http(stack.baseUrl + "/cok/test.bin")).text()).toBe("cdn-cok-synthetic");
      expect((await http(stack.baseUrl + "/cok-cdn.zip")).status).toBe(404);
      break;
    case "redisinsight": {
      const baseUrl = `http://127.0.0.1:${stack.insightPort}`;
      expect((await toolReady(baseUrl + "/api/health/")).status).toBe(200);
      expect((await http(baseUrl)).status).toBe(200);
      const databases = await http(baseUrl + "/api/databases");
      expect(databases.status).toBe(200);
      expect(await databases.json()).toEqual([]);
      break;
    }
    case "portainer": {
      const baseUrl = `https://127.0.0.1:${stack.portainerPort}`;
      const response = await toolReady(baseUrl + "/api/status", true);
      expect(((await response.json()) as { Version: string }).Version).toBeTruthy();
      expect((await http(baseUrl, true)).status).toBe(200);
      expect((await http(baseUrl + "/api/endpoints", true)).status).toBe(401);
      break;
    }
    default:
      throw new Error(`No functional probe defined for ${service}`);
  }
}

describe("isolated Compose stack", () => {
  let stack: Awaited<ReturnType<typeof createStack>>;
  let passed = true;
  const checked = (check: () => Promise<void>) => async () => {
    try {
      await check();
    } catch (error) {
      passed = false;
      throw error;
    }
  };
  beforeAll(async () => {
    stack = await createStack();
  }, 300000);
  afterAll(async () => {
    if (stack) await stack.cleanup(passed);
  }, 120000);

  const services = [
    "postgres",
    "postgres-setup",
    "pgadmin",
    "redis",
    "zookeeper",
    "server",
    "api",
    "gateway",
    "minio",
    "minio-setup",
    "redisinsight",
    "portainer",
  ];

  test(
    "both profiles cover every declared container",
    checked(async () => {
      expect(stack.services).toEqual([...services].sort());
    }),
  );

  for (const service of services) {
    test(
      `${service}: container lifecycle and service behavior`,
      checked(async () => {
        await checkService(stack, service);
      }),
      90000,
    );
  }

  test(
    "discovery, SFS, CDN and failure recovery preserve player state",
    checked(async () => {
      const { compose, baseUrl, gamePort } = stack;
      const clients: Client[] = [];
      try {
        const sql = (database: string, query: string) =>
          compose(
            [
              "exec",
              "-T",
              "postgres",
              "psql",
              "-U",
              "synthetic",
              "-d",
              database,
              "-v",
              "ON_ERROR_STOP=1",
              "-At",
            ],
            query,
          );
        await sql(
          "opencok_global",
          `
      INSERT INTO opencok_global.account_new ("gameUid",server,uuid,"gameUserLevel","lastTime",active) VALUES
        ('synthetic-player','2','synthetic-device',1,9007199254740993,0),
        ('synthetic-disabled','2','synthetic-disabled-device',1,0,3),
        ('synthetic-older','2','synthetic-shared-device',1,9007199254740992,0),
        ('synthetic-newer','2','synthetic-shared-device',1,9007199254740993,NULL);
      INSERT INTO opencok_global.usermapping ("gameUid","mappingType","mappingValue") VALUES
        ('synthetic-player','device','synthetic-device'),('synthetic-disabled','device','synthetic-disabled-device'),
        ('synthetic-older','device','synthetic-shared-device'),('synthetic-newer','device','synthetic-shared-device');
    `,
        );
        await sql(
          "opencok_kingdom_2",
          `
      INSERT INTO opencok_kingdom.userprofile (uid,name,level,exp,country,"deviceUuid",pf,gold,"serverId") VALUES ('synthetic-player','Synthetic',1,0,'BR','synthetic-device','csmod_games',9007199254740993,2);
      INSERT INTO opencok_kingdom.user_resource (uid,wood,stone,iron,food,silver,chip,diamond,dragon_food,dragon_gold,"lastUpdateTime") VALUES ('synthetic-player',10000,0,0,0,0,0,0,0,0,0);
      INSERT INTO opencok_kingdom.user_building (uuid,uid,"itemId",pos,level) VALUES ('synthetic-building','synthetic-player',400000,0,1);
      INSERT INTO opencok_kingdom.queue (uuid,"ownerId",qid,type,"startTime","endTime","updateTime") VALUES ('synthetic-queue','synthetic-player',1,0,9223372036854775807,9223372036854775807,9223372036854775807);
      INSERT INTO opencok_kingdom.user_world (uid,"pointId","worldId","lastCityDefTime") VALUES ('synthetic-player',12011,0,0);
      INSERT INTO opencok_kingdom.worldpoint (id,"worldId",x,y,"areaId","gridType","grid2Type","pointType","resLevel","resInitValue") VALUES (12011,0,10,10,0,0,0,1,1,0);
    `,
        );

        expect((await fetch(baseUrl + "/readyz")).status).toBe(200);
        const asset = await fetch(baseUrl + "/cok/test.bin");
        expect(asset.status).toBe(200);
        const etag = asset.headers.get("etag");
        expect(await asset.text()).toBe("cdn-cok-synthetic");
        expect(await (await fetch(baseUrl + "/100001/test.bin")).text()).toBe(
          "cdn-assets-synthetic",
        );
        const ranged = await fetch(baseUrl + "/cok/test.bin", { headers: { Range: "bytes=0-2" } });
        expect(ranged.status).toBe(206);
        expect(await ranged.text()).toBe("cdn");
        expect(
          (await fetch(baseUrl + "/cok/test.bin", { headers: { "If-None-Match": etag! } })).status,
        ).toBe(304);
        expect((await fetch(baseUrl + "/cok-cdn.zip")).status).toBe(404);
        const privateChecks = await compose([
          "exec",
          "-T",
          "api",
          "bun",
          "--no-env-file",
          "-e",
          "Promise.all(['/opencok-cdn/','/opencok-cdn/cok-cdn.zip','/opencok-uploads/private'].map(async p=>{const r=await fetch('http://minio:9000'+p);if(r.status!==403)throw Error('unexpected public storage route')})).catch(()=>process.exit(1))",
        ]);
        expect(privateChecks).toBe("");

        expect(await (await fetch(baseUrl + "/_health.php")).text()).toBe("ok\n");
        for (const path of ["getserverlist.php", "getline.php", "getserverlist_memoryold.php"]) {
          for (const method of ["GET", "POST", "HEAD"]) {
            const parameters = "loginFlag=1&uuid=synthetic-device";
            const response = await fetch(`${baseUrl}/gameservice/${path}?${parameters}`, {
              method,
              ...(method === "POST"
                ? {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: parameters,
                  }
                : {}),
            });
            expect(response.status).toBe(200);
            expect(response.headers.get("X-Request-ID")).toBeTruthy();
            if (method === "HEAD") expect(await response.text()).toBe("");
            else {
              const result = (await response.json()) as any;
              expect(result.serverList[0]).toMatchObject({
                gameUid: "synthetic-player",
                ip: "127.0.0.1",
                port: String(gamePort),
                zone: "COK2",
              });
            }
          }
        }
        const exact = (await (
          await fetch(baseUrl + "/gameservice/getline.php?loginFlag=1&uuid=synthetic-shared-device")
        ).json()) as any;
        expect(exact.serverList[0].gameUid).toBe("synthetic-newer");
        const excludedFiles = await compose([
          "exec",
          "-T",
          "server",
          "bun",
          "--no-env-file",
          "-e",
          "const fs=require('node:fs');const forbidden=['/workspace/.env','/workspace/data','/workspace/.git','/workspace/apps/api/.env','/workspace/apps/server/runtime'];process.exit(forbidden.some(p=>fs.existsSync(p))?1:0)",
        ]);
        expect(excludedFiles).toBe("");
        const inactive = (await (
          await fetch(
            baseUrl + "/gameservice/getline.php?loginFlag=1&uuid=synthetic-disabled-device",
          )
        ).json()) as any;
        expect(inactive.serverList[0]).not.toHaveProperty("gameUid");
        expect(
          (
            await sql(
              "opencok_global",
              "SELECT active FROM opencok_global.account_new WHERE \"gameUid\"='synthetic-disabled';",
            )
          ).trim(),
        ).toBe("3");
        expect((await compose(["exec", "-T", "redis", "redis-cli", "DBSIZE"])).trim()).toBe("0");
        for (const path of [
          "/chat/ws",
          "/api/v1global_config",
          "/gameservice/www/gateway/json.php",
          "/cok/img/1/image.jpg",
          "/cok/.hidden",
          "/cok/test.php",
          "/gameservice/Engine.php",
        ])
          expect((await fetch(baseUrl + path)).status).toBe(404);
        expect(
          (
            await fetch(baseUrl + "/gameservice/getline.php", {
              method: "POST",
              body: "x".repeat(65537),
            })
          ).status,
        ).toBe(413);
        const client = new Client(gamePort, 2);
        clients.push(client);
        expect((await client.handshake()).tk?.type).toBe(Type.String);
        expect((await client.login("synthetic-secret")).zn?.value).toBe("COK2");
        const init = fields((await client.next()).p);
        expect(fields(fields(init.p).user).gold?.value).toBe(9007199254740993n);
        expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
        expect(fields((await client.command("build.info")).resource).wood?.value).toBe(10000n);
        expect(
          (await client.command("build.upgrade", { uuid: sfs.string("synthetic-building") }))
            .errorCode?.value,
        ).toBe("102192");
        client.close();
        await compose(["pause", "redis"]);
        await eventually(async () => (await fetch(baseUrl + "/readyz")).status === 503);
        await compose(["unpause", "redis"]);
        await eventually(async () => (await fetch(baseUrl + "/readyz")).status === 200);
        expect(
          (
            await sql(
              "opencok_kingdom_2",
              "SELECT wood FROM opencok_kingdom.user_resource WHERE uid='synthetic-player';",
            )
          ).trim(),
        ).toBe("10000");
        expect(
          (
            await sql(
              "opencok_global",
              "SELECT active FROM opencok_global.account_new WHERE \"gameUid\"='synthetic-disabled';",
            )
          ).trim(),
        ).toBe("3");
      } finally {
        clients.forEach((client) => client.close());
      }
    }),
    120000,
  );
});
