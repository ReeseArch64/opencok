import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";
import { HttpGatewayProbe } from "./http-gateway-probe.ts";

export class PingController {
  private pending: Promise<GatewayPingResponse> | undefined;
  private last: GatewayPingResponse | undefined;
  private lastAt = 0;

  public constructor(
    private readonly probe: () => Promise<GatewayPingResponse> = new HttpGatewayProbe().probe,
  ) {}

  public readonly handle = async (): Promise<Response> => {
    if (!this.last || Date.now() - this.lastAt >= 1_000) {
      this.pending ??= this.probe().finally(() => {
        this.pending = undefined;
      });
      this.last = await this.pending;
      this.lastAt = Date.now();
    }

    return Response.json(this.last, { headers: { "Cache-Control": "no-store" } });
  };
}
