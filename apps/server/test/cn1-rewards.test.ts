import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cn1RewardRatio, type Cn1SessionState } from "@opencok/rules/cn1-rewards";
import { Rules } from "@opencok/rules/game";
import { nicknameGoldRefund, type NicknameGoldBalances } from "@opencok/rules/nickname-change";
import { loadRules } from "@opencok/resources/rules";
import vectors from "./fixtures/cn1-reward-vectors.json";

const context = { kingdomId: 2, version: "12.6.0" };
const active = (onlineLastTime = 15): Cn1SessionState => ({ isAddict: 1, onlineLastTime });
const initial: NicknameGoldBalances = {
  gold: 5n,
  paidGold: 11n,
  paidSpecialGold: 13n,
  dmmGold: 7n,
  dmmPaidGold: 17n,
  dmmPaidSpecialGold: 19n,
};

function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  const control = {
    id: "69036",
    k1: "12.6.0",
    k2: "2",
    k3: "10,1|20,0.5|30,0",
    k72: "1",
    k107: "1",
  };
  rules.configuration.payControl = new Map([["69036", control]]);
  return { rules, control };
}

function bits(value: number): string {
  if (Number.isNaN(value)) {return "7fc00000";}
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value);
  return view.getUint32(0).toString(16).padStart(8, "0");
}

test("CN1 reward bands match 755 independent Java 8 numeric and tokenization outcomes", () => {
  expect(vectors).toHaveLength(755);
  for (const [bands, minutes, expected] of vectors as [string | null, number, string][]) {
    const { rules, control } = fixture();
    control.k3 = bands as string;
    const run = () => cn1RewardRatio(active(minutes), rules, context);
    if (expected === "error") {expect(run).toThrow();}
    else {expect(bits(run()), JSON.stringify([bands, minutes])).toBe(expected);}
  }
});

test("known absent or exempt CN1 state bypasses catalogs and online time without inventing missing state", () => {
  const unreachable = new Proxy(fixture().rules, {
    get(): never {
      throw new Error("Unexpected catalog read");
    },
  });
  expect(cn1RewardRatio(null, unreachable, context)).toBe(1);
  expect(
    cn1RewardRatio(
      {
        isAddict: 0,
        get onlineLastTime(): never {
          throw new Error("Unexpected time read");
        },
      },
      unreachable,
      context,
    ),
  ).toBe(1);
  for (const isAddict of [undefined, null, "1", NaN, Infinity, 0.1, 2147483648, -2147483649])
    {expect(() =>
      cn1RewardRatio({ isAddict, onlineLastTime: 0 } as Cn1SessionState, unreachable, context),
    ).toThrow("Invalid CN1 session integer");}
  expect(() => cn1RewardRatio(undefined as unknown as null, unreachable, context)).toThrow();
});

test("missing and empty CN1 controls return one before version gate and saved online time", () => {
  const { rules } = fixture();
  const state = {
    isAddict: 1,
    get onlineLastTime(): never {
      throw new Error("Unexpected time read");
    },
  };
  rules.configuration.payControl = undefined;
  expect(cn1RewardRatio(state, rules, { ...context, version: "bad" })).toBe(1);
  rules.configuration.payControl = new Map();
  expect(cn1RewardRatio(state, rules, { ...context, version: "bad" })).toBe(1);
  rules.configuration.payControl.set("69036", {});
  expect(cn1RewardRatio(state, rules, { ...context, version: "bad" })).toBe(1);
});

test("CN1 compares player versions directly before realm gates and retains reached parse failures", () => {
  const { rules, control } = fixture();
  control.k2 = "invalid";
  expect(cn1RewardRatio(active(), rules, { ...context, version: "11" })).toBe(1);
  for (const version of ["", " ", "12.6", "13.bad", "12.6.0.bad"])
    {expect(() => cn1RewardRatio(active(), rules, { ...context, version })).toThrow();}
  for (const k1 of [undefined, "", " ", "12.6", "13.bad"])
    {expect(() => {
      control.k1 = k1 as string;
      return cn1RewardRatio(active(), rules, context);
    }).toThrow();}
  control.k1 = "12.6.0";
  control.k2 = "2";
  for (const version of ["13", "12.7", ".１２..６.０.99"])
    {expect(cn1RewardRatio(active(), rules, { ...context, version })).toBe(0.5);}
});

test("production and test CN1 gates preserve selector dialect and independent test switches", () => {
  const { rules, control } = fixture();
  for (const k2 of ["all", "2", "1-3", "1--3", "１-３", "2;invalid"]) {
    control.k2 = k2;
    expect(cn1RewardRatio(active(), rules, context), k2).toBe(0.5);
  }
  for (const k2 of ["close", "", "1;3", "3-1"]) {
    control.k2 = k2;
    expect(cn1RewardRatio(active(), rules, context)).toBe(1);
  }
  control.k2 = "invalid";
  expect(() => cn1RewardRatio(active(), rules, context)).toThrow();
  for (const first of [undefined, "0", "1", "all", " 1"])
    {for (const second of [undefined, "0", "1", "all", " 1"]) {
      control.k72 = first as string;
      control.k107 = second as string;
      expect(cn1RewardRatio(active(), rules, { ...context, testServer: true })).toBe(
        first === "1" && second === "1" ? 0.5 : 1,
      );
    }}
  control.k2 = "2";
  expect(cn1RewardRatio(active(), rules, context)).toBe(0.5);
});

test("CN1 reads signed saved session minutes only after the control opens and accepts every nonzero flag", () => {
  const { rules, control } = fixture();
  for (const onlineLastTime of [
    undefined,
    null,
    "15",
    NaN,
    Infinity,
    0.5,
    2147483648,
    -2147483649,
  ]) {
    const state = { isAddict: 1, onlineLastTime } as Cn1SessionState;
    control.k2 = "close";
    expect(cn1RewardRatio(state, rules, context)).toBe(1);
    control.k2 = "2";
    expect(() => cn1RewardRatio(state, rules, context)).toThrow("Invalid CN1 session integer");
  }
  for (const isAddict of [-2147483648, -1, 1, 2, 2147483647])
    {expect(cn1RewardRatio({ isAddict, onlineLastTime: 15 }, rules, context)).toBe(0.5);}
  expect(cn1RewardRatio(active(-2147483648), rules, context)).toBe(1);
  expect(cn1RewardRatio(active(2147483647), rules, context)).toBe(0);
});

test("CN1 keeps declared band order and the exact maximum boundary instead of sorting or clamping", () => {
  const { rules, control } = fixture();
  expect(
    [9, 10, 19, 20, 29, 30, 31].map((time) => cn1RewardRatio(active(time), rules, context)),
  ).toEqual([1, 0.5, 0.5, 0, 0, 1, 0]);
  control.k3 = "30,0.25|10,1|20,0.5";
  expect(cn1RewardRatio(active(15), rules, context)).toBe(0.25);
  expect(cn1RewardRatio(active(30), rules, context)).toBe(1);
  control.k3 = "10,0.25|10,0.75|20,0.5";
  expect(cn1RewardRatio(active(9), rules, context)).toBe(0.25);
  expect(cn1RewardRatio(active(10), rules, context)).toBe(0.5);
});

test("CN1 only parses reached thresholds and the selected ratio while ignoring alert-only fields", () => {
  const { rules, control } = fixture();
  control.k3 = "10|20,0.5,not-an-interval,dialog|bad";
  expect(cn1RewardRatio(active(10), rules, context)).toBe(0.5);
  expect(() => cn1RewardRatio(active(9), rules, context)).toThrow();
  expect(() => cn1RewardRatio(active(20), rules, context)).toThrow();
  control.k3 = "10,invalid|20,0.5|30";
  expect(cn1RewardRatio(active(10), rules, context)).toBe(0.5);
  expect(cn1RewardRatio(active(30), rules, context)).toBe(1);
  control.k3 = "||10,,0.25,ignored|||20,0.5|";
  expect(cn1RewardRatio(active(9), rules, context)).toBe(0.25);
  for (const k3 of ["", "|||", "|".repeat(65535)]) {
    control.k3 = k3;
    expect([-1, 0, 1].map((time) => cn1RewardRatio(active(time), rules, context))).toEqual([
      1, 1, 0,
    ]);
  }
  control.k3 = "|".repeat(65536);
  expect(() => cn1RewardRatio(active(), rules, context)).toThrow("Invalid CN1 reward bands");
});

test("nickname refund consumes the configured CN1 ratio lazily and preserves free-bucket arithmetic", () => {
  const { rules } = fixture();
  for (const [minutes, delta] of [
    [9, 5n],
    [10, 2n],
    [20, 0n],
    [30, 5n],
    [31, 0n],
  ] as const) {
    const before = structuredClone(initial);
    const result = nicknameGoldRefund(initial, "cn1", "5", () =>
      cn1RewardRatio(active(minutes), rules, context),
    );
    expect(result).toEqual({
      balances: { ...initial, gold: initial.gold + delta },
      gold: 29n + delta,
      delta,
      pool: "mobile",
    });
    expect(initial).toEqual(before);
  }
  const brokenState = undefined as unknown as null;
  for (const platform of [null, "", "CN1", "cn1 ", "market_global", "dmm"])
    {expect(
      nicknameGoldRefund(initial, platform, "5", () => cn1RewardRatio(brokenState, rules, context))
        .delta,
    ).toBe(5n);}
  expect(() =>
    nicknameGoldRefund(initial, "cn1", "5", () => cn1RewardRatio(brokenState, rules, context)),
  ).toThrow();
  let called = false;
  expect(() =>
    nicknameGoldRefund(initial, "cn1", "bad", () => {
      called = true;
      return 1;
    }),
  ).toThrow();
  expect(called).toBe(false);
});

test("CN1 refund ratios use the existing real resource loader without transforming bands or filling missing values", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-cn1-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      {await writeFile(
        join(directory, `${name}.xml`),
        name === "building"
          ? '<database><ItemSpec id="400001" level="1"/></database>'
          : '<database><ItemSpec id="synthetic"/></database>',
      );}
    expect(cn1RewardRatio(active(), await loadRules(directory), context)).toBe(1);
    await writeFile(
      join(directory, "pay_servercontrol.xml"),
      '<database><ItemSpec id="69036" k1="12.6.0" k2="2" k3="10,1|20,0.5|30,0"/></database>',
    );
    const rules = await loadRules(directory);
    expect(cn1RewardRatio(active(), rules, context)).toBe(0.5);
    expect(cn1RewardRatio(active(30), rules, context)).toBe(1);
    expect(
      nicknameGoldRefund(initial, "cn1", "5", () => cn1RewardRatio(active(), rules, context)).delta,
    ).toBe(2n);
    await writeFile(
      join(directory, "pay_servercontrol.xml"),
      '<database><ItemSpec id="69036" k1="12.6.0" k2="2"/></database>',
    );
    const missing = await loadRules(directory);
    expect(() => cn1RewardRatio(active(), missing, context)).toThrow("Invalid CN1 reward bands");
    await writeFile(
      join(directory, "pay_servercontrol.xml"),
      '<database><ItemSpec id="69036" k1="12.6.0" k2="2" k3=""/></database>',
    );
    expect(cn1RewardRatio(active(), await loadRules(directory), context)).toBe(0);
    await writeFile(join(directory, "pay_servercontrol.xml"), "<database/>");
    expect(cn1RewardRatio(active(), await loadRules(directory), context)).toBe(1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
