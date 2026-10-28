import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";
import { HealthTarget } from "@opencok/enums/health-target";
import type { HttpRequest } from "@opencok/contracts/http-request";
import { HEALTH_URL } from "./health-settings.ts";

export class HttpGatewayProbe
{
    public constructor(
        private readonly request: HttpRequest = fetch,
        private readonly url = HEALTH_URL,
    )
    {}

    public readonly probe = async (): Promise<GatewayPingResponse> => {
        const started = performance.now();
        let online = false;

        try
        {
            const request = this.request;
            const response = await request(this.url, {
                method: "GET",
                signal: AbortSignal.timeout(3_000),
                redirect: "error",
                cache: "no-store",
            });
            online = response.ok && (await response.text()).trim() === "ok";
        }
        catch
        {
            online = false;
        }

        return {
            online,
            latencyMs: online ? Math.round(performance.now() - started) : null,
            checkedAt: new Date().toISOString(),
            target: HealthTarget.HttpGateway,
        };
    };
}
