import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceResponse } from "@opencok/contracts/responses/alliance";
export function allianceSnapshot(value: AllianceResponse): Fields {
  return {
    uid: sfs.string(value.uid),
    name: sfs.string(value.name),
    abbr: sfs.string(value.abbr),
    intro: sfs.string(value.intro),
    announce: sfs.string(value.announce),
    language: sfs.string(value.language),
    member: sfs.int(value.member),
    maxMember: sfs.int(value.maxMember),
    recruit: sfs.int(value.recruit),
    rank: sfs.int(value.rank),
    point: sfs.int(value.point),
    accPoint: sfs.int(value.accPoint),
    learderUid: sfs.string(value.leaderUid),
    learderName: sfs.string(value.leaderName),
    fightpower: sfs.long(value.fightpower),
  };
}
