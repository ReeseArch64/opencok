import { expect, test } from "bun:test";
import type { PublicProfileState } from "@opencok/contracts/profile";
import type { Row } from "@opencok/contracts/rows";
import { decodeGeneralAbilities, publicProfileGenerals } from "@opencok/controllers/profile";
import { Rules } from "@opencok/rules/game";
import { publicGeneralPreviews } from "@opencok/rules/profile-generals";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";

const now = 1792756800000;
const ready = 9223372036854775807n;
function fixture() {
  const general: Row = {
    uuid: "a",
    generalId: "1001",
    level: 3,
    status: 1,
    plusSkillPoint: 8,
    ability: Buffer.from(
      '[{"id":"50001","600001":2,"620700":1},{"id":"60000","ids":["saved"]},{"id":"70000","600002":4}]',
    ),
  };
  const skill = (id: string, changes: Row = {}): Row => ({
    uuid: `skill-${id}`,
    ownerId: "synthetic",
    skillId: id,
    startTime: 1234n,
    endTime: BigInt(now + 5001),
    actTime: 9007199254740993n,
    stat: 2,
    param1: 3,
    param2: 4,
    ...changes,
  });
  const state: PublicProfileState = {
    profile: { uid: "synthetic" },
    statistics: undefined,
    vip: undefined,
    lord: undefined,
    mixed: undefined,
    military: undefined,
    office: undefined,
    flowers: undefined,
    taverns: [],
    generals: [general],
    skills: [skill("622800"), skill("622900"), skill("620700"), skill("unknown")],
    equipment: [],
    honors: [],
    completedAchievements: 0,
  };
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map([["hero_up", { k1: "0.1", k2: "1.5" }]]),
    undefined,
    undefined,
    undefined,
    1,
    undefined,
    undefined,
    {
      generals: new Map([["1001", { attack: "3.25", defence: "2.5" }]]),
      generalSkills: new Map(["601000", "622800", "622900"].map((id) => [id, { cd_time: "0" }])),
    },
  );
  const project = () =>
    publicGeneralPreviews(
      state.generals,
      state.skills,
      new Map(state.generals.map((row) => [String(row.uuid), decodeGeneralAbilities(row.ability)])),
      "synthetic",
      rules,
      now,
    );
  return { general, skill, state, rules, project };
}

test("public generals reconstruct typed previews without mutating ability buffers or skill state", () => {
  const { state, general, project } = fixture();
  const before = Buffer.from(general.ability as Buffer);
  const result = project()[0]!;
  expect(result).toMatchObject({
    uuid: "a",
    generalId: "1001",
    level: 3,
    status: 1,
    attack: 10,
    defence: 11,
    plusSkillPoint: 8,
  });
  expect(result.ability).toEqual([
    { id: "50001", "600001": 2, "622800": 1, "622900": 1 },
    { id: "70000", "600002": 4 },
  ]);
  expect(result.skills.map((row) => row.skillId).sort()).toEqual(["622800", "622900"]);
  expect(result.skills[0]).toMatchObject({
    stat: 0,
    startTime: 1234n,
    endTime: BigInt(now + 5001),
    actTime: 9007199254740993n,
  });
  expect(general.ability).toEqual(before);
  expect(state.skills.every((row) => row.stat === 2)).toBe(true);
});

test("public general wire data uses the first hash-ordered general for additional skill points", () => {
  const { state, general, rules } = fixture();
  state.generals = [{ ...general, uuid: "b", plusSkillPoint: 99 }, general];
  const data = decode(encode(publicProfileGenerals(state, rules, now)));
  expect(data.skillPoint).toEqual(sfs.int(8));
  const previews = (data.userGenerals!.value as Value[]).map(fields);
  expect(previews.map((row) => row.uuid)).toEqual([sfs.string("a"), sfs.string("b")]);
  expect(Object.keys(previews[0]!).sort()).toEqual([
    "ability",
    "att",
    "defence",
    "generalId",
    "level",
    "skill",
    "status",
    "uuid",
  ]);
  const firstSkill = fields((previews[0]!.skill!.value as Value[])[0]);
  expect(firstSkill.actTime).toEqual(sfs.long(9007199254740993n));
  expect(Object.keys(firstSkill).sort()).toEqual([
    "actTime",
    "endTime",
    "ownerId",
    "param1",
    "param2",
    "skillId",
    "startTime",
    "stat",
    "uuid",
  ]);
  expect(previews[1]!.skill).toEqual(previews[0]!.skill);
});

test("cooldowns honor the five-second cutoff, readiness sentinel and invalid-versus-disabled state", () => {
  const { state, skill, project } = fixture();
  for (const endTime of [BigInt(now - 1), BigInt(now), BigInt(now + 5000)]) {
    state.skills = [skill("601000", { endTime, stat: 1 })];
    expect(project()[0]!.skills[0]).toMatchObject({
      startTime: 0n,
      endTime: 0n,
      stat: 1,
      param1: 3,
      param2: 4,
    });
  }
  state.skills = [skill("601000", { endTime: ready, startTime: ready, stat: 0 })];
  expect(project()[0]!.skills[0]).toMatchObject({
    startTime: 0n,
    endTime: 0n,
    actTime: 9007199254740993n,
    stat: 0,
  });
  state.skills = [skill("601000", { startTime: ready, endTime: BigInt(now + 5001) })];
  expect(project()[0]!.skills[0]).toMatchObject({
    startTime: 0n,
    endTime: BigInt(now + 5001),
    stat: 0,
  });
});

test("duplicate initiative skills keep the last expiry-ordered record and deterministic UUID ties", () => {
  const { state, skill, project } = fixture();
  state.skills = [
    skill("601000", { uuid: "z", endTime: BigInt(now + 9000), param1: 9 }),
    skill("601000", { uuid: "a", endTime: BigInt(now + 8000), param1: 8 }),
    skill("601000", { uuid: "b", endTime: BigInt(now + 9000), param1: 7 }),
  ];
  expect(project()[0]!.skills).toHaveLength(1);
  expect(project()[0]!.skills[0]).toMatchObject({ uuid: "z", param1: 9 });
});

test("all persisted initiative kinds loaded by the legacy general manager have public previews", () => {
  const { state, rules, skill, project } = fixture();
  const ids = [
    "601000",
    "602700",
    "610700",
    "612000",
    "622300",
    "11612400",
    "621900",
    "622000",
    "622100",
    "622200",
    "603100",
    "612400",
    "622700",
    "622800",
    "622900",
  ];
  for (const id of ids) rules.power.generalSkills!.set(id, { cd_time: "12" });
  state.skills = ids.map((id) => skill(id));
  expect(
    project()[0]!
      .skills.map((row) => row.skillId)
      .sort(),
  ).toEqual(ids.toSorted());
});

test("preview injection follows the first raw tree and keeps null and absent trees empty", () => {
  const { general, project } = fixture();
  general.ability = Buffer.from('[{"ids":["ignored"]},{"id":"50001","620700":1,"622300":2}]');
  expect(project()[0]!.ability).toEqual([{ id: "50001", "622300": 2 }]);
  for (const ability of [null, Buffer.from("[]")]) {
    general.ability = ability;
    expect(project()[0]!.ability).toEqual([]);
  }
});

test("invalid rescue prerequisites clear the projected trees while preserving persisted data", () => {
  const { general, rules, project } = fixture();
  for (const [attack, defence, health, reset] of [
    [19, 20, 20, true],
    [20, 19, 19, true],
    [20, 20, 19, false],
    [20, 19, 20, false],
  ] as const) {
    general.ability = Buffer.from(
      JSON.stringify([
        { id: "50000", "602700": 1, "601300": attack, "601100": defence, "601200": health },
      ]),
    );
    expect(project()[0]!.ability).toHaveLength(reset ? 0 : 1);
    expect((general.ability as Buffer).length).toBeGreaterThan(0);
  }
  rules.power.generalSkills!.set("601300", { max_lv: "5" });
  general.ability = Buffer.from('[{"id":"50000","602700":1,"601300":5,"601100":20}]');
  expect(project()[0]!.ability).toHaveLength(1);
  general.ability = Buffer.from('[{"id":"50000","ids":[],"602700":1},{"id":"other","600001":2}]');
  expect(project()[0]!.ability).toEqual([]);
});

test("general attributes preserve float rounding at each operation and Java integer saturation", () => {
  const { general, rules, project } = fixture();
  general.level = 16777217;
  rules.items.set("hero_up", { k1: "1", k2: "1" });
  rules.power.generals!.set("1001", { attack: "1", defence: "1" });
  expect(project()[0]!.attack).toBe(16777216);
  rules.power.generals!.set("1001", { attack: "1e30", defence: "-1e30" });
  expect(project()[0]).toMatchObject({ attack: 2147483647, defence: -2147483648 });
  general.level = 0;
  rules.items.set("hero_up", { k1: "0", k2: "0" });
  rules.power.generals!.set("1001", { attack: "1e50", defence: "1e50" });
  expect(project()[0]).toMatchObject({ attack: 0, defence: 0 });
});

test("malformed abilities and unresolvable general state reject without exposing stored content", () => {
  for (const raw of [
    "[]",
    Buffer.from("{}"),
    Buffer.from("[null]"),
    Buffer.from('[{"id":1}]'),
    Buffer.from('[{"600001":1.5}]'),
    Buffer.from('[{"600001":2147483648}]'),
    Buffer.from('[{"600001":"2"}]'),
    Buffer.from('[{"private":"secret"}]'),
    Buffer.alloc(65536),
  ])
    expect(() => decodeGeneralAbilities(raw)).toThrow();
  expect(() => decodeGeneralAbilities(Buffer.from('[{"private":"secret"}]'))).toThrow("102192");
  for (const change of [
    ({ rules }: ReturnType<typeof fixture>) => rules.power.generals!.clear(),
    ({ rules }: ReturnType<typeof fixture>) => rules.items.clear(),
    ({ rules }: ReturnType<typeof fixture>) => rules.power.generalSkills!.clear(),
    ({ state }: ReturnType<typeof fixture>) => {
      state.generals = [];
    },
    ({ state, general }: ReturnType<typeof fixture>) => {
      state.generals = [general, general];
    },
    ({ state, skill }: ReturnType<typeof fixture>) => {
      state.skills = [skill("601000", { ownerId: "other" })];
    },
    ({ state, skill }: ReturnType<typeof fixture>) => {
      state.skills = [skill("601000", { endTime: null })];
    },
  ]) {
    const data = fixture();
    change(data);
    expect(data.project).toThrow();
  }
});
