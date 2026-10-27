import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";
import { GatewayPingValidator } from "@opencok/validations/gateway-ping";
import type { HttpRequest } from "@opencok/contracts/http-request";

export class GatewayPingClient {
  public constructor(
    private readonly request: HttpRequest = fetch,
    private readonly validator = new GatewayPingValidator(),
  ) {}

  public async probe(): Promise<GatewayPingResponse> {
    const request = this.request;
    const response = await request("/api/ping", {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) throw new Error("Ping unavailable");

    const result = this.validator.parse(await response.json());

    if (!result.online || result.latencyMs === null) throw new Error("Gateway offline");

    return result;
  }
}
