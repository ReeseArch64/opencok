import { expect, test } from "bun:test";

interface ComposeService {
  depends_on?: Record<string, { condition: string }>;
  environment?: Record<string, string>;
  networks?: string[];
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

test.each(["api", "server", "chat"])(
  "base %s accepts shared PostgreSQL configuration without local startup dependencies",
  (name) => {
    const service = base.services[name]!;

    expect(service.environment!.DATABASE_URL).toBe(
      "${DATABASE_URL:?Set DATABASE_URL for API, server and Chat}",
    );
    expect(service.depends_on).not.toHaveProperty("postgres");
    expect(service.depends_on).not.toHaveProperty("postgres-setup");
    expect(service.networks).toContain("opencok-external-network");
  },
);

test.each(["api", "server", "chat", "pgadmin"])(
  "development %s waits for local PostgreSQL setup",
  (name) => {
    expect(base.services[name]!.depends_on).not.toHaveProperty("postgres-setup");
    expect(dev.services[name]!.depends_on!["postgres-setup"]).toEqual({
      condition: "service_completed_successfully",
    });
    expect(dev.services[name]!.environment).toBeUndefined();
  },
);

test("local PostgreSQL setup waits for PostgreSQL readiness", () => {
  expect(base.services["postgres-setup"]!.depends_on!.postgres).toEqual({
    condition: "service_healthy",
  });
});
