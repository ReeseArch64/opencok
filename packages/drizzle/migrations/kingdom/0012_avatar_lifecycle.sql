CREATE TABLE "opencok_kingdom"."avatar_publication" (
 "ownerUid" varchar(20) NOT NULL,
 "revision" bigint NOT NULL,
 CONSTRAINT "avatar_publication_PRIMARY" PRIMARY KEY ("ownerUid"),
 CONSTRAINT "avatar_publication_revision" CHECK ("revision" > 0)
);
ALTER TABLE "opencok_kingdom"."avatar_completion" ADD COLUMN "revision" bigint NOT NULL DEFAULT 0;
ALTER TABLE "opencok_kingdom"."avatar_version_update" ADD COLUMN "revision" bigint NOT NULL DEFAULT 0;
ALTER TABLE "opencok_kingdom"."avatar_version_update" DROP CONSTRAINT "avatar_version_update_version";
ALTER TABLE "opencok_kingdom"."avatar_version_update" ADD CONSTRAINT "avatar_version_update_version" CHECK ("picVer" >= 0 OR "pendingEffects" = 0);
ALTER TABLE "opencok_kingdom"."avatar_version_update" DROP CONSTRAINT "avatar_version_update_pending_range";
ALTER TABLE "opencok_kingdom"."avatar_version_update" ADD CONSTRAINT "avatar_version_update_pending_range" CHECK ("pendingEffects" BETWEEN 0 AND 15);
