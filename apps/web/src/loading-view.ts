import type { GatewayPingResponse } from "@opencok/contracts/responses/gateway-ping.response";
import type { LoadingScreen } from "./loading-screen.ts";

export class LoadingView implements LoadingScreen {
  private readonly status: HTMLParagraphElement;
  private readonly latency: HTMLParagraphElement;
  private readonly retry: HTMLButtonElement;
  private readonly progress: HTMLProgressElement;
  private readonly fill: HTMLDivElement;

  public constructor(private readonly document: Document) {
    this.status = this.element("status");
    this.latency = this.element("latency");
    this.retry = this.element("retry");
    this.progress = this.element("progress");
    this.fill = this.element("progress-fill");
  }

  public isHidden(): boolean {
    return this.document.hidden;
  }

  public onRetry(run: () => void): void {
    this.retry.addEventListener("click", run);
  }

  public onVisibilityChange(run: () => void): void {
    this.document.addEventListener("visibilitychange", run);
  }

  public checking(): void {
    this.retry.disabled = true;
    this.status.dataset.state = "checking";
    this.status.textContent = "Conectando ao servidor…";
  }

  public online(result: GatewayPingResponse): void {
    this.status.dataset.state = "online";
    this.status.textContent = "Servidor HTTP disponível";
    this.latency.textContent = `${result.latencyMs} ms · última verificação às ${new Date(result.checkedAt).toLocaleTimeString("pt-BR")}`;
    this.retry.textContent = "Verificar novamente";
  }

  public offline(): void {
    this.status.dataset.state = "offline";
    this.status.textContent = "Não foi possível conectar ao servidor";
    this.latency.textContent = "Uma nova tentativa será feita em 5 segundos";
    this.retry.textContent = "Tentar novamente";
  }

  public completeCheck(): void {
    this.retry.disabled = false;
  }

  public async loadAssets(assets: readonly (readonly [string, string])[]): Promise<boolean> {
    const loaded = await Promise.allSettled(
      assets.map(async ([id, src]) => {
        const image = this.element<HTMLImageElement>(id);
        image.src = src;
        await image.decode();
        this.progress.value += 1;
        this.fill.style.width = `${(this.progress.value / this.progress.max) * 100}%`;
      }),
    );

    if (loaded.some((asset) => asset.status === "rejected")) {
      this.document.body.dataset.assetError = "true";
      this.status.textContent = "Alguns recursos visuais não puderam ser carregados";
      this.latency.textContent = "Recarregue a página para tentar novamente";

      return false;
    }

    return true;
  }

  private element<T extends HTMLElement>(id: string): T {
    const result = this.document.getElementById(id);

    if (!result) throw new Error(`Missing loading element: ${id}`);

    return result as T;
  }
}
