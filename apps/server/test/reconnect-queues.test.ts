import { expect, test } from "bun:test";
import { reconnectQueues } from "@opencok/mappings/reconnect";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import type { Row } from "@opencok/contracts/rows";

const rules = new Rules(new Map(), new Map(), new Map());
const project = (rows: Row[], buildings: Row[] = [], equipment: Row[] = []) =>
  (
    decode(encode(reconnectQueues(rows, buildings, equipment, rules, 1000))).queue!.value as Value[]
  ).map(fields);

test("reconnect projects every queue family without completing elapsed activities", () => {
  const rows = Array.from({ length: 42 }, (_, type) => ({
    uuid: `q${type}`,
    type,
    itemId: "owned-target",
    qid: type,
    startTime: 1n,
    endTime: 2n,
    updateTime: 3n,
    totalTime: 0n,
    isHelped: 1,
  }));
  const before = structuredClone(rows);
  const values = project(rows, [], [{ uuid: "owned-target", itemId: 12345, cost: "wood;7" }]);
  expect(values).toHaveLength(42);
  for (const [type, value] of values.entries()) {
    const item = fields(value.itemObj);
    if (type === 0) expect(item).toEqual({});
    else if ([1, 8, 9, 10, 17].includes(type))
      expect(item).toEqual({
        itemId: sfs.string("owned-target"),
        allId: sfs.string("owned-target"),
      });
    else if (type === 11)
      expect(item).toEqual({ itemId: sfs.string("12345"), cost: sfs.string("wood;7") });
    else if (type === 12)
      expect(item).toEqual({
        itemId: sfs.string("owned-target"),
        para: sfs.int(0),
        allId: sfs.string("owned-target"),
      });
    else expect(item).toEqual({ itemId: sfs.string("owned-target") });
    expect(value.updateTime).toEqual(sfs.long(3n));
    expect(value.totalTime).toEqual(sfs.long(2n));
    expect(value.isHelped).toEqual(sfs.int(1));
  }
  expect(rows).toEqual(before);
});

test("queue timestamps retain Long sentinels and wrapped subtraction", () => {
  const [value] = project([
    {
      uuid: "q",
      type: 0,
      startTime: -1n,
      endTime: 9223372036854775807n,
      updateTime: 9223372036854775807n,
    },
  ]);
  expect(value!.endTime).toEqual(sfs.long(0n));
  expect(value!.updateTime).toEqual(sfs.long(0n));
  expect(value!.startTime).toEqual(sfs.long(-1n));
  expect(value!.totalTime).toEqual(sfs.long(-9223372036854775808n));
});

test("training and prop queues preserve Java tokenization and selection failures", () => {
  const item = (type: number, itemId: string, para = 0) =>
    fields(project([{ uuid: "q", type, itemId, para }])[0]!.itemObj);
  expect(item(1, "||army;5|other;7")).toEqual({
    itemId: sfs.string("army"),
    allId: sfs.string("||army;5|other;7"),
  });
  expect(item(1, "||").itemId).toEqual(sfs.string(""));
  expect(() => item(1, ";;")).toThrow();
  expect(item(12, ";a;;b;", 1).itemId).toEqual(sfs.string("b"));
  expect(item(12, ";a;;b;", 5).itemId).toEqual(sfs.string("a"));
  expect(() => item(12, "a;b", -1)).toThrow();
  expect(() => item(12, ";;")).toThrow();
  expect(item(11, "missing")).toEqual({});
  expect(item(99, "\u2000")).toEqual({});
  expect(() => item(99, "item")).toThrow();
});

test("reconnect queue state rejects duplicates and unrepresentable persisted integers", () => {
  expect(() => project([{ uuid: "q" }, { uuid: "q" }])).toThrow();
  for (const key of ["qid", "type", "isHelped"])
    expect(() => project([{ uuid: "q", [key]: 2147483648 }])).toThrow();
  for (const key of ["startTime", "endTime", "updateTime", "totalTime"])
    expect(() => project([{ uuid: "q", [key]: 9223372036854775808n }])).toThrow();
  expect(() => project(Array.from({ length: 32768 }, (_, i) => ({ uuid: String(i) })))).toThrow();
});
