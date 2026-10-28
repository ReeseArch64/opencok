import { expect, test } from "bun:test";

const root = new URL("../../../", import.meta.url);
const compose = Bun.YAML.parse(await Bun.file(new URL("docker-compose.yml", root)).text()) as {
    services: Record<"web", {
        profiles: string[];
        build: { context: string; dockerfile: string; };
        ports: string[];
        volumes: unknown[];
        environment: Record<string, string>;
    }>;
};

test.each(["all", "dev", "prod"])("compose_%s_includesWeb", (profile) => {
    expect(compose.services.web.profiles).toContain(profile);
});

test("compose_web_servesOnHostPortWithReadOnlyPreparedAssets", () => {
    expect(compose.services.web.build).toEqual({
        context: ".",
        dockerfile: "apps/web/Dockerfile",
    });
    expect(compose.services.web.ports).toEqual(["5173:5173"]);
    expect(compose.services.web.volumes).toEqual([{
        type: "bind",
        source: "./apps/web/assets",
        target: "/workspace/apps/web/assets",
        read_only: true,
        bind: { create_host_path: false },
    }]);
    expect(compose.services.web.environment).toEqual({ NODE_ENV: "${NODE_ENV:-production}" });
});
