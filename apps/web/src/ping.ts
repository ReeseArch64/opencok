import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";
import { HEALTH_URL } from "./health-settings.ts";
import { HttpGatewayProbe } from "./http-gateway-probe.ts";
import { PingController } from "./ping.controller.ts";

export { HEALTH_URL } from "./health-settings.ts";

export type PingResult = GatewayPingResponse;

export function probeHttp(request: typeof fetch = fetch, url = HEALTH_URL): Promise<PingResult>
{
    return new HttpGatewayProbe(request, url).probe();
}

export function createPingHandler(probe: () => Promise<PingResult> = new HttpGatewayProbe().probe)
{
    return new PingController(probe).handle;
}
