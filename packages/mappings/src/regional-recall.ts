import { sfs, type Value } from "@opencok/messages/sfs";
import {
  regionalRecallSchema,
  regionalRecallLoginSchema,
} from "@opencok/validations/regional-recall";
import { validateFields } from "./validation";

export function regionalRecallView(id: string, rewards: readonly Value[], claimed: number) {
  return validateFields(regionalRecallSchema, {
    id: sfs.string(id),
    reward: sfs.array([...rewards]),
    receive_num: sfs.int(claimed),
  });
}

export function regionalRecallClaim(id: string, reward: Value, previous: bigint) {
  return validateFields(regionalRecallSchema, {
    RegRec_lastReceiveTime: sfs.long(previous),
    reward,
    id: sfs.string(id),
  });
}

export function regionalRecallLogin(end: bigint, previous?: bigint) {
  return validateFields(regionalRecallLoginSchema, {
    RegRec_endTime: sfs.long(end),
    ...(previous === undefined ? {} : { RegRec_lastReceiveTime: sfs.long(previous) }),
  });
}
