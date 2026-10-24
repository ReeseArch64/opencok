import { expect, test } from "bun:test";
import type { ReconnectBaseState } from "@opencok/contracts/reconnect";
import { reconnectOwnGenerals } from "@opencok/services/reconnect";
import { decodeGeneralAbilities } from "@opencok/services/profile";
import { Rules } from "@opencok/rules/game";
import { publicGeneralPreviews, reconnectGeneralRepairs } from "@opencok/rules/profile-generals";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";

const now = 1792756800000;
function fixture() {
  const general = {
    uuid: "a",
    generalId: "1001",
    level: 3,
    status: 1,
    abilityIndex: 2,
    ability: Buffer.from('[{"ids":"50001|50002","620700":3},{"id":"70000","600002":4}]'),
  };
  const skill = {
    uuid: "skill-a",
    ownerId: "synthetic",
    skillId: "622800",
    startTime: 1234n,
    endTime: BigInt(now + 5001),
    actTime: 9007199254740993n,
    stat: 2,
    param1: 3,
    param2: 4,
  };
  const state: ReconnectBaseState = {
    profile: { uid: "synthetic" },
    armies: [],
    generals: [general],
    skills: [skill],
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
      generalSkills: new Map([["622800", { cd_time: "0" }]]),
    },
  );
  const project = () => decode(encode(reconnectOwnGenerals(state, rules, now)));
  return { general, skill, state, rules, project };
}

test("own general reconnect retains pending ability choices and page index without public skill-point fields", () => {
  const { general, skill, state, rules, project } = fixture();
  const before = Buffer.from(general.ability);
  const result = project();
  expect(Object.keys(result)).toEqual(["userGenerals"]);
  const own = fields((result.userGenerals!.value as Value[])[0]);
  expect(own).toEqual({
    uuid: sfs.string("a"),
    generalId: sfs.string("1001"),
    level: sfs.int(3),
    status: sfs.int(1),
    att: sfs.int(10),
    defence: sfs.int(11),
    abilityIndex: sfs.int(2),
    ability: sfs.array([
      sfs.object({ ids: sfs.string("50001|50002"), "622800": sfs.int(1) }),
      sfs.object({ id: sfs.string("70000"), "600002": sfs.int(4) }),
    ]),
    skill: sfs.array([
      sfs.object({
        uuid: sfs.string("skill-a"),
        ownerId: sfs.string("synthetic"),
        skillId: sfs.string("622800"),
        startTime: sfs.long(1234n),
        endTime: sfs.long(now + 5001),
        actTime: sfs.long(9007199254740993n),
        stat: sfs.int(0),
        param1: sfs.int(3),
        param2: sfs.int(4),
      }),
    ]),
  });
  const preview = publicGeneralPreviews(
    state.generals,
    state.skills,
    new Map([["a", decodeGeneralAbilities(general.ability)]]),
    "synthetic",
    rules,
    now,
  )[0]!;
  expect(preview.ability).toEqual([{ id: "70000", "600002": 4 }]);
  expect(general.ability).toEqual(before);
  expect(skill.stat).toBe(2);
  expect(project()).toEqual(result);
});

test("own generals preserve hash traversal order and omit irrelevant public fields", () => {
  const { general, state, project } = fixture();
  state.generals = [
    { ...general, uuid: "b", abilityIndex: -2147483648, plusSkillPoint: "invalid-private-field" },
    general,
  ];
  const result = (project().userGenerals!.value as Value[]).map(fields);
  expect(result.map((item) => item.uuid)).toEqual([sfs.string("a"), sfs.string("b")]);
  expect(result[1]!.abilityIndex).toEqual(sfs.int(-2147483648));
  expect(result[1]).not.toHaveProperty("plusSkillPoint");
  expect(result[1]!.skill).toEqual(result[0]!.skill);
});

test("own general hydration preserves valid metadata and rejects malformed saved choices", () => {
  expect(decodeGeneralAbilities(Buffer.from('[{"ids":null,"id":null,"622800":1}]'), false)).toEqual(
    [{ ids: null, id: null, "622800": 1 }],
  );
  expect(decodeGeneralAbilities(null, false)).toEqual([]);
  const { general, project } = fixture();
  for (const raw of [
    '[{"ids":[]}]',
    '[{"ids":1}]',
    '[{"ids":{}}]',
    '[{"id":1}]',
    '[{"ids":"x","600001":2147483648}]',
    '[{"ids":"x","extra":"value"}]',
    "{}",
    "[null]",
    '[{"600001":1.5}]',
  ]) {
    general.ability = Buffer.from(raw);
    expect(project).toThrow("102192");
  }
  general.ability = Buffer.alloc(65536, 32);
  expect(project).toThrow("102192");
});

test("own reconnect projects legacy combat repair and cooldown readiness without mutating stored rows", () => {
  const { general, skill, state, project } = fixture();
  general.ability = Buffer.from('[{"id":"50000","602700":1,"601300":19},{"ids":"50001|50002"}]');
  skill.endTime = BigInt(now + 5000);
  const result = fields((project().userGenerals!.value as Value[])[0]);
  expect(result.ability).toEqual(sfs.array());
  const saved = fields((result.skill!.value as Value[])[0]);
  expect(saved.startTime).toEqual(sfs.long(0));
  expect(saved.endTime).toEqual(sfs.long(0));
  expect(saved.actTime).toEqual(sfs.long(9007199254740993n));
  expect(skill.startTime).toBe(1234n);
  expect(state.generals[0]!.ability).toEqual(general.ability);
});

test("empty own generals remain an empty collection and required profile or catalog failures reject", () => {
  const { general, state, rules, project } = fixture();
  state.generals = [];
  expect(project()).toEqual({ userGenerals: sfs.array() });
  state.generals = [general];
  general.abilityIndex = 2147483648;
  expect(project).toThrow();
  general.abilityIndex = 2;
  state.skills = [{ ...state.skills[0]!, ownerId: "another-owner" }];
  expect(project).toThrow();
  state.skills = [];
  rules.power.generals!.clear();
  expect(project).toThrow();
  state.profile = undefined;
  expect(project).toThrow();
});

test("reconnect persists only invalid ability trees, disabled supported skills and elapsed cooldowns", () => {
  const { general, skill, rules } = fixture();
  const abilities = new Map<string, readonly import("@opencok/contracts/profile").GeneralAbility[]>(
    [[general.uuid, [{ id: "50000", "602700": 1, "601300": 19 }]]],
  );
  const skills = [
    skill,
    { ...skill, uuid: "unknown", skillId: "unknown", endTime: BigInt(now) },
    { ...skill, uuid: "ready", endTime: 9223372036854775807n, stat: 3 },
  ];
  const plan = () => reconnectGeneralRepairs([general], skills, abilities, "synthetic", rules, now);
  expect(plan()).toEqual({
    generalResets: ["a"],
    skillResets: ["skill-a"],
    skillCooldownResets: ["unknown"],
  });
  skill.endTime = BigInt(now + 5000);
  expect(plan().skillCooldownResets).toEqual(["skill-a", "unknown"]);
  abilities.set("a", [{ id: "50000", "602700": 1, "601300": 20, "601100": 20 }]);
  expect(plan().generalResets).toEqual([]);
  expect(reconnectGeneralRepairs([], skills, abilities, "synthetic", rules, now)).toEqual({
    generalResets: [],
    skillResets: [],
    skillCooldownResets: [],
  });
  expect(skill.stat).toBe(2);
  skills.push({ ...skill });
  expect(plan).toThrow();
});
