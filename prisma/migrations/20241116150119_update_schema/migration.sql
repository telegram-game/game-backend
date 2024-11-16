/*
  Warnings:

  - Added the required column `item_code` to the `user_game_inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_game_profile_id` to the `user_game_inventories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemCode" AS ENUM ('FIRE_SWORD', 'FIRE_SHIELD', 'ICE_SWORD', 'ICE_SHIELD');

-- AlterTable
ALTER TABLE "user_game_inventories" ADD COLUMN     "item_code" "ItemCode" NOT NULL,
ADD COLUMN     "star" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "user_game_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_game_inventory_attributes" ADD COLUMN     "can_roll" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "star" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "user_game_profiles" ALTER COLUMN "class" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "user_game_inventories" ADD CONSTRAINT "user_game_inventories_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
