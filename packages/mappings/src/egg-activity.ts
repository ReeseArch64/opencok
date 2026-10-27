import { sfs, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { eggActivityIdle } from "@opencok/rules/egg-activity";

export function eggActivityView(row: Row): Fields {
  return {
    curEgg: sfs.string(text(row, "curEgg")),
    eggCd: sfs.long(long(row, "eggCd") === eggActivityIdle ? -1n : long(row, "eggCd")),
    exp: sfs.int(num(row, "exp")),
    curExpStage: sfs.int(num(row, "curExpStage")),
  };
}

export function eggCollectionView(row: Row): Fields {
  return {
    egg: sfs.string(text(row, "eggId")),
    goods: sfs.string(text(row, "goods")),
    reward: sfs.int(num(row, "reward")),
  };
}
