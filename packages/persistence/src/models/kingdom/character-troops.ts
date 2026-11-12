import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { Character } from "./character";
import { TroopType } from "../../enums/troop-type";

@Entity({ name: "character_troops" })
@ForeignKey(() => Character, ["characterId"], ["id"], {
    name: "character_troops_character",
    onDelete: "RESTRICT",
})
@Index("character_troops_type_tier_unique", ["characterId", "troopType", "tier"], { unique: true })
@Index("character_troops_id_owner_unique", ["id", "characterId"], { unique: true })
@Check("character_troops_tier", `tier BETWEEN 1 AND 10`)
@Check("character_troops_quantities", `available >= 0 AND marching >= 0 AND state_version >= 0`)
@Index("character_troops_identity_unique", ["id", "characterId", "troopType", "tier"], {
    unique: true,
})
export class CharacterTroops extends BaseEntity
{
    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({
        name: "troop_type",
        type: "enum",
        enum: TroopType,
        enumName: "troop_type",
        update: false,
    })
    troopType: TroopType;

    @Column({ name: "tier", type: "smallint", update: false })
    tier: number;

    @Column({ name: "available", type: "bigint", default: "0" })
    available: string;

    @Column({ name: "marching", type: "bigint", default: "0" })
    marching: string;

    @Column({ name: "state_version", type: "bigint", default: "0" })
    stateVersion: string;
}
