/*
  Warnings:

  - Changed the type of `attribute` on the `user_game_attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserGameProfileAttribute" AS ENUM ('POCKET', 'SALARY');

-- AlterTable
ALTER TABLE "user_game_attributes" DROP COLUMN "attribute",
ADD COLUMN     "attribute" "UserGameProfileAttribute" NOT NULL;

-- DropEnum
DROP TYPE "UserAttribute";

-- CreateIndex
CREATE UNIQUE INDEX "user_game_attributes_user_game_profile_id_attribute_key" ON "user_game_attributes"("user_game_profile_id", "attribute");
