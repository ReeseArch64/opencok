import { startServer } from "../../src/server";
import { loadRules } from "@opencok/resources/rules";
import type { ServerConfig } from "@opencok/contracts/server";
try {
  const config = JSON.parse(process.env.OPENCOK_WORLD_TEST_CONFIG!) as ServerConfig;
  const rules = await loadRules(undefined, config.kingdomId);
  rules.items.set("world_marchtime", {
    ...rules.items.get("world_marchtime"),
    id: "world_marchtime",
    k1: "1",
    k2: "60",
  });
  rules.items.set("resources_speed", {
    ...rules.items.get("resources_speed"),
    id: "resources_speed",
    k1: "2",
  });
  rules.arms.set("107000", { ...rules.arms.get("107000"), id: "107000", speed: "1" });
  rules.goods.set("200220", {
    ...rules.goods.get("200220"),
    id: "200220",
    type: "2",
    para1: "2",
    para2: "2",
    para3: "99",
  });
  const runtime = await startServer(config, rules);
  process.send?.({ type: "ready", port: runtime.port, healthPort: runtime.healthPort });
  process.once("SIGTERM", () => {
    void runtime.close().then(() => process.exit(0));
  });
} catch {
  process.send?.({ type: "failed" });
  process.exit(1);
}
