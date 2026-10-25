import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readAvatarGrant } from "@opencok/repositories/avatar-grant";
import type { AvatarGrantReaders } from "@opencok/contracts/files";

const now = 1792756800000;
const grant = { owner: "1001", sequence: 5, grant: "synthetic", pendingHash: "" };
function database(
  options: {
    profile?: unknown[] | null;
    castles?: unknown[][];
    record?: unknown[] | null;
    fail?: string;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      const source = text.includes('from "opencok_kingdom"."userprofile"')
        ? "profile"
        : text.includes('from "opencok_kingdom"."user_building"')
          ? "castle"
          : text.includes('from "opencok_kingdom"."pic_upload_record"')
            ? "record"
            : text;
      if (source === options.fail) throw new Error("Synthetic dependency failure");
      if (source === "profile")
        return {
          rows: options.profile === null ? [] : [options.profile ?? ["1001", 1, "0", 0, 1000004]],
        };
      if (source === "castle") return { rows: options.castles ?? [["1001", 10]] };
      if (source === "record") return { rows: options.record ? [options.record] : [] };
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("avatar grant reads the durable owned profile under lock and exposes only bounded owned readers", async () => {
  const fixture = database({ record: ["1001", "9007199254740993", "0"] });
  const result = await readAvatarGrant(fixture.db, 1, "1001", now, async (profile, readers) => {
    expect(profile.picVer).toBe(1000004);
    expect(await readers.castleLevel()).toBe(10);
    expect(await readers.uploadRecord()).toEqual({
      uid: "1001",
      updateTime: 9007199254740993n,
      banTime: 0n,
    });
    return grant;
  });
  expect(result.grant).toEqual(grant);
  expect(fixture.queries.map(({ text }) => text.split(" ")[0])).toEqual([
    "begin",
    "select",
    "select",
    "select",
    "select",
    "commit",
  ]);
  expect(fixture.queries[0]!.text).toBe("begin isolation level repeatable read read write");
  expect(fixture.queries[1]!.text).toEndWith("limit $2 for update");
  expect(fixture.queries[1]!.params).toEqual(["1001", 1]);
  expect(fixture.queries[2]!.params).toEqual(["1001", 400000, 2]);
  expect(fixture.queries[3]!.params).toEqual(["1001", 1]);
  expect(fixture.queries[2]!.text).toContain('"user_building"."uid" = $1');
  expect(fixture.queries[2]!.text).toContain('"user_building"."itemId" = $2');
  expect(fixture.queries[3]!.text).toContain('"pic_upload_record"."uid" = $1');
  expect(fixture.queries.map(({ text }) => text).join("\n")).not.toMatch(
    /insert |^update |delete |"star"|"contents"|"gold"/m,
  );
});

test("unauthorized or missing profiles cannot run the issuer or read eligibility state", async () => {
  for (const profile of [
    null,
    ["other", 1, "0", 0, 0],
    ["1001", 2, "0", 0, 0],
    ["1001", 1, "0", 1, 0],
    ["1001", 1, String(now + 1), 0, 0],
  ]) {
    const fixture = database({ profile });
    let inspected = false;
    const result = await readAvatarGrant(fixture.db, 1, "1001", now, async () => {
      inspected = true;
      return grant;
    });
    expect(inspected).toBe(false);
    expect(result.grant).toBeUndefined();
    expect(fixture.queries).toHaveLength(3);
  }
  const bypass = database();
  await readAvatarGrant(bypass.db, 1, "1001", now, async () => grant);
  expect(bypass.queries).toHaveLength(4);
  const absent = database({ castles: [] });
  await readAvatarGrant(absent.db, 1, "1001", now, async (_profile, readers) => {
    expect(await readers.castleLevel()).toBe(0);
    expect(await readers.uploadRecord()).toBeUndefined();
    return grant;
  });
});

test("ambiguous state, escaped readers and transaction failures cannot return successful grants", async () => {
  for (const options of [
    {
      castles: [
        ["1001", 10],
        ["1001", 12],
      ],
    },
    { castles: [["other", 10]] },
    { record: ["other", "0", "0"] },
    ...["profile", "castle", "record", "commit"].map((fail) => ({ fail })),
  ]) {
    const fixture = database(options);
    await expect(
      readAvatarGrant(fixture.db, 1, "1001", now, async (_profile, readers) => {
        await readers.castleLevel();
        await readers.uploadRecord();
        return grant;
      }),
    ).rejects.toThrow();
    expect(fixture.queries.at(-1)!.text).toBe("rollback");
  }
  const repeated = database();
  await expect(
    readAvatarGrant(repeated.db, 1, "1001", now, async (_profile, readers) => {
      await readers.castleLevel();
      await readers.castleLevel();
      return grant;
    }),
  ).rejects.toThrow("Invalid avatar castle read");
  let escaped: AvatarGrantReaders | undefined;
  const fixture = database();
  await readAvatarGrant(fixture.db, 1, "1001", now, async (_profile, readers) => {
    escaped = readers;
    return grant;
  });
  await expect(escaped!.castleLevel()).rejects.toThrow();
  await expect(escaped!.uploadRecord()).rejects.toThrow();
  expect(fixture.queries).toHaveLength(4);
  const failed = database();
  await expect(
    readAvatarGrant(failed.db, 1, "1001", now, async () => {
      throw new Error("Synthetic HTTP failure");
    }),
  ).rejects.toThrow();
  expect(failed.queries.at(-1)!.text).toBe("rollback");
});

test("invalid direct avatar store callers reject before database work", () => {
  const fixture = database();
  for (const owner of ["", "other", "1".repeat(21), "1\0"])
    expect(() => readAvatarGrant(fixture.db, 1, owner, now, async () => grant)).toThrow();
  for (const realm of [0, 1.5, 2147483648])
    expect(() => readAvatarGrant(fixture.db, realm, "1001", now, async () => grant)).toThrow();
  for (const time of [-1, NaN, Number.MAX_SAFE_INTEGER + 1])
    expect(() => readAvatarGrant(fixture.db, 1, "1001", time, async () => grant)).toThrow();
  expect(fixture.queries).toEqual([]);
});
