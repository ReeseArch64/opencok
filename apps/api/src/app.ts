import type { Config } from "./config.ts";
import { createHandler } from "@opencok/api/handler";
import { ServerDirectory } from "@opencok/storage/server-directory";
import { AccountStore } from "@opencok/repositories/account";
import { DiscoveryRedis } from "@opencok/storage/discovery-redis";

export async function createApp(config: Config) {
  const directory = new ServerDirectory(config);
  const accounts = new AccountStore(config);
  const redis = new DiscoveryRedis(config);
  try {
    await directory.read();
    await accounts.start();
    await redis.health();
  } catch (error) {
    await accounts.close();
    throw error;
  }
  return { ...createHandler(accounts, directory, redis), close: () => accounts.close() };
}
