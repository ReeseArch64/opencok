import type { HealthTarget } from "@opencok/enums/health-target";

export interface GatewayPingResponse {
  online: boolean;
  latencyMs: number | null;
  checkedAt: string;
  target: `${HealthTarget}`;
}
