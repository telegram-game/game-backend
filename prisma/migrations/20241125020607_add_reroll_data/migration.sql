-- AlterTable
ALTER TABLE "user_game_inventories" ADD COLUMN     "last_reroll_date" TIMESTAMP(3),
ADD COLUMN     "reroll_count" INTEGER;
