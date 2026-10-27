import type { Mulan } from "../domain/mulan.ts";
import type { GeneralBaseDefinition } from "../resources/catalogs/types/general_base.ts";

export class MulanDefinitionMapper {
  public toDefinition(hero: Mulan): GeneralBaseDefinition {
    hero.validate();

    return {
      "id": 53571,
      "newAccMaxLv": 100,
      "isUnlock": 1,
      "name": 169493,
      "type": 0,
      "gender": 2,
      "baseLevel": hero.progression.initialLevel,
      "baseQuality": 1,
      "baseSkill": 54228,
      "baseStar": 1,
      "baseSkill2": 54229,
      "baseSkill3": 54230,
      "baseSkill4": 54231,
      "baseSkill5": 54232,
      "breachGoods": [
        [213293, 0],
        [213293, 0],
        [213293, 0],
        [213293, 0],
        [213293, 0],
      ],
      "starMaxLevel": 5,
      "starGoods": [
        [213293, 6000],
        [213293, 15000],
        [213293, 30000],
        [213293, 60000],
      ],
      "needPieces": [213293, hero.recruitment.fragmentsRequired],
      "piecesId": 213293,
      "levelMax": hero.progression.maximumLevel,
      "talent": 72,
      "talentPointDivisor": hero.progression.talentPointDivisor,
      "generalAb": [41020011, 53571201, 53571202],
      "loot": 1,
      "lootLevel": 5,
      "garrison": 1,
      "battle": 1,
      "lordExp": 1,
      "refineCard": 20,
      "refineEffect": [
        [1, 1000],
        [2, 1000],
        [3, 1000],
        [4, 1000],
        [5, 1000],
      ],
      "refineEffectLock": [
        [1, 1000],
        [2, 3000],
        [3, 7000],
        [4, 15000],
      ],
      "refineNum": [
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 0],
        [5, 0],
      ],
      "unlockLevel": [
        [1, 1],
        [2, 1],
        [3, 30],
        [4, 1],
        [5, 1],
      ],
      "unlockStar": [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
      ],
      "unlockGoodsNum": [
        [1, 0],
        [2, 0],
        [3, 1],
        [4, 1],
        [5, 1],
      ],
      "goodsId": 211453,
    };
  }
}
