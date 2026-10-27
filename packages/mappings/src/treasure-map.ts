import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, text, type Row } from "@opencok/contracts/rows";
import type {
  TreasureMapEntryResponse,
  TreasureMapOccupationResponse,
  TreasureMapSpeedResponse,
} from "@opencok/contracts/responses/treasure-map";

export function treasureMapView(row: Row): Fields {
  const response: TreasureMapEntryResponse = {
    uuid: text(row, "uuid"),
    treasureId: text(row, "treasureId"),
    currentOwner: text(row, "currentOwner"),
    originalOwner: text(row, "originalOwner"),
    targetId: num(row, "targetId"),
    time: num(row, "time"),
    colour: num(row, "colour"),
    state: num(row, "state"),
  };
  return {
    uuid: sfs.string(response.uuid),
    treasureId: sfs.string(response.treasureId),
    currentOwner: sfs.string(response.currentOwner),
    originalOwner: sfs.string(response.originalOwner),
    targetId: sfs.int(response.targetId),
    time: sfs.int(response.time),
    colour: sfs.int(response.colour),
    state: sfs.int(response.state),
  };
}
export function treasureMapOccupation(response: TreasureMapOccupationResponse): Fields {
  return {
    time: sfs.int(response.time),
    finishtime: sfs.long(response.finishtime),
    useitem: sfs.string(response.useitem),
    treasureuuid: sfs.string(response.treasureuuid),
  };
}
export function treasureMapSpeed(response: TreasureMapSpeedResponse): Fields {
  return { gold: sfs.long(response.gold) };
}
