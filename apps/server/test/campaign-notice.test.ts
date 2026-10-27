import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  campaignNoticeFrame,
  readCampaignNotice,
  campaignNoticeBody,
} from "@opencok/mappings/campaign-notice";
import { sfs } from "@opencok/messages/sfs";
test("campaign catalogs retain every maintained rule and their active admission flags", async () => {
  const rules = await loadRules();
  expect(rules.advanced.campaignRules).toHaveLength(272);
  expect(
    rules.advanced.campaignRules?.filter((rule) => (rule.state ?? 0) >= 2 && rule.openType === 2),
  ).toHaveLength(62);
  expect(rules.advanced.campaignRules?.find((rule) => rule.id === 2500)?.events).toEqual([
    { code: 8, name: "登陆", group: 1 },
  ]);
});
test("campaign notices keep source UTF field order and scope while rejecting a foreign owner", () => {
  const notice = {
      owner: "u",
      at: 1900000000000n,
      scope: 1 as const,
      allianceId: "a",
      message: { msgId: "9440792", para: ["Leader"] },
    },
    frame = campaignNoticeFrame(notice);
  expect(readCampaignNotice(frame, "u")).toEqual(notice);
  expect(() => readCampaignNotice(frame, "foreign")).toThrow();
  expect(campaignNoticeBody(notice.message)).toEqual({
    msgId: sfs.string("9440792"),
    para: sfs.array([sfs.string("Leader")]),
  });
  expect(Object.keys(campaignNoticeBody(notice.message))).toEqual(["msgId", "para"]);
  expect(campaignNoticeBody({ msgId: "x", para: [] })).toEqual({ msgId: sfs.string("x") });
  expect(
    readCampaignNotice(campaignNoticeFrame({ ...notice, message: { msgId: "x", para: [] } }), "u")
      .message.para,
  ).toEqual([]);
  expect(() => campaignNoticeFrame({ ...notice, allianceId: "" })).toThrow();
});
