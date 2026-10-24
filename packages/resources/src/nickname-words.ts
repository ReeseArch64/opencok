import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { containsNicknameBadWords, nicknameBadWordEntries } from "@opencok/rules/nickname-words";

export class NicknameWordFilter {
  private entries: string[] = [];
  private loading = false;
  constructor(private readonly read: () => Promise<string>) {}

  contains(name: string): boolean {
    return containsNicknameBadWords(name, this.entries, this.loading);
  }

  async reload(): Promise<void> {
    this.loading = true;
    try {
      this.entries = nicknameBadWordEntries(await this.read(), this.entries);
    } catch {
    } finally {
      this.loading = false;
    }
  }
}

export async function loadNicknameWordFilter(resources: string): Promise<NicknameWordFilter> {
  const path = join(resources, "..", "gameconfig", "badwords.txt");
  const filter = new NicknameWordFilter(async () => {
    if ((await stat(path)).size > 16 * 1024 * 1024)
      throw new Error("Oversized nickname filter resource");
    return readFile(path, "utf8");
  });
  await filter.reload();
  return filter;
}
