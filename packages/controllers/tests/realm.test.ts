import { expect, test } from "bun:test";
import { GameController } from "../src/game.controller.ts";
import { sfs, type Fields } from "@opencok/messages/sfs";

test("command Controller preserves response identity, typed correlation, pushes and errors", async () => {
    const params: Fields = { _cok_: sfs.long(9007199254740993n) };
    const result = { body: params, pushes: [{ command: "push", body: params }] };
    const failure = new Error("controlled failure");
    const game = new GameController({
        async initial()
        {
            return params;
        },
        async initialize(uid, correlation)
        {
            expect(uid).toBe("owner");
            expect(correlation).toBe(params);
            return result;
        },
        async execute(uid, command, fields)
        {
            expect(uid).toBe("owner");
            expect(fields).toBe(params);
            if (command === "fail")
            {
                throw failure;
            }
            return result;
        },
    });
    expect(await game.initial("owner")).toBe(params);
    expect(await game.initialize("owner", params)).toBe(result);
    expect(await game.execute("owner", "read", params)).toBe(result);
    await expect(game.execute("owner", "fail", params)).rejects.toBe(failure);
});
