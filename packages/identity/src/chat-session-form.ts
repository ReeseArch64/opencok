import { createHash, timingSafeEqual } from "node:crypto";

export class ChatSessionFormVerifier {
  private readonly requiredFields = ["appid", "ttl", "uid", "userinfo", "sign"];

  public constructor(private readonly secret: string) {}

  public verify(form: URLSearchParams): "bad_request" | "unauthorized" | null {
    if (this.requiredFields.some((key) => form.getAll(key).length !== 1)) return "bad_request";
    if ([...form.keys()].some((key) => !this.requiredFields.includes(key))) return "bad_request";

    const uid = form.get("uid");
    const appid = form.get("appid");
    if (!uid || uid.length > 40 || !appid || form.get("ttl") !== "86400") return "bad_request";

    try {
      const info: unknown = JSON.parse(form.get("userinfo") ?? "");
      if (!info || typeof info !== "object" || Array.isArray(info)) return "bad_request";
    } catch {
      return "bad_request";
    }

    const sign = form.get("sign");
    if (!sign || !/^[0-9a-f]{32}$/i.test(sign)) return "unauthorized";

    const fields = ["appid", "ttl", "uid", "userinfo"];
    const base = fields.map((key) => `${key}${form.get(key)}`).join("");
    const expected = createHash("md5")
      .update(base + this.secret)
      .digest();

    return timingSafeEqual(expected, Buffer.from(sign, "hex")) ? null : "unauthorized";
  }
}
