import { describe, expect, test } from "bun:test";
import { createPingHandler, HEALTH_URL, probeHttp } from "../src/ping";

describe("existing HTTP health contract", () => {
  test("checks the fixed health route with a bounded, uncached GET", async () => {
    const request = (async (url, init) => {
      expect(url).toBe(HEALTH_URL);
      expect(init?.method).toBe("GET");
      expect(init?.cache).toBe("no-store");
      expect(init?.redirect).toBe("error");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response("ok\n");
    }) as typeof fetch;
    const result = await probeHttp(request);
    expect(result.online).toBe(true);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.target).toBe("http-gateway");
  });

  test("does not mistake an error page or unrelated 200 for a healthy gateway", async () => {
    for (const response of [
      new Response("ok\n", { status: 503 }),
      new Response("<html>Login</html>"),
    ]) {
      const request = (async () => response) as unknown as typeof fetch;
      const result = await probeHttp(request);
      expect(result.online).toBe(false);
      expect(result.latencyMs).toBeNull();
    }
  });

  test("returns offline for refused connections and timeouts", async () => {
    for (const error of [
      new TypeError("Connection refused"),
      new DOMException("Timeout", "TimeoutError"),
    ]) {
      const request = (async () => {
        throw error;
      }) as unknown as typeof fetch;
      expect((await probeHttp(request)).online).toBe(false);
    }
  });

  test("coalesces concurrent requests and disables response caching", async () => {
    let probes = 0;
    const handler = createPingHandler(async () => {
      probes++;
      await Bun.sleep(5);
      return {
        online: true,
        latencyMs: 2,
        checkedAt: new Date().toISOString(),
        target: "http-gateway",
      };
    });
    const responses = await Promise.all([handler(), handler(), handler()]);
    expect(probes).toBe(1);
    for (const response of responses) {
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect((await response.json()).online).toBe(true);
    }
  });
});
