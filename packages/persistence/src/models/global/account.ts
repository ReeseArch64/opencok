import "reflect-metadata";
import { Check, Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";

@Entity({ name: "accounts" })
@Index("account_firebase_uid", ["firebaseUid"], { unique: true })
@Check("account_firebase_uid_length", "char_length(\"firebase_uid\") BETWEEN 1 AND 128")
export class Account extends BaseEntity
{
    @Column({ name: "firebase_uid", type: "varchar", length: 128, collation: "C", update: false })
    firebaseUid: string;
}
