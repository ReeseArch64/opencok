import type { HttpHandler } from "@opencok/contracts/chat";
import type { ChatDiscoverySettings } from "@opencok/contracts/chat-discovery-settings";
import { HttpStatus } from "@opencok/enums/http-status";
import { ChatWebsocketUrl } from "@opencok/validations/chat-websocket-url";

export abstract class ChatDiscoveryController {
  protected readonly endpoint: ChatWebsocketUrl;
  private readonly isReady: () => boolean;

  protected constructor(settings: ChatDiscoverySettings) {
    this.endpoint = new ChatWebsocketUrl(settings.websocketUrl);
    this.isReady = settings.isReady ?? (() => true);
  }

  protected abstract response(): object;

  protected abstract readonly unavailable: string;

  public readonly handle: HttpHandler = (_request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");

    let ready = false;

    try {
      ready = this.isReady() === true;
    } catch {
      ready = false;
    }

    response.writeHead(ready ? HttpStatus.Ok : HttpStatus.ServiceUnavailable);
    response.end(ready ? JSON.stringify(this.response()) : this.unavailable);
  };
}
