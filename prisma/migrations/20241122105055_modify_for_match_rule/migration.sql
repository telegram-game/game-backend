/*
  Warnings:

  - Made the column `next_match_id` on table `user_game_profile_game_seasons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "user_game_profile_game_seasons" SET "next_match_id" = "id" WHERE "next_match_id" IS NULL;
ALTER TABLE "user_game_profile_game_seasons" ALTER COLUMN "next_match_id" SET NOT NULL;
