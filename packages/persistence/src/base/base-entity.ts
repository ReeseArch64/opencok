import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Generated,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity
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

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;

    @DeleteDateColumn({
        name: "deleted_at",
        type: "timestamptz",
        nullable: true,
    })
    deletedAt: Date | null;

    @Column({ name: "archived_at", type: "timestamptz", nullable: true })
    archivedAt: Date | null;
}
