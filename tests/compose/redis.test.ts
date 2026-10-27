import { expect, test } from "bun:test";

interface ComposeService {
  image?: string;
  profiles?: string[];
  depends_on?: Record<string, { condition: string }>;
  environment?: Record<string, string>;
  networks?: string[];
  ports?: unknown[];
}

interface ComposeModel {
  services: Record<string, ComposeService>;
}

const base = Bun.YAML.parse(
  await Bun.file(new URL("../../docker-compose.yml", import.meta.url)).text(),
) as ComposeModel;
const dev = Bun.YAML.parse(
  await Bun.file(new URL("../../docker-compose.dev.yml", import.meta.url)).text(),
) as ComposeModel;

test.each(["api", "server"])("base %s uses shared external-capable Redis configuration", (name) => {
  const service = base.services[name]!;

  expect(service.depends_on).not.toHaveProperty("redis");
  expect(service.depends_on).not.toHaveProperty("redisinsight");
  expect(service.environment!.REDIS_URL).toBe("${REDIS_URL:?Set REDIS_URL for API and server}");
  expect(service.networks).toContain("opencok-external-network");
});

test.each(["api", "server"])("development override adds Redis readiness for %s", (name) => {
  expect(dev.services[name]!.depends_on!.redis).toEqual({ condition: "service_healthy" });
  expect(dev.services[name]!.environment).toBeUndefined();
});

test("redis profile selects Redis and Redis Insight", () => {
  const selected = Object.entries(base.services)
    .filter(([, service]) => service.profiles?.includes("redis"))
    .map(([name]) => name);

  expect(selected).toEqual(["redis", "redisinsight"]);
  expect(base.services.redis!.depends_on ?? {}).toEqual({});
  expect(base.services.redis!.ports ?? []).toEqual([]);
  expect(base.services.redis!.image).toBe("redis:6.2.24-bookworm");
});

test("all selects the full stack while dev excludes administration tools", () => {
  const services = Object.keys(base.services).sort();
  const all = Object.entries(base.services)
    .filter(([, service]) => service.profiles?.includes("all"))
    .map(([name]) => name)
    .sort();
  const development = Object.entries(base.services)
    .filter(([, service]) => service.profiles?.includes("dev"))
    .map(([name]) => name)
    .sort();

  expect(all).toEqual(services);
  expect(development).toEqual(
    services.filter((name) => !["pgadmin", "redisinsight", "portainer"].includes(name)),
  );
  expect(base.services.redisinsight!.profiles).toEqual(["all", "devops", "redis"]);
  expect(base.services.redisinsight!.depends_on!.redis).toEqual({ condition: "service_healthy" });
});

test.each([
  ["devops", ["pgadmin", "portainer", "postgres", "postgres-setup", "redis", "redisinsight"]],
  ["database", ["pgadmin", "postgres", "postgres-setup"]],
])("%s selects administration services with their dependencies", (profile, expected) => {
  const selected = Object.entries(base.services)
    .filter(([, service]) => service.profiles?.includes(profile))
    .map(([name]) => name)
    .sort();

  expect(selected).toEqual(expected);
  for (const name of selected) {
    for (const dependency of Object.keys(base.services[name]!.depends_on ?? {})) {
      expect(selected).toContain(dependency);
    }
  }
});

test("only actual Redis consumers receive REDIS_URL", () => {
  const consumers = Object.entries(base.services)
    .filter(([, service]) => Object.hasOwn(service.environment ?? {}, "REDIS_URL"))
    .map(([name]) => name)
    .sort();

  expect(consumers).toEqual(["api", "server"]);
});
