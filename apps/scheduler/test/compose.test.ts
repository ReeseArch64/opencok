import { expect, test } from "bun:test";

const root = new URL("../../../", import.meta.url);
const compose = Bun.YAML.parse(await Bun.file(new URL("docker-compose.yml", root)).text()) as {
    services: Record<"scheduler" | "server", {
        profiles: string[];
        environment: Record<string, string | number>;
        networks: string[];
        ports?: string[];
    }>;
};

test.each(["all", "dev", "prod"])("compose_%s_includesScheduler", (profile) => {
    expect(compose.services.scheduler.profiles).toContain(profile);
});

test("compose_scheduler_usesRestrictedDatabaseAndSignedOwnerDispatch", () => {
    expect(compose.services.scheduler.environment).toMatchObject({
        SCHEDULER_DATABASE_URL: "${SCHEDULER_DATABASE_URL}",
        SCHEDULER_OWNER_URL: "http://server:18090",
        ACTIVITY_SCHEDULER_MODE: "external",
        ACTIVITY_SCHEDULER_SECRET: "${ACTIVITY_SCHEDULER_SECRET}",
        KINGDOM_ID: 1,
        KINGDOM_DATABASE_NAME: "opencok_kingdom_1",
    });
    expect(compose.services.scheduler.environment.DATABASE_URL).toBeUndefined();
    expect(compose.services.scheduler.ports).toBeUndefined();
    expect(compose.services.scheduler.networks).toContain("opencok-external-network");
});

test("compose_externalScheduler_disablesOwnerBackgroundLoop", () => {
    expect(compose.services.server.environment).toMatchObject({
        ACTIVITY_SCHEDULER_MODE: "external",
        ACTIVITY_SCHEDULER_SECRET: "${ACTIVITY_SCHEDULER_SECRET}",
        KINGDOM_ID: 1,
        KINGDOM_DATABASE_NAME: "opencok_kingdom_1",
    });
});

test("compose_schedulerOverlay_rebindsBothBackgroundProcesses", async () => {
    const overlay = Bun.YAML.parse(
        await Bun.file(new URL("infra/compose/activity-scheduler.yml", root)).text(),
    ) as {
        services: Record<"server" | "scheduler" | "mail-workers", {
            environment: Record<string, string>;
        }>;
    };
    const expected = {
        KINGDOM_ID: "${SCHEDULER_KINGDOM_ID:?Scheduler kingdom required}",
        KINGDOM_DATABASE_NAME:
            "${SCHEDULER_KINGDOM_DATABASE_NAME:?Scheduler kingdom database required}",
    };

    expect(overlay.services.server.environment).toMatchObject(expected);
    expect(overlay.services.scheduler.environment).toMatchObject(expected);
    expect(overlay.services["mail-workers"].environment).toMatchObject(expected);
});

test("compose_development_waitsForSetupAndOwnerReadiness", async () => {
    const development = Bun.YAML.parse(
        await Bun.file(new URL("docker-compose.dev.yml", root)).text(),
    ) as {
        services: Record<"scheduler", { depends_on: Record<string, { condition: string; }>; }>;
    };

    expect(development.services.scheduler.depends_on).toMatchObject({
        "postgres-setup": { condition: "service_completed_successfully" },
        server: { condition: "service_healthy" },
    });
});
