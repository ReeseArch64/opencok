import type { RealmNotifications } from "./notifications.ts";
import type { GameStore } from "@opencok/contracts/game";
import type { GameController } from "@opencok/controllers/game";
import type { WorldController } from "@opencok/controllers/world";
import type { ServerConfig } from "@opencok/contracts/server";

export type ConnectionConfig = Pick<
  ServerConfig,
  "host" | "port" | "healthPort" | "kingdomId" | "loginSecret"
>;

export interface ServerDependencies {
  provisioning?: (request: Request) => Promise<Response>;
  profileSessions?: {
    open(owner: string, sessionId: string, now: number): Promise<void>;
    close(owner: string, sessionId: string, now: number): Promise<void>;
  };
  notifications?: RealmNotifications;
  db: GameStore & { start(): Promise<void>; health(): Promise<void>; close(): Promise<void> };
  cache: {
    command(command: string, ...args: string[]): Promise<unknown>;
    claim(uid: string, token: string): Promise<boolean>;
    refresh(uid: string, token: string): Promise<boolean>;
    release(uid: string, token: string): Promise<void>;
  };
  coordination: { readonly ready: boolean; start(): Promise<void>; close(): void };
  game: Pick<GameController, "initialize" | "execute">;
  world: Pick<WorldController, "get">;
}
