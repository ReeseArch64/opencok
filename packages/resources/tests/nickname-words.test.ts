import { expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile, truncate, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { NicknameWordFilter, loadNicknameWordFilter } from "../src/nickname-words.ts";

test("nickname filtering stays locked during an asynchronous resource load", async () => {
  let finish!: (value: string) => void;
  const filter = new NicknameWordFilter(
    () =>
      new Promise<string>((resolve) => {
        finish = resolve;
      }),
  );
  expect(filter.contains("clear")).toBe(false);
  const loading = filter.reload();
  expect(filter.contains("clear")).toBe(true);
  expect(filter.contains("")).toBe(true);
  finish("blocked,中文");
  await loading;
  expect(filter.contains("clear")).toBe(false);
  expect(filter.contains("BLOCKED")).toBe(true);
  expect(filter.contains("中 文")).toBe(true);
});

test("reloads append entries and remove only the first space and v from the combined list", async () => {
  let content = "old,v,v, , ";
  const filter = new NicknameWordFilter(async () => content);
  await filter.reload();
  expect(filter.contains("old")).toBe(true);
  expect(filter.contains("v")).toBe(true);
  expect(filter.contains(" ")).toBe(true);
  content = "new";
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
    return "blocked";
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
  const pending: ((value: string) => void)[] = [];
  const filter = new NicknameWordFilter(
    () => new Promise<string>((resolve) => pending.push(resolve)),
  );
  const first = filter.reload(),
    second = filter.reload();
  expect(filter.contains("clear")).toBe(true);
  pending[0]!("one");
  await first;
  expect(filter.contains("one")).toBe(true);
  expect(filter.contains("clear")).toBe(false);
  pending[1]!("two");
  await second;
  expect(filter.contains("one")).toBe(true);
  expect(filter.contains("two")).toBe(true);
  expect(filter.contains("clear")).toBe(false);
});

test("resource loading reads UTF-8 from the gameconfig sibling without trimming BOM or entries", async () => {
  const root = await mkdtemp(join(tmpdir(), "opencok-nickname-"));
  try {
    const resources = join(root, "resource");
    await mkdir(resources);
    await mkdir(join(root, "gameconfig"));
    await writeFile(join(root, "gameconfig", "badwords.txt"), "\ufeffalpha,BETA,中文\r\n padded ");
    await writeFile(join(resources, "badwords.txt"), "wrong");
    const filter = await loadNicknameWordFilter(resources);
    expect(filter.contains("alpha")).toBe(false);
    expect(filter.contains("\ufeffalpha")).toBe(true);
    expect(filter.contains("beta")).toBe(true);
    expect(filter.contains("中 文")).toBe(true);
    expect(filter.contains("padded")).toBe(false);
    expect(filter.contains(" padded ")).toBe(true);
    expect(filter.contains("wrong")).toBe(false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("missing and oversized word files follow the loader failure boundary without replacing saved entries", async () => {
  const root = await mkdtemp(join(tmpdir(), "opencok-nickname-"));
  try {
    const resources = join(root, "resource"),
      file = join(root, "gameconfig", "badwords.txt");
    const empty = await loadNicknameWordFilter(resources);
    expect(empty.contains("blocked")).toBe(false);
    await mkdir(join(root, "gameconfig"));
    await writeFile(file, "blocked");
    const filter = await loadNicknameWordFilter(resources);
    expect(filter.contains("blocked")).toBe(true);
    await truncate(file, 16 * 1024 * 1024 + 1);
    await filter.reload();
    expect(filter.contains("blocked")).toBe(true);
    expect(filter.contains("clear")).toBe(false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
