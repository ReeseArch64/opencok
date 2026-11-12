import "reflect-metadata";
import { Check, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "realm_authority" })
@Check("realm_authority_singleton", "id = 1")
@Check("realm_authority_epoch", "owner_epoch > 0")
export class RealmAuthority
{
    @PrimaryColumn({ type: "integer", default: 1, update: false })
    id: number;

    @Column({ name: "owner_epoch", type: "bigint" })
    ownerEpoch: string;

    @Column({ name: "instance_id", type: "uuid" })
    instanceId: string;

    @Column({ name: "acquired_at", type: "timestamptz" })
    acquiredAt: Date;
}
