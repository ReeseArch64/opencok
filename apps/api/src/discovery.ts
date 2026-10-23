import { phpEmpty, type Parameters } from "./compat.ts";
import { listedServers, publicServer, type ServerDirectory } from "./servers.ts";
import type { Account, AccountReader } from "./storage.ts";

export class Discovery {
  constructor(
    private readonly accounts: AccountReader,
    private readonly directory: Pick<ServerDirectory, "read">,
  ) {}
  async run(params: Parameters): Promise<unknown> {
    if (params.loginFlag !== "1") return "sig error";
    const servers = await this.directory.read();
    const bound = ["market_global", "csmods_studio", "mycard"].includes(params.pf ?? "");
    let account: Account | undefined;
    if (bound && !phpEmpty(params.pfId))
      account = (await this.accounts.valid(params.pf!, params.pfId!, true))[0];
    if (!account && !phpEmpty(params.uuid)) {
      if (params.terminal === "facebook")
        account = (await this.accounts.valid("facebook", params.uuid!, bound))[0];
      account ??= (await this.accounts.valid("device", params.uuid!, bound))[0];
    }
    if (account) {
      const server = servers.get(account.server);
      if (!server) return { serverList: [], country: 1 };
      return {
        lastLoggedServer: account.server,
        serverList: [
          {
            ...publicServer(server),
            uuid: account.uuid,
            gameUid: account.gameUid,
            gameUserLevel: account.gameUserLevel,
          },
        ],
        country: 1,
      };
    }
    // Directory metadata only. Registration and migration of account state are separate operations.
    return { serverList: listedServers(servers, true), country: 1 };
  }
}
