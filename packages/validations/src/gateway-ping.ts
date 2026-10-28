import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";

export class GatewayPingValidator
{
    public parse(value: unknown): GatewayPingResponse
    {
        if (typeof value !== "object" || value === null)
        {
            throw new Error("Invalid gateway ping");
        }

        const result = value as Partial<GatewayPingResponse>;

        if (
            result.target !== "http-gateway"
            || typeof result.online !== "boolean"
            || typeof result.checkedAt !== "string"
            || (result.latencyMs !== null
                && (typeof result.latencyMs !== "number"
                    || !Number.isFinite(result.latencyMs)
                    || result.latencyMs < 0))
        )
        {
            throw new Error("Invalid gateway ping");
        }

        return result as GatewayPingResponse;
    }
}
