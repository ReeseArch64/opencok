import "reflect-metadata";
import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    ForeignKey,
    Generated,
    Index,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Character } from "./character";

@Entity({ name: "command_receipts" })
@ForeignKey(() => Character, ["characterId"], ["id"], {
    name: "command_receipt_character",
    onDelete: "RESTRICT",
})
@Index("command_receipt_request_unique", ["characterId", "requestId"], { unique: true })
@Index("command_receipt_id_character_unique", ["id", "characterId"], { unique: true })
@Check(
    "command_receipt_names",
    "length(btrim(\"request_id\")) > 0 AND length(btrim(\"command\")) > 0",
)
@Check("command_receipt_epoch_positive", "\"owner_epoch\" > 0")
@Check(
    "command_receipt_payload_bounds",
    "octet_length(\"request\") <= 1048576 AND octet_length(\"response\") <= 1048576",
)
export class CommandReceipt
{
    @PrimaryGeneratedColumn("identity", { type: "integer" })
    id: number;

    @Generated("uuid")
    @Column({
        name: "public_id",
        type: "uuid",
        unique: true,
        default: () => "gen_random_uuid()",
        update: false,
    })
    publicId: string;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({ name: "request_id", type: "varchar", length: 128, update: false })
    requestId: string;

    @Column({ type: "varchar", length: 128, update: false })
    command: string;

    @Column({ type: "bytea", update: false })
    request: Buffer;

    @Column({ type: "bytea", update: false })
    response: Buffer;

    @Column({ name: "owner_epoch", type: "bigint", update: false })
    ownerEpoch: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", update: false })
    createdAt: Date;
}
