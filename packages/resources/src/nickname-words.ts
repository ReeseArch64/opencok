import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { containsNicknameBadWords, nicknameBadWordEntries } from "@opencok/rules/nickname-words";

export type NicknameForbiddenReader = (key: string) => Promise<readonly string[]>;

export class NicknameWordFilter {
  private entries: string[] = [];
  private reserved: readonly string[] = [];
  private loading = false;
  constructor(
    private readonly read: () => Promise<string>,
    private readonly readForbidden?: NicknameForbiddenReader,
  ) {}

  reservedNamePatterns(): readonly string[] {
    return [...this.reserved];
  }

  contains(name: string): boolean {
    return containsNicknameBadWords(name, this.entries, this.loading);
  }

  async reload(): Promise<void> {
    this.loading = true;
    try {
      this.entries = nicknameBadWordEntries(await this.read(), this.entries);
      if (this.readForbidden)
        for (const kind of ["regular", "strict", "pattern", "weight", "name"]) {
          const entries = await this.readForbidden(`forbidden_words_${kind}`);
          if (kind === "name") this.reserved = [...entries];
        }
    } catch {
    } finally {
      this.loading = false;
    }
  }
}

export async function loadNicknameWordFilter(
  resources: string,
  readForbidden?: NicknameForbiddenReader,
): Promise<NicknameWordFilter> {
  const path = join(resources, "..", "gameconfig", "badwords.txt");
  const filter = new NicknameWordFilter(async () => {
    if ((await stat(path)).size > 16 * 1024 * 1024)
      throw new Error("Oversized nickname filter resource");
    return readFile(path, "utf8");
  }, readForbidden);
  await filter.reload();
  return filter;
}
