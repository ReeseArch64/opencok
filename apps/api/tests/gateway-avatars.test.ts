import { expect, test } from "bun:test";
import { gatewayYaml } from "./support/gateway";

const config = Bun.YAML.parse(
    await gatewayYaml(),
) as {
    http: {
        routers: Record<string, { rule: string; service: string; }>;
        services: Record<
            string,
            { loadBalancer: { passHostHeader: boolean; servers: { url: string; }[]; }; }
        >;
    };
};

const route = config.http.routers["avatar-storage"]!;
const pattern = new RegExp(/PathRegexp\(`([^`]+)`\)/.exec(route.rule)![1]!);

test("gateway omits optional avatar storage when its origin is absent", async () => {
    const disabled = Bun.YAML.parse(await gatewayYaml(false)) as typeof config;
    expect(disabled.http.routers["avatar-storage"]).toBeUndefined();
    expect(disabled.http.services["avatar-storage"]).toBeUndefined();
    expect(disabled.http.routers.health!.service).toBe("api");
});

test("gateway forwards private avatar object reads with the signed host intact", () => {
    expect(pattern.test(`/opencok-uploads/123456/${"a".repeat(32)}.jpg`)).toBe(true);
    expect(route.rule).toContain("(Method(`GET`) || Method(`HEAD`))");
    expect(route.service).toBe("avatar-storage");
    expect(config.http.services[route.service]!.loadBalancer.passHostHeader).toBe(true);
    expect(config.http.services[route.service]!.loadBalancer.servers).toEqual([
        { url: "{{ env \"S3_ENDPOINT\" }}" },
    ]);
});

test.each([
    "/opencok-uploads/",
    "/opencok-uploads/private",
    `/opencok-uploads/123456/${"a".repeat(32)}Xjpg`,
    `/opencok-uploads/1234567/${"a".repeat(32)}.jpg`,
    `/opencok-uploads/1/${"a".repeat(32)}.jpg/extra`,
    `/opencok-cdn/1/${"a".repeat(32)}.jpg`,
    "/_internal/avatars/123456/1",
])("gateway avatar route rejects unrelated path %s", (path) => {
    expect(pattern.test(path)).toBe(false);
});
