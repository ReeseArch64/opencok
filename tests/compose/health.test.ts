import { expect, test } from "bun:test";

interface Service {
  profiles: string[];
  depends_on?: Record<string, { condition: string }>;
  healthcheck?: { test: unknown[] };
  stop_grace_period?: string;
  logging?: { driver: string; options: Record<string, string> };
}

const base = Bun.YAML.parse(
  await Bun.file(new URL("../../docker-compose.yml", import.meta.url)).text(),
) as { services: Record<string, Service> };
const dev = Bun.YAML.parse(
  await Bun.file(new URL("../../docker-compose.dev.yml", import.meta.url)).text(),
) as { services: Record<string, Service> };

test("observability profile selects only Maple without application dependencies", () => {
  const services = Object.entries(base.services)
    .filter(([, service]) => service.profiles.includes("observability"))
    .map(([name]) => name);

  expect(services).toEqual(["maple"]);
  expect(base.services.maple!.depends_on ?? {}).toEqual({});
});

test("optional Maple and pgAdmin do not run periodic healthchecks", () => {
  expect(base.services.maple!.healthcheck).toBeUndefined();
  expect(base.services.pgadmin!.healthcheck).toBeUndefined();
});

test("every healthy dependency retains a readiness check in base and development", () => {
  for (const service of [...Object.values(base.services), ...Object.values(dev.services)]) {
    for (const [name, dependency] of Object.entries(service.depends_on ?? {})) {
      if (dependency.condition === "service_healthy") {
        expect(base.services[name]!.healthcheck?.test.length).toBeGreaterThan(0);
      }
    }
  }
});

test("application and ingress readiness checks remain available to operators", () => {
  for (const name of ["api", "server", "chat", "mongodb", "gateway"]) {
    expect(base.services[name]!.healthcheck?.test.length).toBeGreaterThan(0);
  }
});

test("Maple retains bounded Docker logs and time to drain its embedded store", () => {
  expect(base.services.maple!.stop_grace_period).toBe("45s");
  expect(base.services.maple!.logging).toEqual({
    driver: "json-file",
    options: { "max-size": "20m", "max-file": "5" },
  });
});
