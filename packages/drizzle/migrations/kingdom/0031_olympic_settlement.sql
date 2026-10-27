ALTER TABLE "opencok_kingdom"."question_match" ADD COLUMN "winningBetNum" bigint;
ALTER TABLE "opencok_kingdom"."question_match" ADD COLUMN "rewardPool" bigint;
ALTER TABLE "opencok_kingdom"."question_match" ADD COLUMN "tax" integer;
ALTER TABLE "opencok_kingdom"."question_match" ADD COLUMN "rewardLimit" integer;
CREATE INDEX "user_olympic_bet_owner_question" ON "opencok_kingdom"."user_olympic_bet" USING btree ("uid","questionId");
CREATE INDEX "user_olympic_bet_question_country" ON "opencok_kingdom"."user_olympic_bet" USING btree ("questionId","betCountry");
ALTER TABLE "opencok_kingdom"."question_match" ADD CONSTRAINT "question_match_settlement" CHECK (("winningBetNum" IS NULL AND "rewardPool" IS NULL AND "tax" IS NULL AND "rewardLimit" IS NULL) OR ("winningBetNum" IS NOT NULL AND "winningBetNum" >= 0 AND "rewardPool" IS NOT NULL AND "rewardPool" >= 0 AND "tax" IS NOT NULL AND "tax" BETWEEN 0 AND 50 AND "rewardLimit" IS NOT NULL AND "rewardLimit" >= 0 AND coalesce("ended",0) = 1 AND length(coalesce("result",'')) > 0));
