import { createHash, timingSafeEqual } from "node:crypto";
import type { Config } from "../config.ts";
import { long, num, text, type Row } from "./rows.ts";
import type { AuthenticationStore } from "../persistence.ts";
import { fields, str, type Fields } from "../protocol/sfs.ts";

export class LoginError extends Error {
  constructor(
    readonly reason:
      | "zone"
      | "identity"
      | "version"
      | "timestamp"
      | "signature_format"
      | "signature"
      | "profile_missing"
      | "device"
      | "banned"
      | "platform"
      | "global_account"
      | "session_busy" = "session_busy",
  ) {
    super("Login rejected");
  }
}
function equal(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function authenticate(
  packet: Fields,
  db: AuthenticationStore,
  config: Config,
  now = Date.now(),
): Promise<Row> {
  if (str(packet, "zn") !== `COK${config.kingdomId}`) throw new LoginError("zone");
  const data = fields(packet.p);
  const uid = str(data, "gameUid", "");
  const timestamp = str(data, "cmdBaseTime");
  const signature = str(data, "SecurityCode");
  const deviceUuid = str(data, "uuid");
  if (
    !uid ||
    uid.length > 255 ||
    uid !== str(packet, "un") ||
    deviceUuid.length > 200 ||
    !deviceUuid
  )
    throw new LoginError("identity");
  if (str(data, "appVersion") !== "12.06.0") throw new LoginError("version");

  if (!timestamp || timestamp.length > 64) throw new LoginError("timestamp");
  if (!/^[a-f0-9]{32}$/.test(signature)) throw new LoginError("signature_format");
  const expected = createHash("md5")
    .update(timestamp + config.loginSecret + uid)
    .digest("hex");
  if (!equal(signature, expected)) throw new LoginError("signature");
  const profile = await db.profile(uid);
  if (!profile) throw new LoginError("profile_missing");
  if (!equal(deviceUuid, text(profile, "deviceUuid"))) throw new LoginError("device");
  if (long(profile, "banTime") > BigInt(now) || num(profile, "banFlag") !== 0)
    throw new LoginError("banned");

  const platform = str(data, "pf", "").trim() || text(profile, "pf");
  const devicePlatforms = ["csmod_games", "Google", "market_global"];
  if (!devicePlatforms.includes(platform) || !devicePlatforms.includes(text(profile, "pf")))
    throw new LoginError("platform");
  const accounts = await db.accounts(uid);
  if (
    !accounts.some(
      (a) =>
        num(a, "active") === 0 &&
        num(a, "server") === config.kingdomId &&
        equal(text(a, "uuid"), deviceUuid),
    )
  )
    throw new LoginError("global_account");
  return profile;
}
