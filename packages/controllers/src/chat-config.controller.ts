import type { ChatDiscoverySettings } from "@opencok/contracts/chat-discovery-settings";
import { ChatConfigMapper } from "@opencok/mappings/chat-config.mapper";
import { ChatDiscoveryController } from "./chat-discovery.controller.ts";

export class ChatConfigController extends ChatDiscoveryController {
  protected readonly unavailable = '{"code":0,"data":{}}';

  public constructor(
    settings: ChatDiscoverySettings,
    private readonly mapper = new ChatConfigMapper(),
  ) {
    super(settings);
  }

  protected response(): object {
    return this.mapper.map(this.endpoint.value);
  }
}
