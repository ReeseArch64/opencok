import { expect, test } from "bun:test";
import { mkdtemp, writeFile, truncate, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { NicknameWordFilter, loadNicknameWordFilter } from "../src/nickname-words.ts";

test("nickname filtering stays locked during an asynchronous resource load", async () => {
  let finish!: (value: string[]) => void;
  const filter = new NicknameWordFilter(
    () =>
      new Promise<string[]>((resolve) => {
        finish = resolve;
      }),
  );
  expect(filter.contains("clear")).toBe(false);
  const loading = filter.reload();
  expect(filter.contains("clear")).toBe(true);
  expect(filter.contains("")).toBe(true);
  finish(["blocked", "中文"]);
  await loading;
  expect(filter.contains("clear")).toBe(false);
  expect(filter.contains("BLOCKED")).toBe(true);
  expect(filter.contains("中 文")).toBe(true);
});

test("reloads append entries and remove only the first space and v from the combined list", async () => {
  let content = ["old", "v", "v", " ", " "];
  const filter = new NicknameWordFilter(async () => content);
  await filter.reload();
  expect(filter.contains("old")).toBe(true);
  expect(filter.contains("v")).toBe(true);
  expect(filter.contains(" ")).toBe(true);
  content = ["new"];
  await filter.reload();
  expect(filter.contains("old")).toBe(true);
  expect(filter.contains("new")).toBe(true);
  expect(filter.contains("v")).toBe(false);
  expect(filter.contains(" ")).toBe(false);
});

test("failed reads unlock and preserve the previous list including an initially empty list", async () => {
  let failure = true;
  const filter = new NicknameWordFilter(async () => {
    if (failure) throw new Error("Synthetic read failure");
    return ["blocked"];
  });
  await filter.reload();
  expect(filter.contains("blocked")).toBe(false);
  failure = false;
  await filter.reload();
  expect(filter.contains("blocked")).toBe(true);
  failure = true;
  await filter.reload();
  expect(filter.contains("blocked")).toBe(true);
  expect(filter.contains("clear")).toBe(false);
});

test("overlapping legacy reloads share one lock flag and append in completion order", async () => {
  const pending: ((value: string[]) => void)[] = [];
  const filter = new NicknameWordFilter(
    () => new Promise<string[]>((resolve) => pending.push(resolve)),
  );
  const first = filter.reload(),
    second = filter.reload();
  expect(filter.contains("clear")).toBe(true);
  pending[0]!(["one"]);
  await first;
  expect(filter.contains("one")).toBe(true);
  expect(filter.contains("clear")).toBe(false);
  pending[1]!(["two"]);
  await second;
  expect(filter.contains("one")).toBe(true);
  expect(filter.contains("two")).toBe(true);
  expect(filter.contains("clear")).toBe(false);
});

test("JSON loading preserves Unicode, BOM characters, whitespace and literal delimiters", async () => {
  const root = await mkdtemp(join(tmpdir(), "opencok-nickname-"));
  try {
    const path = join(root, "badwords.json");
    await writeFile(
      path,
      JSON.stringify(["\ufeffalpha", "BETA", "中文", " padded ", "a,b", "a\nb"]),
    );
    const filter = await loadNicknameWordFilter(path);
    expect(filter.contains("alpha")).toBe(false);
    expect(filter.contains("\ufeffalpha")).toBe(true);
    expect(filter.contains("beta")).toBe(true);
    expect(filter.contains("中 文")).toBe(true);
    expect(filter.contains("padded")).toBe(false);
    expect(filter.contains(" padded ")).toBe(true);
    expect(filter.contains("a,b")).toBe(true);
    expect(filter.contains("a\nb")).toBe(true);
    expect(filter.contains("a")).toBe(false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("missing, malformed, mistyped and oversized JSON retain the previous filter on reload", async () => {
  const root = await mkdtemp(join(tmpdir(), "opencok-nickname-"));
  try {
    const path = join(root, "badwords.json");
    const empty = await loadNicknameWordFilter(path);
    expect(empty.contains("blocked")).toBe(false);
    await writeFile(path, JSON.stringify(["blocked"]));
    const filter = await loadNicknameWordFilter(path);
    for (const content of ["{", "null", "{}", '["new", 1]', '["new", null]', '["new", {}]']) {
      await writeFile(path, content);
      await filter.reload();
      expect(filter.contains("blocked")).toBe(true);
      expect(filter.contains("new")).toBe(false);
      expect(filter.contains("clear")).toBe(false);
    }
    await truncate(path, 16 * 1024 * 1024 + 1);
    await filter.reload();
    expect(filter.contains("blocked")).toBe(true);
    await rm(path);
    await filter.reload();
    expect(filter.contains("blocked")).toBe(true);
    await writeFile(path, "[]");
    await filter.reload();
    expect(filter.contains("blocked")).toBe(true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the bundled JSON loads without an external resources directory and reaches reserved-name reads", async () => {
  const calls: string[] = [];
  await loadNicknameWordFilter(undefined, async (key) => {
    calls.push(key);
    return [];
  });
  expect(calls).toEqual(
    ["regular", "strict", "pattern", "weight", "name"].map((kind) => `forbidden_words_${kind}`),
  );
});
