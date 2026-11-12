import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { Character } from "./character";
import { WorldObject } from "./world-object";
import { WorldObjectType } from "../../enums/world-object-type";

@Entity({ name: "cities" })
@ForeignKey(() => Character, ["characterId"], ["id"], {
    name: "city_character",
    onDelete: "RESTRICT",
})
@ForeignKey(() => WorldObject, ["worldObjectId", "castleObjectType"], ["id", "objectType"], {
    name: "city_castle",
    onDelete: "RESTRICT",
})
@Index("city_character_unique", ["characterId"], { unique: true })
@Index("city_world_object_unique", ["worldObjectId"], { unique: true })
@Index("city_id_character_unique", ["id", "characterId"], { unique: true })
@Check("city_castle_type", `"castle_object_type" = 'castle'`)
export class City extends BaseEntity
{
    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "world_object_id", type: "integer", update: false })
    worldObjectId: number;

    @Column({
        name: "castle_object_type",
        type: "enum",
        enum: WorldObjectType,
        enumName: "world_object_type",
        default: WorldObjectType.Castle,
        update: false,
        select: false,
    })
    readonly castleObjectType: WorldObjectType.Castle;
}
