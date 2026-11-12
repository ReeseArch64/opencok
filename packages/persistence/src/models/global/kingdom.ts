import "reflect-metadata";
import { Check, Column, Entity } from "typeorm";
import { BaseEntity } from "../../base/base-entity";

@Entity({ name: "kingdoms" })
@Check("kingdom_id_positive", "\"id\" > 0")
@Check("kingdom_display_name_bytes", "octet_length(\"display_name\") <= 64")
@Check("kingdom_display_name_not_empty", "length(trim(\"display_name\")) > 0")
export class Kingdom extends BaseEntity
{
    @Column({ name: "display_name", type: "varchar", length: 64 })
    displayName: string;
}
