export interface DragonBaseCatalogRecord {
  readonly "id": number;
  readonly "initFight": number;
  readonly "initlevel": number;
  readonly "skill": readonly number[];
  readonly "battleSkill": readonly number[];
  readonly "skillUnlockLv": readonly number[];
  readonly "hatchTime": number;
  readonly "nicknameCost": number;
  readonly "communicateTime": readonly number[];
  readonly "communicateCond": readonly number[];
  readonly "holdCrit": readonly number[];
  readonly "skillSlotQuality": readonly number[];
  readonly "gift": readonly number[];
  readonly "talentskillInit": number;
  readonly "reputationCondition"?: readonly number[];
}
