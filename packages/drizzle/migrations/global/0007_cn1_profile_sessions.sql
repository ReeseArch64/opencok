CREATE TABLE "opencok_global"."cn1_profile_session" (
  "ownerUid" varchar(255) NOT NULL,
  "isAddict" integer NOT NULL,
  "onlineMinutes" integer NOT NULL DEFAULT 0,
  "authAt" bigint NOT NULL DEFAULT 0,
  "sampledAt" bigint NOT NULL DEFAULT 0,
  "offlineAt" bigint,
  "sessionId" uuid,
  CONSTRAINT "cn1_profile_session_PRIMARY" PRIMARY KEY ("ownerUid"),
  CONSTRAINT "cn1_profile_session_mode" CHECK ("isAddict" BETWEEN 0 AND 2)
);
