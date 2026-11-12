import "reflect-metadata";
import { Check, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "kingdom_rule_sets" })
@Check("kingdom_rule_set_singleton", "id = 1")
@Check("kingdom_rule_set_version", "state_version >= 1")
@Check(
    "kingdom_rule_set_catalog_versions",
    "building_configuration_version >= 1 AND troop_configuration_version >= 1 AND troop_training_configuration_version >= 1 AND march_configuration_version >= 1 AND resource_deposit_configuration_version >= 1 AND city_initial_configuration_version >= 1",
)
export class KingdomRuleSet
{
    @PrimaryColumn({ type: "integer", default: 1, update: false })
    id: number;

    @Column({ name: "state_version", type: "bigint" })
    stateVersion: string;

    @Column({ name: "building_configuration_version", type: "integer" })
    buildingConfigurationVersion: number;

    @Column({ name: "troop_configuration_version", type: "integer" })
    troopConfigurationVersion: number;

    @Column({ name: "troop_training_configuration_version", type: "integer" })
    troopTrainingConfigurationVersion: number;

    @Column({ name: "march_configuration_version", type: "integer" })
    marchConfigurationVersion: number;

    @Column({ name: "resource_deposit_configuration_version", type: "integer" })
    resourceDepositConfigurationVersion: number;

    @Column({ name: "city_initial_configuration_version", type: "integer" })
    cityInitialConfigurationVersion: number;

    @Column({ name: "city_initial_configuration_public_id", type: "uuid" })
    cityInitialConfigurationPublicId: string;

    @Column({ name: "activated_at", type: "timestamptz" })
    activatedAt: Date;
}
