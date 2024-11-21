/*
  Warnings:

  - Added the required column `referred_user_id` to the `user_referrals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_referrals" DROP CONSTRAINT "user_referrals_user_id_fkey";

-- AlterTable
ALTER TABLE "user_referrals" ADD COLUMN     "referred_user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
