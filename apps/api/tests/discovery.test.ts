import { expect, test } from "bun:test";
import { Discovery } from "@opencok/api/discovery";
import { ServerDirectory, publicServer } from "@opencok/storage/server-directory";
import { phpJson, requestParameters } from "@opencok/api/compat";
import type { Account, AccountReader } from "@opencok/contracts/account";
import type { Config } from "../src/config";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const server = {
  id: "1",
  name: "Synthetic",
  ip: "127.0.0.1",
  port: "9933",
  zone: "COK1",
  recommend: "true",
  test: "false",
  db_name: "private",
  future_secret: "synthetic-private",
};
const account: Account = {
  gameUid: "synthetic-player",
  uuid: "synthetic-device",
  server: "1",
  gameUserLevel: "1",
  lastTime: "9007199254740993",
  active: "0",
};
const directory = { read: async () => new Map([["1", server]]) };

test("existing device discovery uses configured realm and exposes only compatibility fields", async () => {
  const calls: unknown[] = [];
  const accounts: AccountReader = {
    getAll: async (...args) => {
      calls.push(args);
      return [account];
    },
  };
  const result = await new Discovery(accounts, directory).run({
    loginFlag: "1",
    uuid: "synthetic-device",
  });
  expect(calls).toEqual([["device", "synthetic-device", false]]);
  expect(result).toEqual({
    lastLoggedServer: "1",
    serverList: [
      {
        id: "1",
        name: "Synthetic",
        ip: "127.0.0.1",
        port: "9933",
        zone: "COK1",
        uuid: "synthetic-device",
        gameUid: "synthetic-player",
        gameUserLevel: "1",
      },
    ],
    country: 1,
  });
  expect(JSON.stringify(result)).not.toContain("synthetic-private");
});

test("platform mappings take priority and absent realms never produce a fake endpoint", async () => {
  const calls: unknown[] = [];
  const accounts: AccountReader = {
    getAll: async (...args) => {
      calls.push(args);
      return [account];
    },
  };
  await new Discovery(accounts, directory).run({
    loginFlag: "1",
    pf: "market_global",
    pfId: "synthetic-platform",
    uuid: "synthetic-device",
  });
  expect(calls).toEqual([["market_global", "synthetic-platform", true]]);
  expect(
    await new Discovery({ getAll: async () => [{ ...account, server: "2" }] }, directory).run({
      loginFlag: "1",
      uuid: "synthetic-device",
    }),
  ).toEqual({ serverList: [], country: 1 });
});

test("invalid login flags perform no lookups and new devices receive metadata without provisioning", async () => {
  let calls = 0;
  const discovery = new Discovery(
    {
      getAll: async () => {
        calls++;
        return [];
      },
    },
    directory,
  );
  expect(await discovery.run({ uuid: "synthetic-device" })).toBe("sig error");
  expect(calls).toBe(0);
  const result = await discovery.run({
    loginFlag: "1",
    uuid: "unknown-device",
    gmFlag: "1",
    terminal: "facebook",
    zone: "669",
  });
  expect(result).toEqual({ serverList: [publicServer(server)], country: 1 });
  expect(JSON.stringify(result)).not.toContain("gameUid");
});

test("directory validates endpoints, duplicate IDs and realm zones", async () => {
  const folder = await mkdtemp(join(tmpdir(), "opencok-api-directory-"));
  const file = join(folder, "servers.json");
  const config = { serversFile: file, gameHost: "192.0.2.1", gamePort: 19933 } as Config;
  try {
    await Bun.write(file, JSON.stringify([server]));
    expect((await new ServerDirectory(config).read()).get("1")?.port).toBe("19933");
    expect((await new ServerDirectory(config).read()).get("1")?.ip).toBe("192.0.2.1");
    for (const entries of [
      [{ ...server, zone: "COK2" }],
      [server, server],
      [{ ...server, id: "0" }],
    ]) {
      await Bun.write(file, JSON.stringify(entries));
      await expect(new ServerDirectory(config).read()).rejects.toThrow();
    }
    await Bun.write(file, JSON.stringify([{ ...server, ip: "0.0.0.0" }]));
    await expect(new ServerDirectory({ ...config, gameHost: undefined }).read()).rejects.toThrow(
      "advertised host",
    );
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("PHP aliases retain form precedence, bracket handling and escaped JSON", async () => {
  const request = new Request("http://localhost/gameservice/getline.php?uuid=query&device.id=a", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "uuid=body&array[x]=value",
  });
  expect(await requestParameters(request)).toEqual({
    uuid: "body",
    device_id: "a",
    array: "Array",
  });
  expect(phpJson({ name: "城/á" })).toBe('{"name":"\\u57ce\\/\\u00e1"}');
});

test("default directory derives realm identity and zone from the selected server", async () => {
  const config = {
    kingdomId: 2,
    serversFile: undefined,
    gameHost: "127.0.0.1",
    gamePort: 19934,
  } as Config;
  const directory = await new ServerDirectory(config).read();
  expect(directory.has("1")).toBe(false);
  expect(directory.get("2")).toMatchObject({ id: "2", zone: "COK2", port: "19934" });
});
