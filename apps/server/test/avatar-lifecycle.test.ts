import { expect, test } from "bun:test";
import { avatarSequence } from "@opencok/rules/avatar";
import { legacyAvatarVersion } from "@opencok/rules/avatar-version";
import { avatarModerationPlan } from "@opencok/rules/avatar-moderation";
import {
    decodeAvatarProfile,
    encodeAvatarProfile,
    validAvatarProfile,
} from "@opencok/contracts/chat-avatar-profile";

test("signed legacy allocation and immutable media sequences have distinct exhaustion boundaries", () => {
    for (
        const [before, allocated, upload] of [
            [-2147483648, 1, 1],
            [-1000001, 1, 1],
            [-1, 1, 1],
            [0, 1, 1],
            [1, 2, 2],
            [999998, 999999, 999999],
            [999999, 1000000, null],
            [1000000, 1, 1],
            [1999999, 1000000, null],
            [2999999, 1000000, null],
            [3999999, 1000000, null],
            [2147483647, 483648, 483648],
        ] as const
    )
    {
        expect(legacyAvatarVersion(before)).toBe(allocated);
        if (upload === null)
        {
            expect(() => avatarSequence(before)).toThrow();
        }
        else
        {
            expect(avatarSequence(before)).toBe(upload);
        }
    }
    for (const bad of [null, undefined, NaN, 1.5, -2147483649, 2147483648])
    {
        expect(() => legacyAvatarVersion(bad)).toThrow();
        expect(() => avatarSequence(bad)).toThrow();
    }
});
test("approval preserves version and report history while clearing only the ban and moderation state", () => {
    expect(avatarModerationPlan(-1, undefined, "approve", 1000, undefined)).toEqual({
        picVer: -1,
        changed: false,
        record: { picVer: -1, report: 0, banCount: 0, banTime: 0n, updateTime: 1000n, stat: 1 },
    });
    expect(
        avatarModerationPlan(
            3000004,
            { report: 9, banCount: 3, updateTime: 2n },
            "approve",
            1000,
            undefined,
        ),
    ).toEqual({ picVer: 3000004, changed: false, record: { banTime: 0n, stat: 1 } });
});
test("rejection preserves historical upload version and escalates bans with exact Java wrapping", () => {
    expect(avatarModerationPlan(2000004, undefined, "reject", 1000, "60")).toEqual({
        picVer: 3000004,
        changed: true,
        record: {
            picVer: 3000004,
            report: 0,
            banCount: 1,
            banTime: 61000n,
            updateTime: 1000n,
            stat: 2,
        },
    });
    expect(
        avatarModerationPlan(4, { picVer: 4, report: 9, banCount: 2 }, "reject", 1000, "60"),
    ).toEqual({
        picVer: 3000004,
        changed: true,
        record: { banCount: 3, banTime: 181000n, updateTime: 1000n, stat: 2 },
    });
    expect(avatarModerationPlan(3000004, { banCount: 2 }, "reject", 1000, "bad")).toEqual({
        picVer: 3000004,
        changed: false,
        record: null,
    });
    expect(avatarModerationPlan(-1, undefined, "reject", 1000, "1").picVer).toBe(2999999);
    expect(
        avatarModerationPlan(0, { banCount: 2147483647 }, "reject", 1000, "1").record,
    ).toMatchObject({ banCount: -2147483648, banTime: -2147483647000n });
    expect(
        avatarModerationPlan(1, undefined, "reject", 1000, "9223372036854775807").record?.banTime,
    ).toBe(0n);
    expect(() => avatarModerationPlan(4000000, undefined, "reject", 1000, "1")).toThrow();
    expect(() => avatarModerationPlan(1, { banCount: NaN }, "reject", 1000, "1")).toThrow();
});
test("publication revisions preserve exact Long values and admit zero sequence only with a durable revision", () => {
    const update = {
        owner: "1001",
        kingdomId: 1,
        sequence: 0,
        picVer: 3000000,
        committedAt: 1000n,
        updatedAt: "1",
        userName: "Synthetic",
        platform: "test",
        revision: 9007199254740993n,
    };
    expect(decodeAvatarProfile(encodeAvatarProfile(update))).toEqual(update);
    expect(validAvatarProfile({ ...update, revision: undefined })).toBe(false);
    for (const revision of [0n, -1n, 9223372036854775808n, "1", 1])
    {
        expect(validAvatarProfile({ ...update, revision })).toBe(false);
    }
});
