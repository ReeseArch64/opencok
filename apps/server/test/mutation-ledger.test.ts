import { expect, test } from "bun:test";
import { validatePosting } from "@opencok/ledger/posting";

const posting = {
  account: "synthetic",
  asset: "profile.gold",
  reason: "purchase",
  before: 9007199254740993n,
  after: 9007199254740992n,
};
test("ledger preserves exact signed credits and debits and rejects invalid economic bounds", () => {
  expect(validatePosting(posting)).toBe(-1n);
  expect(validatePosting({ ...posting, before: 0n, after: 9223372036854775807n })).toBe(
    9223372036854775807n,
  );
  expect(validatePosting({ ...posting, before: 9223372036854775807n, after: 0n })).toBe(
    -9223372036854775807n,
  );
  for (const before of [-1n, 9223372036854775808n])
    {expect(() => validatePosting({ ...posting, before })).toThrow();}
  for (const after of [-1n, 9223372036854775808n])
    {expect(() => validatePosting({ ...posting, after })).toThrow();}
  for (const reason of ["", " ", "\0", "\ud800", "x".repeat(129)])
    {expect(() => validatePosting({ ...posting, reason })).toThrow();}
});
