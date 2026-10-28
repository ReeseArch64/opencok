import { readFile, stat } from "node:fs/promises";
import { NicknameWordFilter, type NicknameForbiddenReader } from "../services/nickname-word-filter";

export { NicknameWordFilter, type NicknameForbiddenReader } from "../services/nickname-word-filter";

export async function loadNicknameWordFilter(
    path: string | URL = new URL("./data/badwords.json", import.meta.url),
    readForbidden?: NicknameForbiddenReader,
): Promise<NicknameWordFilter>
{
    const filter = new NicknameWordFilter(async () => {
        if ((await stat(path)).size > 16 * 1024 * 1024)
        {
            throw new Error("Oversized nickname filter resource");
        }

        const entries: unknown = JSON.parse(await readFile(path, "utf8"));

        if (!Array.isArray(entries) || entries.some((entry) => typeof entry !== "string"))
        {
            throw new Error("Invalid nickname filter resource");
        }

        return entries as string[];
    }, readForbidden);
    await filter.reload();

    return filter;
}
