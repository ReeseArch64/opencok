import "reflect-metadata";
import { Check, Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";

@Entity({ name: "characters" })
@Index("character_account", ["accountPublicId"], { unique: true })
@Check("character_id_positive", "\"id\" > 0")
@Check("character_display_name_bytes", "octet_length(\"display_name\") <= 64")
@Check("character_display_name_not_empty", `length(btrim("display_name", E' \\t\\n\\r')) > 0`)
@Check("character_level_positive", "\"level\" >= 1")
@Check("character_experience_nonnegative", "\"experience\" >= 0")
export class Character extends BaseEntity
{
    @Column({ name: "account_public_id", type: "uuid", update: false })
    accountPublicId: string;

    @Column({ name: "display_name", type: "varchar", length: 64 })
    displayName: string;

    @Column({ type: "integer", default: 1 })
    level: number;

    @Column({ type: "bigint", default: "0" })
    experience: string;
}
