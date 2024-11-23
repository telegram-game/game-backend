-- AlterTable
ALTER TABLE "user_referrals" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "referred_token_value" INTEGER DEFAULT 0,
ADD COLUMN     "referrer_token_value" INTEGER DEFAULT 0;
