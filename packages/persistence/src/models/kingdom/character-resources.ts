import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { Character } from "./character";

@Entity({ name: "character_resources" })
@ForeignKey(() => Character, ["characterId"], ["id"], {
    name: "character_resources_character",
    onDelete: "RESTRICT",
})
@Index("character_resources_character_unique", ["characterId"], { unique: true })
@Check(
    "character_resources_nonnegative",
    "\"wood\" >= 0 AND \"food\" >= 0 AND \"stone\" >= 0 AND \"iron\" >= 0 AND \"silver\" >= 0 AND \"gold\" >= 0 AND \"crystals\" >= 0",
)
export class CharacterResources extends BaseEntity
{
    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ type: "bigint", default: "0" })
    wood: string;

    @Column({ type: "bigint", default: "0" })
    food: string;

    @Column({ type: "bigint", default: "0" })
    stone: string;

    @Column({ type: "bigint", default: "0" })
    iron: string;

    @Column({ type: "bigint", default: "0" })
    silver: string;

    @Column({ type: "bigint", default: "0" })
    gold: string;

    @Column({ type: "bigint", default: "0" })
    crystals: string;
}
