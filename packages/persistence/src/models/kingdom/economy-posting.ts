import "reflect-metadata";
import { Check, Column, CreateDateColumn, Entity, ForeignKey, Index, PrimaryColumn } from "typeorm";
import { CharacterResource } from "../../enums/character-resource";
import { Character } from "./character";
import { CommandReceipt } from "./command-receipt";

@Entity({ name: "economy_postings" })
@ForeignKey(() => CommandReceipt, ["receiptId"], ["id"], {
    name: "economy_posting_receipt",
    onDelete: "RESTRICT",
})
@ForeignKey(() => Character, ["characterId"], ["id"], {
    name: "economy_posting_character",
    onDelete: "RESTRICT",
})
@Index("economy_posting_character_resource", ["characterId", "resource", "createdAt"])
@Check("economy_posting_entry_nonnegative", "\"entry\" >= 0")
@Check(
    "economy_posting_balance",
    "\"before\" >= 0 AND \"after\" >= 0 AND \"after\"::numeric - \"before\"::numeric = \"delta\"::numeric",
)
@Check("economy_posting_reason", "length(btrim(\"reason\")) > 0")
export class EconomyPosting
{
    @PrimaryColumn({ name: "receipt_id", type: "integer", update: false })
    receiptId: number;

    @PrimaryColumn({ type: "integer", update: false })
    entry: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({
        type: "enum",
        enum: CharacterResource,
        enumName: "character_resource",
        update: false,
    })
    resource: CharacterResource;

    @Column({ type: "bigint", update: false })
    before: string;

    @Column({ type: "bigint", update: false })
    delta: string;

    @Column({ type: "bigint", update: false })
    after: string;

    @Column({ type: "varchar", length: 128, update: false })
    reason: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", update: false })
    createdAt: Date;
}
