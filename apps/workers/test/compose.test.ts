import { expect, test } from "bun:test";

const root = new URL("../../../", import.meta.url);
const compose = Bun.YAML.parse(await Bun.file(new URL("docker-compose.yml", root)).text()) as {
    services: Record<"mail-workers" | "server" | "chat", {
        profiles: string[];
        environment: Record<string, string | number>;
        networks: string[];
        ports?: string[];
    }>;
};

test.each(["all", "dev", "prod"])("compose_%s_includesMailWorkers", (profile) => {
    expect(compose.services["mail-workers"].profiles).toContain(profile);
});

test("compose_mailWorkers_usesRestrictedRolesAndPrivateChat", () => {
    expect(compose.services["mail-workers"].environment).toMatchObject({
        MAIL_WORKER_KINGDOM_URL: "${MAIL_WORKER_KINGDOM_URL}",
        MAIL_WORKER_GLOBAL_URL: "${MAIL_WORKER_GLOBAL_URL}",
        MAIL_WORKER_CHAT_SECRET: "${MAIL_WORKER_CHAT_SECRET}",
        CHAT_URL: "http://chat:8083",
        MAIL_INTEGRATION_MODE: "external",
        KINGDOM_ID: 1,
        KINGDOM_DATABASE_NAME: "opencok_kingdom_1",
        GLOBAL_DATABASE_NAME: "opencok_global",
    });
    expect(compose.services["mail-workers"].environment.DATABASE_URL).toBeUndefined();
    expect(compose.services["mail-workers"].environment.CHAT_MAILBOX_SECRETS).toBeUndefined();
    expect(compose.services["mail-workers"].ports).toBeUndefined();
    expect(compose.services["mail-workers"].networks).toContain("opencok-external-network");
});

test("compose_externalMail_disablesOwnerLoopsAndConfiguresChatKeys", () => {
    expect(compose.services.server.environment).toMatchObject({
        MAIL_INTEGRATION_MODE: "external",
        CHAT_MAILBOX_SECRET: "${MAIL_WORKER_CHAT_SECRET}",
        KINGDOM_ID: 1,
        KINGDOM_DATABASE_NAME: "opencok_kingdom_1",
    });
    expect(compose.services.chat.environment.CHAT_MAILBOX_SECRETS).toBe(
        "${CHAT_MAILBOX_SECRETS}",
    );
});

test("compose_mailOverlay_rebindsBothBackgroundProcesses", async () => {
    const overlay = Bun.YAML.parse(
        await Bun.file(new URL("infra/compose/mail-workers.yml", root)).text(),
    ) as {
        services: Record<"server" | "scheduler" | "mail-workers", {
            environment: Record<string, string>;
        }>;
    };
    const expected = {
        KINGDOM_ID: "${MAIL_WORKER_KINGDOM_ID:?Mail worker kingdom required}",
        KINGDOM_DATABASE_NAME:
            "${MAIL_WORKER_KINGDOM_DATABASE_NAME:?Mail worker kingdom database required}",
    };

    expect(overlay.services.server.environment).toMatchObject(expected);
    expect(overlay.services.scheduler.environment).toMatchObject(expected);
    expect(overlay.services["mail-workers"].environment).toMatchObject(expected);
});

test("compose_development_waitsForSetupAndChatReadiness", async () => {
    const development = Bun.YAML.parse(
        await Bun.file(new URL("docker-compose.dev.yml", root)).text(),
    ) as {
        services: Record<"mail-workers", { depends_on: Record<string, { condition: string; }>; }>;
    };

    expect(development.services["mail-workers"].depends_on).toMatchObject({
        "postgres-setup": { condition: "service_completed_successfully" },
        chat: { condition: "service_healthy" },
    });
});
