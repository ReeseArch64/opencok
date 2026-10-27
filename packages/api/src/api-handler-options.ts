import type { AccountReader } from "@opencok/contracts/account";
import type { ChatDiscovery } from "@opencok/contracts/chat";
import type { ServerDirectory } from "@opencok/storage/server-directory";

export interface ApiHandlerOptions {
  accounts: AccountReader & { health(): Promise<unknown> };
  directory: Pick<ServerDirectory, "read">;
  redis: { health(): Promise<unknown> };
  chatDiscovery?: ChatDiscovery;
  files?: (request: Request) => Promise<Response>;
  provisioning?: (request: Request) => Promise<Response>;
}
