import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { BuildingType } from "../../enums/building-type";
import { City } from "./city";

@Entity({ name: "city_buildings" })
@ForeignKey(() => City, ["cityId"], ["id"], { name: "city_building_city", onDelete: "RESTRICT" })
@Index("city_building_position_unique", ["cityId", "position"], { unique: true })
@Index("city_building_id_city_unique", ["id", "cityId"], { unique: true })
@Index("city_building_castle_unique", ["cityId"], {
    unique: true,
    where: "\"building_type\" = 'castle'",
})
@Check("city_building_position_nonnegative", "\"position\" >= 0")
@Check("city_building_level_nonnegative", "\"level\" >= 0")
@Check("city_building_version_nonnegative", "\"state_version\" >= 0")
export class CityBuilding extends BaseEntity
{
    @Column({ name: "city_id", type: "integer", update: false })
    cityId: number;

    @Column({
        name: "building_type",
        type: "enum",
        enum: BuildingType,
        enumName: "building_type",
        update: false,
    })
    buildingType: BuildingType;

    @Column({ type: "integer", update: false })
    position: number;

    @Column({ type: "integer", default: 0 })
    level: number;

    @Column({ name: "state_version", type: "bigint", default: "0" })
    stateVersion: string;
}
