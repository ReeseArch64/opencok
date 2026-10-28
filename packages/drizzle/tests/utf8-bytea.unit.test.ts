import { expect, test } from "bun:test";
import { mail } from "../src/schema/opencok_kingdom/mail";

test("mail reward text keeps its string contract and exact UTF-8 bytes including NUL and BOM", () => {
    expect(mail.rewardId.getSQLType()).toBe("bytea");
    for (
        const input of [
            "",
            "ordinary reward",
            "before\0after",
            "城 🏰\0á",
            "\uFEFFprefix",
            "\\x0041\\N\t\n",
        ]
    )
    {
        const value: NonNullable<(typeof mail.$inferSelect)["rewardId"]> = input;
        const encoded = mail.rewardId.mapToDriverValue(value);
        expect(encoded).toEqual(Buffer.from(value, "utf8"));
        const decoded = mail.rewardId.mapFromDriverValue(encoded);
        expect(decoded).toBe(value);
    }
});

test("invalid Unicode is rejected instead of silently replacing bytes", () => {
    expect(() => mail.rewardId.mapToDriverValue("\uD800")).toThrow("Invalid UTF-16 text");
    expect(() => mail.rewardId.mapFromDriverValue(Buffer.from([255]))).toThrow();
});
