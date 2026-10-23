ALTER TABLE "opencok_kingdom"."mail" ALTER COLUMN "rewardId" SET DATA TYPE bytea USING convert_to("rewardId", 'UTF8');
