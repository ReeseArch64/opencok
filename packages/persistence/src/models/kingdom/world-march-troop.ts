import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { WorldMarch } from "./world-march";
import { CharacterTroops } from "./character-troops";

@Entity({ name: "world_march_troops" })
@ForeignKey(() => WorldMarch, ["marchId", "characterId"], ["id", "characterId"], {
    name: "world_march_troop_march",
    onDelete: "RESTRICT",
})
@ForeignKey(() => CharacterTroops, ["characterTroopsId", "characterId"], ["id", "characterId"], {
    name: "world_march_troop_owner",
    onDelete: "RESTRICT",
})
@Index("world_march_troop_unique", ["marchId", "characterTroopsId"], { unique: true })
@Check("world_march_troop_quantity", `quantity > 0 AND configuration_version >= 1`)
export class WorldMarchTroop extends BaseEntity
{
    @Column({ name: "march_id", type: "integer", update: false })
    marchId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "character_troops_id", type: "integer", update: false })
    characterTroopsId: number;

    @Column({ name: "quantity", type: "bigint", update: false })
    quantity: string;

    @Column({ name: "configuration_public_id", type: "uuid", update: false })
    configurationPublicId: string;

    @Column({ name: "configuration_version", type: "integer", update: false })
    configurationVersion: number;
}
