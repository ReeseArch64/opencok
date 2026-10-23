import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { authenticate } from "../src/game/auth.ts";
import type { Config } from "../src/config.ts";
import type { AuthenticationStore } from "../src/persistence.ts";
import { fields, sfs } from "../src/protocol/sfs.ts";

const cfg = { loginSecret: "synthetic-secret", kingdomId: 2 } as Config;
const profile = {
  uid: "synthetic-player",
  deviceUuid: "synthetic-device",
  pf: "Google",
  banTime: 0n,
  banFlag: 0,
};
function packet(timestamp = "42") {
  return {
    zn: sfs.string("COK2"),
    un: sfs.string(profile.uid),
    p: sfs.object({
      gameUid: sfs.string(profile.uid),
      uuid: sfs.string(profile.deviceUuid),
      pf: sfs.string(profile.pf),
      appVersion: sfs.string("12.06.0"),
      cmdBaseTime: sfs.string(timestamp),
      SecurityCode: sfs.string(
        createHash("md5")
          .update(timestamp + cfg.loginSecret + profile.uid)
          .digest("hex"),
      ),
    }),
  };
}
const store: AuthenticationStore = {
  profile: async () => ({ ...profile }),
  accounts: async () => [{ active: 0, server: "2", uuid: profile.deviceUuid }],
};

test("mobile timestamps remain opaque and global account must match the selected realm", async () => {
  for (const time of ["42", "1700000000", "1700000000000"]) {
    expect(await authenticate(packet(time), store, cfg)).toEqual(profile);
  }
  await expect(
    authenticate(
      packet(),
      { ...store, accounts: async () => [{ active: 0, server: "1", uuid: profile.deviceUuid }] },
      cfg,
    ),
  ).rejects.toMatchObject({ reason: "global_account" });
  await expect(
    authenticate(
      packet(),
      { ...store, accounts: async () => [{ active: 1, server: "2", uuid: profile.deviceUuid }] },
      cfg,
    ),
  ).rejects.toMatchObject({ reason: "global_account" });
  await expect(
    authenticate(
      packet(),
      { ...store, accounts: async () => [{ active: 0, server: "2", uuid: "other" }] },
      cfg,
    ),
  ).rejects.toMatchObject({ reason: "global_account" });
});

test("invalid identity, zone, signature, device, version and platform are rejected", async () => {
  for (const [key, value, reason] of [
    ["gameUid", "other", "identity"],
    ["SecurityCode", "0".repeat(32), "signature"],
    ["SecurityCode", "invalid", "signature_format"],
    ["uuid", "other", "device"],
    ["appVersion", "9.27.0", "version"],
    ["pf", "unsupported", "platform"],
    ["cmdBaseTime", "", "timestamp"],
  ]) {
    const input = packet();
    fields(input.p)[key!] = sfs.string(value!);
    await expect(authenticate(input, store, cfg)).rejects.toMatchObject({ reason });
  }
  const input = packet();
  input.zn = sfs.string("COK1");
  await expect(authenticate(input, store, cfg)).rejects.toMatchObject({ reason: "zone" });
});

test("missing and banned profiles cannot authenticate", async () => {
  await expect(
    authenticate(packet(), { ...store, profile: async () => undefined }, cfg),
  ).rejects.toMatchObject({ reason: "profile_missing" });
  for (const ban of [{ banFlag: 1 }, { banTime: BigInt(Date.now() + 60000) }]) {
    await expect(
      authenticate(packet(), { ...store, profile: async () => ({ ...profile, ...ban }) }, cfg),
    ).rejects.toMatchObject({ reason: "banned" });
  }
});
