import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdomSchema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import { relayMailGiftOpenings } from "@opencok/repositories/mail-gift-relay";

const sent = 9007199254740993n;
const opened = 1792756800000n;
function databases() {
  const options = { fail: "" };
  const queries: { role: string; text: string; params: unknown[] }[] = [];
  let pending = [
    { mailUid: "gift", sendTime: sent, toUser: "self", openedAt: opened },
    { mailUid: "foreign", sendTime: sent, toUser: "self", openedAt: opened + 1n },
    { mailUid: "missing", sendTime: sent, toUser: "self", openedAt: opened + 2n },
  ];
  let logs = [
    {
      uid: "gift",
      sendTime: sent,
      toUid: "self",
      isOpened: 0,
      receiveTime: 0n,
      isRewarded: 0,
      isThanks: 0,
    },
    {
      uid: "foreign",
      sendTime: sent,
      toUid: "other",
      isOpened: 0,
      receiveTime: 0n,
      isRewarded: 0,
      isThanks: 0,
    },
    {
      uid: "gift",
      sendTime: sent + 1n,
      toUid: "self",
      isOpened: 0,
      receiveTime: 0n,
      isRewarded: 0,
      isThanks: 0,
    },
  ];
  let pendingBefore: typeof pending | undefined;
  let logsBefore: typeof logs | undefined;
  const client = (role: "kingdom" | "global") => ({
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ role, text, params });
      if (text.startsWith("begin")) {
        if (role === "kingdom") {pendingBefore = structuredClone(pending);}
        else {logsBefore = structuredClone(logs);}
      }
      if (text === "rollback") {
        if (role === "kingdom" && pendingBefore) {pending = pendingBefore;}
        if (role === "global" && logsBefore) {logs = logsBefore;}
      }
      if (role === "kingdom" && text.startsWith("select")) {
        if (options.fail === "read") {throw new Error("Synthetic pending read failure");}
        return {
          rows: pending
            .slice(0, params[0] as number)
            .map((entry) => [
              entry.mailUid,
              String(entry.sendTime),
              entry.toUser,
              String(entry.openedAt),
            ]),
        };
      }
      if (role === "global" && text.startsWith("update")) {
        if (
          options.fail === "update" ||
          (options.fail === "second update" && params[2] === "foreign")
        )
          {throw new Error("Synthetic global update failure");}
        const [isOpened, receiveTime, uid, sendTime, owner] = params;
        for (const log of logs)
          {if (
            log.uid === uid &&
            log.sendTime === BigInt(sendTime as string) &&
            log.toUid === owner
          ) {
            log.isOpened = isOpened as number;
            log.receiveTime = BigInt(receiveTime as string);
          }}
      }
      if (role === "global" && text === "commit" && options.fail === "global commit") {
        logsBefore = undefined;
        throw new Error("Synthetic ambiguous global commit");
      }
      if (role === "kingdom" && text.startsWith("delete")) {
        if (options.fail === "ack") {throw new Error("Synthetic acknowledgment failure");}
        for (let i = 0; i < params.length; i += 4)
          {pending = pending.filter(
            (entry) =>
              entry.mailUid !== params[i] ||
              entry.sendTime !== BigInt(params[i + 1] as string) ||
              entry.toUser !== params[i + 2] ||
              entry.openedAt !== BigInt(params[i + 3] as string),
          );}
      }
      if (role === "kingdom" && text === "commit" && options.fail === "realm commit")
        {throw new Error("Synthetic realm commit failure");}
      return { rows: [] };
    },
  });
  return {
    kingdom: drizzle(client("kingdom") as unknown as NodePgClient, { schema: kingdomSchema }),
    global: drizzle(client("global") as unknown as NodePgClient, { schema: globalSchema }),
    options,
    queries,
    state: () => ({ pending, logs }),
  };
}

test("gift relay locks a bounded realm batch and updates only matching global log identities before acknowledging", async () => {
  const { kingdom, global, queries, state } = databases();
  expect(await relayMailGiftOpenings(kingdom, global, 1)).toBe(1);
  expect(state().pending).toHaveLength(2);
  expect(state().logs[0]).toEqual({
    uid: "gift",
    sendTime: sent,
    toUid: "self",
    isOpened: 1,
    receiveTime: opened,
    isRewarded: 0,
    isThanks: 0,
  });
  const read = queries[1]!;
  expect(read.params).toEqual([1]);
  expect(read.text).toContain('order by "opencok_kingdom"."mail_gift_opening"."openedAt" asc');
  expect(read.text).toEndWith("limit $1 for update skip locked");
  const update = queries.find(
    (entry) => entry.role === "global" && entry.text.startsWith("update"),
  )!;
  expect(update.params).toEqual([1, opened, "gift", sent, "self"]);
  for (const column of ["uid", "sendTime", "toUid"])
    {expect(update.text).toContain(`"mail_gift_log"."${column}" =`);}
  expect(update.text).not.toMatch(/isRewarded|isThanks|contents|rewards/);
  const globalCommit = queries.findIndex(
    (entry) => entry.role === "global" && entry.text === "commit",
  );
  const ack = queries.findIndex((entry) => entry.text.startsWith("delete"));
  expect(globalCommit).toBeLessThan(ack);
  expect(queries[ack]?.params).toEqual(["gift", sent, "self", opened]);
  expect(queries.at(-1)).toEqual({ role: "kingdom", text: "commit", params: [] });
  expect(await relayMailGiftOpenings(kingdom, global)).toBe(2);
  expect(
    state()
      .logs.slice(1)
      .map((entry) => entry.isOpened),
  ).toEqual([0, 0]);
  expect(state().pending).toEqual([]);
  const beforeEmpty = queries.length;
  expect(await relayMailGiftOpenings(kingdom, global)).toBe(0);
  expect(queries.slice(beforeEmpty).every((entry) => entry.role === "kingdom")).toBe(true);
  expect(queries.some((entry) => entry.text.startsWith("insert"))).toBe(false);
});

test("gift relay retains pending openings after dependency and acknowledgment failures; replay preserves exact values", async () => {
  for (const fail of ["read", "update", "second update", "global commit", "ack", "realm commit"]) {
    const { kingdom, global, options, queries, state } = databases();
    options.fail = fail;
    const before = structuredClone(state());
    await expect(relayMailGiftOpenings(kingdom, global)).rejects.toThrow();
    expect(state().pending).toEqual(before.pending);
    expect(queries.at(-1)).toEqual({ role: "kingdom", text: "rollback", params: [] });
    if (["read", "update", "second update"].includes(fail))
      {expect(state().logs).toEqual(before.logs);}
    else {expect(state().logs[0]?.receiveTime).toBe(opened);}
    options.fail = "";
    expect(await relayMailGiftOpenings(kingdom, global)).toBe(3);
    expect(state().pending).toEqual([]);
    expect(state().logs[0]?.receiveTime).toBe(opened);
    expect(state().logs[0]?.sendTime).toBe(sent);
    expect(state().logs.slice(1)).toEqual(before.logs.slice(1));
    expect(await relayMailGiftOpenings(kingdom, global)).toBe(0);
  }
});

test("gift relay rejects invalid batch bounds without opening transactions", () => {
  const { kingdom, global, queries } = databases();
  for (const limit of [0, -1, 1.5, NaN, 1001])
    {expect(() => relayMailGiftOpenings(kingdom, global, limit)).toThrow();}
  expect(queries).toEqual([]);
});
