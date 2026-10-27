import { sfs, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { DeliveredGiftProof } from "@opencok/contracts/paid-gifts";

export function paidGiftEvidence(proof: DeliveredGiftProof): Fields {
  return {
    owner: sfs.string(proof.owner),
    kingdomId: sfs.int(proof.kingdomId),
    orderId: sfs.string(proof.orderId),
    platform: sfs.string(proof.platform),
    exchangeId: sfs.string(proof.exchangeId),
    productId: sfs.string(proof.productId),
    priceCents: sfs.int(proof.priceCents),
    occurredAt: sfs.long(proof.occurredAt),
  };
}

export function redPacketInfo(packet: Row): Fields {
  return {
    uid: sfs.string(text(packet, "uid")),
    goldTotal: sfs.int(num(packet, "total")),
    totalNum: sfs.int(num(packet, "totalPeople")),
    getNum: sfs.int(num(packet, "curPeople")),
    senderUid: sfs.string(text(packet, "sender")),
    senderName: sfs.string(text(packet, "senderName")),
    pic: sfs.string(text(packet, "pic")),
    picVer: sfs.int(num(packet, "picVer")),
    sendTime: sfs.long(long(packet, "sendTime")),
  };
}

export function redPacketRecord(record: Row): Fields {
  return {
    player: sfs.string(text(record, "player")),
    name: sfs.string(text(record, "name")),
    value: sfs.int(num(record, "value")),
    pic: sfs.string(text(record, "pic")),
    picVer: sfs.int(num(record, "picVer")),
    time: sfs.long(long(record, "getTime")),
  };
}
