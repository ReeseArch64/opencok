import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { CityBuilding } from "./city-building";
import { City } from "./city";
import { BuildingType } from "../../enums/building-type";
import { CharacterResource } from "../../enums/character-resource";

@Entity({ name: "building_productions" })
@ForeignKey(
    () => CityBuilding,
    ["buildingId", "cityId", "buildingType"],
    ["id", "cityId", "buildingType"],
    { name: "building_production_building", onDelete: "RESTRICT" },
)
@ForeignKey(() => City, ["cityId", "characterId"], ["id", "characterId"], {
    name: "building_production_owner",
    onDelete: "RESTRICT",
})
@Index("building_production_building_unique", ["buildingId"], { unique: true })
@Index("building_production_owner_index", ["characterId"])
@Check(
    "building_production_resource",
    `(building_type = 'farm' AND resource = 'food') OR (building_type = 'sawmill' AND resource = 'wood') OR (building_type = 'quarry' AND resource = 'stone') OR (building_type = 'iron_mine' AND resource = 'iron')`,
)
@Check(
    "building_production_quantities",
    `amount >= 0 AND amount <= capacity AND capacity >= 0 AND per_hour >= 0 AND remainder >= 0 AND remainder < 3600000`,
)
@Check("building_production_configuration", `configuration_version >= 1`)
@Check("building_production_version", `state_version >= 0`)
export class BuildingProduction extends BaseEntity
{
    @Column({ name: "building_id", type: "integer", update: false })
    buildingId: number;

    @Column({ name: "city_id", type: "integer", update: false })
    cityId: number;

    @Column({ name: "character_id", type: "integer", update: false })
    characterId: number;

    @Column({
        name: "building_type",
        type: "enum",
        enum: BuildingType,
        enumName: "building_type",
        update: false,
    })
    buildingType: BuildingType;

    @Column({
        name: "resource",
        type: "enum",
        enum: CharacterResource,
        enumName: "character_resource",
        update: false,
    })
    resource: CharacterResource;

    @Column({ name: "configuration_public_id", type: "uuid" })
    configurationPublicId: string;

    @Column({ name: "configuration_version", type: "integer" })
    configurationVersion: number;

    @Column({ name: "settled_at", type: "timestamptz" })
    settledAt: Date;

    @Column({ name: "amount", type: "bigint", default: "0" })
    amount: string;

    @Column({ name: "remainder", type: "bigint", default: "0" })
    remainder: string;

    @Column({ name: "per_hour", type: "bigint" })
    perHour: string;

    @Column({ name: "capacity", type: "bigint" })
    capacity: string;

    @Column({ name: "state_version", type: "bigint", default: "0" })
    stateVersion: string;
}
