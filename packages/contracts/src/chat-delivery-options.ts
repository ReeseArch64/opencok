import type { Log, Peer, RoomAuthorizer } from "./chat.ts";
import type { ChatAccessStore, ChatDeliveryStore } from "./chat-delivery.ts";

export interface ChatDeliveryOptions {
  store: ChatDeliveryStore;
  instance: string;
  peers: Set<Peer>;
  authorizeRoom: RoomAuthorizer;
  access?: ChatAccessStore;
  log: Log;
}
