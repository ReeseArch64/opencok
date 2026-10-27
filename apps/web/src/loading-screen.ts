import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";

export interface LoadingScreen {
  isHidden(): boolean;
  onRetry(run: () => void): void;
  onVisibilityChange(run: () => void): void;
  checking(): void;
  online(result: GatewayPingResponse): void;
  offline(): void;
  completeCheck(): void;
  loadAssets(assets: readonly (readonly [string, string])[]): Promise<boolean>;
}
