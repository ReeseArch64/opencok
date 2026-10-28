import { expect, test } from "bun:test";
import { containsNicknameBadWords } from "@opencok/policy/rules/nickname-words";
import { checkNickname } from "@opencok/rules/nickname";

test("nickname checks consume the actual word matcher before global occupation", async () => {
    let occupied = 0;
    const providers = {
        containsBadWords: (name: string) => containsNicknameBadWords(name, ["blocked", "中文"]),
        occupied: async () => {
            occupied++;
            return false;
        },
    };
    expect((await checkNickname(" BLOCKED ", 0, providers)).exist).toBe(-1);
    expect((await checkNickname("中 文", 0, providers)).exist).toBe(-1);
    expect(occupied).toBe(0);
    expect((await checkNickname("clear", 0, providers)).exist).toBe(0);
    expect(occupied).toBe(1);
});
