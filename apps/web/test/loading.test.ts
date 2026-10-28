import { expect, test } from "bun:test";
import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";
import { GatewayPingClient } from "../src/gateway-ping-client.ts";
import { LoadingApplication } from "../src/loading-application.ts";
import type { LoadingScreen } from "../src/loading-screen.ts";

const online: GatewayPingResponse = {
    online: true,
    latencyMs: 2,
    checkedAt: "2026-10-27T18:00:00.000Z",
    target: "http-gateway",
};

test("the loading client validates health metadata and uses an uncached bounded request", async () => {
    const client = new GatewayPingClient(async (path, options) => {
        expect(path).toBe("/api/ping");
        expect(options?.cache).toBe("no-store");
        expect(options?.signal).toBeInstanceOf(AbortSignal);
        return Response.json(online);
    });

    expect(await client.probe()).toEqual(online);

    for (
        const payload of [
            { ...online, target: "unknown" },
            { ...online, latencyMs: -1 },
            { ...online, latencyMs: null },
            { ...online, online: false },
        ]
    )
    {
        const invalid = new GatewayPingClient(async () => Response.json(payload));
        await expect(invalid.probe()).rejects.toThrow();
    }
});

test("loading coalesces retries during a request and finishes without scheduling hidden checks", async () => {
    const pending = Promise.withResolvers<GatewayPingResponse>();
    const events: string[] = [];
    let retry = () => {};
    let probes = 0;
    const screen: LoadingScreen = {
        isHidden: () => true,
        onRetry: (run) => {
            retry = run;
        },
        onVisibilityChange: () => {},
        checking: () => {
            events.push("checking");
        },
        online: () => {
            events.push("online");
        },
        offline: () => {
            events.push("offline");
        },
        completeCheck: () => {
            events.push("complete");
        },
        loadAssets: async () => true,
    };
    const application = new LoadingApplication(
        screen,
        {
            probe: () => {
                probes++;
                return pending.promise;
            },
        },
        [],
    );

    const started = application.start();
    await Promise.resolve();
    retry();
    expect(probes).toBe(1);
    expect(events).toEqual(["checking"]);

    pending.resolve(online);
    await started;
    expect(events).toEqual(["checking", "online", "complete"]);
});

test("a visual resource failure prevents starting health polling", async () => {
    let probes = 0;
    const application = new LoadingApplication(
        {
            isHidden: () => true,
            onRetry: () => {},
            onVisibilityChange: () => {},
            checking: () => {},
            online: () => {},
            offline: () => {},
            completeCheck: () => {},
            loadAssets: async () => false,
        },
        {
            probe: async () => {
                probes++;
                return online;
            },
        },
        [],
    );

    await application.start();
    expect(probes).toBe(0);
});
