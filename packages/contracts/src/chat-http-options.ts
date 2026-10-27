import type { AsyncHttpHandler, HttpHandler, WebSocketGateway } from "./chat.ts";

export interface ChatHttpOptions {
  isReady?: () => boolean;
  sessionHandler?: AsyncHttpHandler;
  profileHandler?: AsyncHttpHandler;
  nicknameHandler?: AsyncHttpHandler;
  mailboxHandler?: AsyncHttpHandler;
  socialHandler?: AsyncHttpHandler;
  configHandler?: HttpHandler;
  serverListHandler?: HttpHandler;
  websocketGateway?: WebSocketGateway;
}
