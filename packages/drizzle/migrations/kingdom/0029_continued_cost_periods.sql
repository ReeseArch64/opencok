ALTER TABLE "opencok_kingdom"."activity_cost" ADD COLUMN "periodStart" bigint DEFAULT 0 NOT NULL;
ALTER TABLE "opencok_kingdom"."activity_cost" DROP CONSTRAINT "activity_cost_PRIMARY";
ALTER TABLE "opencok_kingdom"."activity_cost" ADD CONSTRAINT "activity_cost_PRIMARY" PRIMARY KEY("uid","type","periodStart");