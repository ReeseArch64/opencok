import type { GatewayPingClient } from "./gateway-ping-client.ts";
import type { LoadingScreen } from "./loading-screen.ts";

export class LoadingApplication {
  private busy = false;
  private timer: ReturnType<typeof setTimeout> | undefined;

  public constructor(
    private readonly view: LoadingScreen,
    private readonly client: Pick<GatewayPingClient, "probe">,
    private readonly assets: readonly (readonly [string, string])[],
  ) {
    view.onRetry(() => void this.ping());
    view.onVisibilityChange(() => {
      clearTimeout(this.timer);

      if (!view.isHidden()) void this.ping();
    });
  }

  public async start(): Promise<void> {
    if (!(await this.view.loadAssets(this.assets))) return;

    await this.ping();
  }

  private async ping(): Promise<void> {
    if (this.busy) return;

    this.busy = true;
    clearTimeout(this.timer);
    this.view.checking();

    try {
      this.view.online(await this.client.probe());
    } catch {
      this.view.offline();
    } finally {
      this.busy = false;
      this.view.completeCheck();

      if (!this.view.isHidden()) this.timer = setTimeout(() => void this.ping(), 5_000);
    }
  }
}
