import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { olympicQuestionSchema, olympicBetSchema } from "@opencok/validations/olympic";
import { validateFields } from "./validation";
export function olympicQuestionView(row: Row, count: bigint, type: number, amount: bigint): Fields {
  return validateFields(olympicQuestionSchema, {
    id: sfs.string(text(row, "id")),
    startBetTime: sfs.long(long(row, "startBetTime")),
    startTime: sfs.long(long(row, "startTime")),
    betCount: sfs.long(count),
    resourceType: sfs.int(type),
    resourceNum: sfs.long(amount),
  });
}
export function olympicBetView(row: Row, question?: Row, count?: bigint): Fields {
  const result = text(row, "result"),
    winner = !result || result === text(row, "betCountry");
  return validateFields(olympicBetSchema, {
    uid: sfs.string(text(row, "uid")),
    questionId: sfs.string(text(row, "questionId")),
    resourceType: sfs.int(num(row, "resourceType")),
    betNum: sfs.int(num(row, "betNum")),
    betCountry: sfs.string(text(row, "betCountry")),
    result: sfs.string(result || "0"),
    ended: sfs.int(num(row, "ended")),
    rewarded: sfs.int(num(row, "rewarded")),
    reward: sfs.int(winner ? num(row, "reward") : 0),
    ...(question
      ? { endTime: sfs.long(long(question, "startTime")), betCount: sfs.long(count ?? 0n) }
      : {}),
  });
}
