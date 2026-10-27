import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { costRankingBands } from "@opencok/rules/continued-cost-ranking";
import {
  costRankAwardId,
  costRankAwardOperation,
  costRankMail,
} from "@opencok/rules/continued-cost-rewards";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { pinProgressionReward } from "../../../packages/services/src/progression-rewards";
test("every maintained consumption rank prize resolves to funded claimable mail", async () => {
  const rules = await loadRules();
  for (const { reward } of costRankingBands(rules.items.get("continued_cost")!.k5!))
    {expect(
      mailRewardEntries(pinProgressionReward({ rules, now: 1900000000000n }, reward)).length,
    ).toBeGreaterThan(0);}
  expect(rules.mail.get("12199")?.message).toBeTruthy();
});
test("consumption reward identities bind their financial period and owner while payloads retain pinned assets", () => {
  const id = costRankAwardId("a".repeat(32), "owner"),
    mail = {
      sender: "S",
      title: "T",
      contents: Buffer.from([0, 1, 2]).toString("base64"),
      reward: "goods,200300,2",
    };
  expect(costRankAwardOperation(id)).toBe(`cost-rank:${id}`);
  expect(costRankAwardId("a".repeat(32), "other")).not.toBe(id);
  expect(costRankAwardId("b".repeat(32), "owner")).not.toBe(id);
  expect(costRankMail(JSON.stringify(mail))).toEqual(mail);
  for (const raw of [
    "{}",
    "null",
    JSON.stringify({ ...mail, contents: "invalid" }),
    JSON.stringify({ ...mail, reward: "unfunded" }),
  ])
    {expect(() => costRankMail(raw)).toThrow();}
});
