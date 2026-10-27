import { cupMatchSchema, cupBetSchema } from "@opencok/validations/cup-betting";
import { validateFields } from "./validation";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { cupOddsString } from "@opencok/rules/cup-betting";

function date(at: bigint) {
  return new Date(Number(at)).toISOString().slice(0, 16).replace("T", "-").replaceAll(":", "-");
}

export function cupMatchView(row: Row, count: number): Fields {
  return validateFields(cupMatchSchema, {
    id: sfs.string(text(row, "id")),
    startBetTime: sfs.long(long(row, "startBetTime")),
    startTime: sfs.long(long(row, "startTime")),
    vs: sfs.string(text(row, "vs")),
    odds: sfs.string(`${cupOddsString(num(row, "oddsA"))}|${cupOddsString(num(row, "oddsB"))}`),
    timeFormat: sfs.string(date(long(row, "startTime"))),
    betCount: sfs.int(count),
  });
}

export function cupBetView(row: Row, match?: Row, history = false): Fields {
  return validateFields(cupBetSchema, {
    uuid: sfs.string(text(row, "uuid")),
    uid: sfs.string(text(row, "uid")),
    matchId: sfs.string(text(row, "matchId")),
    resourceType: sfs.int(num(row, "resourceType")),
    betNum: sfs.int(num(row, "betNum")),
    betSide: sfs.string(text(row, "betSide")),
    winner: sfs.string(text(row, "winner") || "0"),
    ended: sfs.int(num(row, "ended")),
    rewarded: sfs.int(num(row, "rewarded")),
    odds: { type: Type.Float, value: Math.fround(num(row, "odds")) },
    vs: sfs.string(text(row, "vs")),
    ...(history
      ? { timeFormat: sfs.string(match ? date(long(match, "startTime")) : "2016-06-22-00-00") }
      : {}),
  });
}
