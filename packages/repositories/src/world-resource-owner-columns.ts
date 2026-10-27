import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_status } from "@opencok/drizzle/schema/opencok_kingdom/new_general_status";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";

export const profileColumns = {
  uid: userprofile.uid,
  level: userprofile.level,
  serverId: userprofile.serverId,
  crossFightSrcServerId: userprofile.crossFightSrcServerId,
  banTime: userprofile.banTime,
  appVersion: userprofile.appVersion,
  allianceId: userprofile.allianceId,
  pf: userprofile.pf,
  civilizationType: userprofile.civilizationType,
  decomposeSuitEffect: userprofile.decomposesuiteffect,
};

export const buildingColumns = {
  uid: user_building.uid,
  uuid: user_building.uuid,
  itemId: user_building.itemId,
  level: user_building.level,
  star: user_building.star,
};

export const generalColumns = {
  uid: new_general.uid,
  id: new_general.id,
  state: new_general.state,
  buildingUuid: new_general.buildingUuid,
  star: new_general.star,
  baseSkill: new_general.baseSkill,
  talent: new_general.talent,
  opTime: new_general.optime,
  refinement: new_general.refineproperty,
};

export const statusColumns = {
  uid: new_general_status.uid,
  newGeneralId: new_general_status.newGeneralId,
  stateId: new_general_status.stateId,
  startTime: new_general_status.startTime,
  endTime: new_general_status.endTime,
};

export const equipmentColumns = {
  uid: user_equip.uid,
  uuid: user_equip.uuid,
  generalId: user_equip.generalid,
  itemId: user_equip.itemId,
  extraProperty: user_equip.extraProperty,
};

export const officeColumns = {
  uid: hero_office.uid,
  id: hero_office.id,
  officeId: hero_office.officeId,
  position: hero_office.position,
  startTime: hero_office.startTime,
};
