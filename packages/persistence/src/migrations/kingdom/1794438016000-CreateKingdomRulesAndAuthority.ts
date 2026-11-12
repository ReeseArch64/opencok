import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKingdomRulesAndAuthority1794438016000 implements MigrationInterface
{
    name = "CreateKingdomRulesAndAuthority1794438016000";

    async up(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(`CREATE TABLE "realm_authority" (
            "id" integer NOT NULL DEFAULT 1,
            "owner_epoch" bigint NOT NULL,
            "instance_id" uuid NOT NULL,
            "acquired_at" timestamptz NOT NULL,
            CONSTRAINT "realm_authority_singleton" CHECK (id = 1),
            CONSTRAINT "realm_authority_epoch" CHECK (owner_epoch > 0),
            CONSTRAINT "realm_authority_pkey" PRIMARY KEY (id)
        )`);
        await queryRunner.query(`CREATE TABLE "kingdom_rule_sets" (
            "id" integer NOT NULL DEFAULT 1,
            "state_version" bigint NOT NULL,
            "building_configuration_version" integer NOT NULL,
            "troop_configuration_version" integer NOT NULL,
            "troop_training_configuration_version" integer NOT NULL,
            "march_configuration_version" integer NOT NULL,
            "resource_deposit_configuration_version" integer NOT NULL,
            "city_initial_configuration_version" integer NOT NULL,
            "city_initial_configuration_public_id" uuid NOT NULL,
            "activated_at" timestamptz NOT NULL,
            CONSTRAINT "kingdom_rule_set_singleton" CHECK (id = 1),
            CONSTRAINT "kingdom_rule_set_version" CHECK (state_version >= 1),
            CONSTRAINT "kingdom_rule_set_catalog_versions" CHECK (
                building_configuration_version >= 1 AND troop_configuration_version >= 1
                AND troop_training_configuration_version >= 1 AND march_configuration_version >= 1
                AND resource_deposit_configuration_version >= 1 AND city_initial_configuration_version >= 1),
            CONSTRAINT "kingdom_rule_sets_pkey" PRIMARY KEY (id)
        )`);
        await queryRunner.query(
            `CREATE FUNCTION "protect_realm_authority"() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF TG_OP = 'DELETE' THEN
                RAISE EXCEPTION 'Realm authority must retain its epoch' USING ERRCODE = '23514';
            END IF;
            IF NEW.id IS DISTINCT FROM OLD.id OR NEW.owner_epoch::numeric <> OLD.owner_epoch::numeric + 1
               OR NEW.acquired_at < OLD.acquired_at THEN
                RAISE EXCEPTION 'Authority acquisition must advance the epoch exactly once' USING ERRCODE = '23514';
            END IF;
            RETURN NEW;
        END
        $$`,
        );
        await queryRunner.query(
            `CREATE TRIGGER "realm_authority_protect" BEFORE UPDATE OR DELETE ON "realm_authority"
            FOR EACH ROW EXECUTE FUNCTION "protect_realm_authority"()`,
        );
        await queryRunner.query(
            `CREATE FUNCTION "protect_kingdom_rule_set"() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF TG_OP = 'DELETE' THEN
                RAISE EXCEPTION 'Active kingdom rules must be retained' USING ERRCODE = '23514';
            END IF;
            IF NEW.id IS DISTINCT FROM OLD.id OR NEW.state_version::numeric <> OLD.state_version::numeric + 1
               OR NEW.activated_at < OLD.activated_at THEN
                RAISE EXCEPTION 'Rule activation must advance the state version exactly once' USING ERRCODE = '23514';
            END IF;
            RETURN NEW;
        END
        $$`,
        );
        await queryRunner.query(
            `CREATE TRIGGER "kingdom_rule_set_protect" BEFORE UPDATE OR DELETE ON "kingdom_rule_sets"
            FOR EACH ROW EXECUTE FUNCTION "protect_kingdom_rule_set"()`,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(`DROP TABLE "kingdom_rule_sets"`);
        await queryRunner.query(`DROP FUNCTION "protect_kingdom_rule_set"()`);
        await queryRunner.query(`DROP TABLE "realm_authority"`);
        await queryRunner.query(`DROP FUNCTION "protect_realm_authority"()`);
    }
}
