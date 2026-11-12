import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { Account } from "./account";
import { Kingdom } from "./kingdom";
import { CharacterProvisioningStatus } from "../../enums/character-provisioning-status";

@Entity({ name: "character_provisionings" })
@ForeignKey(() => Account, ["accountId"], ["id"], {
    name: "provisioning_account",
    onDelete: "RESTRICT",
})
@ForeignKey(() => Kingdom, ["kingdomId"], ["id"], {
    name: "provisioning_kingdom",
    onDelete: "RESTRICT",
})
@Index("provisioning_account_kingdom", ["accountId", "kingdomId"], { unique: true })
@Index("provisioning_character", ["characterPublicId"], { unique: true })
@Check(
    "provisioning_completion",
    `("status" = 'pending' AND "completed_at" IS NULL) OR ("status" = 'completed' AND "completed_at" IS NOT NULL)`,
)
export class CharacterProvisioning extends BaseEntity
{
    @Column({ name: "account_id", type: "integer", update: false })
    accountId: number;

    @Column({ name: "kingdom_id", type: "integer", update: false })
    kingdomId: number;

    @Column({ name: "character_public_id", type: "uuid", update: false })
    characterPublicId: string;

    @Column({
        type: "enum",
        enum: CharacterProvisioningStatus,
        enumName: "character_provisioning_status",
        default: CharacterProvisioningStatus.Pending,
    })
    status: CharacterProvisioningStatus;

    @Column({ name: "completed_at", type: "timestamptz", nullable: true })
    completedAt: Date | null;
}
