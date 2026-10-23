import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRules } from "../src/rules.ts";

const records =
  '<database><ItemSpec id="100100" level="0"/><ItemSpec id="100101" level="1"/></database>';

test("resource loading preserves optional files, duplicate policy and realm-specific rules", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const rules = await loadRules(directory, 2);
    expect(rules.kingdomId).toBe(2);
    expect(rules.role(1).level).toBe("1");
    expect(rules.stars.size).toBe(0);
    expect(rules.goods.size).toBe(0);
    await writeFile(
      join(directory, "goods.xml"),
      '<database><ItemSpec id="1" value="old"/><ItemSpec id="1" value="new"/></database>',
    );
    expect((await loadRules(directory)).goods.get("1")?.value).toBe("new");
    await writeFile(
      join(directory, "building.xml"),
      '<database><ItemSpec id="1"/><ItemSpec id="1"/></database>',
    );
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
    await writeFile(join(directory, "building.xml"), "<!DOCTYPE database><database/>");
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource XML");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
