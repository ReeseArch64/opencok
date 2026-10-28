import { expect, test } from "bun:test";
import { dataConfig, serverClock } from "@opencok/mappings/bootstrap";
import { Rules } from "@opencok/rules/game";
import { dataConfigItems } from "./fixtures/data-config.ts";
import { fields, Type } from "@opencok/messages/sfs";

test("core data config preserves XML strings and legacy numeric field types", () => {
    const rules = new Rules(
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        dataConfigItems({
            player_max: { k3: "30" },
            resources_basics: { k7: "100", k8: "300" },
        }),
    );
    const config = fields(dataConfig(rules).dataConfig);
    expect(fields(config.player_max).k3).toEqual({ type: Type.String, value: "30" });
    expect(fields(config.player_max).id).toBeUndefined();
    expect(config.freeSpdT).toEqual({ type: Type.Int, value: 300 });
    expect(config.cross_open?.value).toBe(false);
    expect(() => dataConfig(new Rules(new Map(), new Map(), new Map()))).toThrow();
});

test("legacy clock names retain inverted values and midnight follows database offset", () => {
    const now = Date.UTC(2024, 0, 1, 12);
    const result = serverClock(now, -3);
    expect(result.db_utc_timestamp?.value).toBe(-3);
    expect(result.db_timezone_offset?.value).toBe(now / 1000);
    expect(result.tomorrow?.value).toBe(Date.UTC(2024, 0, 2, 3) / 1000);
});

test("UTC clock response has a stable wire snapshot", () => {
    expect(serverClock(Date.UTC(2024, 0, 1, 12), 0)).toMatchInlineSnapshot(`
    {
      "db_timezone_offset": {
        "type": 4,
        "value": 1704110400,
      },
      "db_utc_timestamp": {
        "type": 4,
        "value": 0,
      },
      "tomorrow": {
        "type": 4,
        "value": 1704153600,
      },
    }
  `);
});
