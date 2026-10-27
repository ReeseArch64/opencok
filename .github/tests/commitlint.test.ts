import { afterEach, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const project = resolve(import.meta.dir, "../..");
const directories: string[] = [];
const zero = "0".repeat(40);

function repository() {
  const directory = mkdtempSync(join(tmpdir(), "opencok-commitlint-"));
  directories.push(directory);
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: directory, encoding: "utf8" }).trim();
  git("init", "--quiet", "--initial-branch=develop");
  git("config", "user.name", "CI Fixture");
  git("config", "user.email", "ci-fixture@example.invalid");
  git("config", "commit.gpgsign", "false");
  git("config", "core.hooksPath", "/dev/null");
  const commit = (message: string) => {
    git("commit", "--quiet", "--allow-empty", "-m", message);

    return git("rev-parse", "HEAD");
  };
  const inherited = commit("historical message outside the proposed change");
  git("update-ref", "refs/remotes/origin/develop", inherited);
  git("checkout", "--quiet", "-b", "feat/example");
  const bin = join(directory, "bin");
  mkdirSync(bin);
  writeFileSync(
    join(bin, "bunx"),
    '#!/usr/bin/env bash\nshift\nexec "$COMMITLINT_EXECUTABLE" --config "$COMMITLINT_CONFIG" "$@"\n',
    { mode: 0o755 },
  );
  const validate = (base = zero, event = "push") =>
    spawnSync("bash", [join(project, ".github/scripts/commitlint.sh")], {
      cwd: directory,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        BASE_SHA: base,
        EVENT_NAME: event,
        DEFAULT_BRANCH: "develop",
        COMMITLINT_EXECUTABLE: join(project, "node_modules/.bin/commitlint"),
        COMMITLINT_CONFIG: join(project, "commitlint.config.cjs"),
      },
    });

  return { git, commit, inherited, validate };
}

afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

test("first branch push checks every branch commit without replaying inherited history", () => {
  const repo = repository();
  repo.commit("refactor(app): introduce named dragons");
  repo.commit("fix(ci): scope commit validation");
  const result = repo.validate();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain("introduce named dragons");
  expect(result.stdout).toContain("scope commit validation");
  expect(result.stdout).not.toContain("historical message");
});

test("first push still rejects an invalid earlier branch commit when its tip is valid", () => {
  const repo = repository();
  repo.commit("invalid newly introduced message");
  repo.commit("fix(ci): valid tip");
  expect(repo.validate().status).not.toBe(0);
});

test("ordinary pushes validate only the newly pushed range", () => {
  const repo = repository();
  const previous = repo.commit("already published nonconforming message");
  repo.commit("fix(ci): new valid commit");
  const result = repo.validate(previous);
  expect(result.status).toBe(0);
  expect(result.stdout).not.toContain("already published");
});

test("diverged PR targets use their own merge base rather than inherited target commits", () => {
  const repo = repository();
  repo.git("checkout", "--quiet", "-b", "release-target");
  const target = repo.commit("existing target branch message");
  repo.git("checkout", "--quiet", "feat/example");
  repo.commit("fix(ci): scoped pull request");
  const result = repo.validate(target, "pull_request");
  expect(result.status).toBe(0);
  expect(result.stdout).not.toContain("existing target");
});

test("rewritten pushes fall back to the default branch instead of replaying its history", () => {
  const repo = repository();
  const previous = repo.commit("discarded branch message");
  repo.git("reset", "--hard", repo.inherited);
  repo.commit("fix(ci): rewritten branch");
  expect(repo.validate(previous).status).toBe(0);
});

test("manual default-branch runs validate the tip instead of an empty range", () => {
  const repo = repository();
  const tip = repo.commit("fix(ci): valid default tip");
  repo.git("update-ref", "refs/remotes/origin/develop", tip);
  expect(repo.validate("", "workflow_dispatch").status).toBe(0);
  const invalid = repo.commit("invalid default tip");
  repo.git("update-ref", "refs/remotes/origin/develop", invalid);
  expect(repo.validate("", "workflow_dispatch").status).not.toBe(0);
});
