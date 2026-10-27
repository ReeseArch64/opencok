export const HEALTH_URL = "http://192.168.1.104/_health.php";

const TIMEOUT_MS = 3_000;

export interface PingResult {
  online: boolean;
  latencyMs: number | null;
  checkedAt: string;
  target: "http-gateway";
}

export async function probeHttp(
  request: typeof fetch = fetch,
  url = HEALTH_URL,
): Promise<PingResult> {
  const started = performance.now();
  let online = false;

  try {
    const response = await request(url, {
      method: "GET",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "error",
      cache: "no-store",
    });
    online = response.ok && (await response.text()).trim() === "ok";
  } catch {
    online = false;
  }

  return {
    online,
    latencyMs: online ? Math.round(performance.now() - started) : null,
    checkedAt: new Date().toISOString(),
    target: "http-gateway",
  };
}

export function createPingHandler(probe: () => Promise<PingResult> = probeHttp) {
  let pending: Promise<PingResult> | undefined;
  let last: PingResult | undefined;
  let lastAt = 0;

  return async () => {
    if (!last || Date.now() - lastAt >= 1_000) {
      pending ??= probe().finally(() => {
        pending = undefined;
      });
      last = await pending;
      lastAt = Date.now();
    }

    return Response.json(last, { headers: { "Cache-Control": "no-store" } });
  };
}
