import { expect, test } from "bun:test";
import { mailDeleteGroups, mailDeleteQuery } from "@opencok/rules/mail";
import { planMailDeletion } from "@opencok/services/mail-delete";
import type { MailDeleteEntry } from "@opencok/contracts/mail";

const now = 1792756800000;
function entry(type: number, uid = "mail", fromUser: string | null = "sender"): MailDeleteEntry {
  return { uid, type, fromUser, contents: null, extra: null };
}

test("ordinary deletion keeps comma split semantics, preserves whitespace IDs and bounds requests", () => {
  expect(mailDeleteQuery(",a,,b,a, c ,", now)).toEqual({ ids: ["a", "b", " c "], now });
  expect(mailDeleteQuery(" \t", now).ids).toEqual([" \t"]);
  expect(mailDeleteQuery(",,", now).ids).toEqual([]);
  expect(mailDeleteQuery("", now).ids).toEqual([]);
  for (const value of ["x".repeat(41), "\0", "\ud800", "a,".repeat(1001), ",".repeat(65536)])
    expect(() => mailDeleteQuery(value, now)).toThrow();
  for (const time of [-1, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() => mailDeleteQuery("a", time)).toThrow();
});

test("deletion group rules retain all direct, sender and type groups and their media distinctions", () => {
  const direct = [2, 11, 12, 17, 25, 26, 27, 28, 29, 33, 34];
  for (const type of direct)
    expect(mailDeleteGroups([entry(type)])).toEqual([
      { groupType: type, groupIndex: "mail", types: [] },
    ]);
  for (const type of [20, 21, 22])
    expect(mailDeleteGroups([entry(type)])).toEqual([
      { groupType: 100, groupIndex: "sender", fromUser: "sender", types: [20, 21, 22] },
    ]);
  for (const type of [23, 24, 39, 40])
    expect(mailDeleteGroups([entry(type)])).toEqual([
      { groupType: 500, groupIndex: "sender", fromUser: "sender", types: [23, 24] },
    ]);
  for (const [type, groupType] of [
    [5, 200],
    [10, 400],
    [18, 300],
  ] as const)
    expect(mailDeleteGroups([entry(type)])).toEqual([{ groupType, groupIndex: "", types: [type] }]);
  for (const type of [6, 7, 8, 13, 14, 15, 16, 30, 32, 37, 38, 43, 44, 45, 46, 99])
    expect(mailDeleteGroups([entry(type)])).toEqual([]);
  expect(
    mailDeleteGroups([entry(21, "a"), entry(22, "b"), entry(20, "c"), entry(21, "d", null)]),
  ).toEqual([{ groupType: 100, groupIndex: "sender", fromUser: "sender", types: [20, 21, 22] }]);
  expect(mailDeleteGroups([entry(23, "a", ""), entry(40, "b", "")])).toEqual([
    { groupType: 500, groupIndex: "", fromUser: "", types: [23, 24] },
  ]);
});

test("move invitations use exact owned recipients and decode inline or persisted extra JSON", () => {
  const inline = {
    ...entry(26),
    contents: Buffer.from(
      '\0 {"inviterUid":"host","inviteeUid":"self","counter":9007199254740993} \0',
    ),
  };
  const extra = {
    ...entry(26, "extra"),
    contents: Buffer.from(" ExTrA\0"),
    extra: Buffer.from('{"inviterUid":"other-host","inviteeUid":"self"}'),
  };
  expect(planMailDeletion("self", [inline, inline, extra]).inviters).toEqual([
    "host",
    "other-host",
  ]);
  for (const contents of [
    Buffer.from('{"inviterUid":"host","inviteeUid":"other"}'),
    Buffer.from('{"inviterUid":123,"inviteeUid":"self"}'),
    Buffer.from('{"inviterUid":"","inviteeUid":"self"}'),
    Buffer.from("[]"),
    Buffer.from("null"),
    Buffer.from("broken"),
    Buffer.from([255]),
    Buffer.from("extra"),
    Buffer.alloc(65536, 32),
  ])
    expect(planMailDeletion("self", [{ ...entry(26), contents }]).inviters).toEqual([]);
  for (const inviterUid of [" ", "a\0b", "\ud800", "x".repeat(256)])
    expect(
      planMailDeletion("self", [
        { ...entry(26), contents: Buffer.from(JSON.stringify({ inviterUid, inviteeUid: "self" })) },
      ]).inviters,
    ).toEqual([]);
  expect(planMailDeletion("self", [{ ...inline, type: 2 }]).inviters).toEqual([]);
});
