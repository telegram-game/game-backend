/*
  Warnings:

  - You are about to drop the `user_attributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_attributes" DROP CONSTRAINT "user_attributes_user_id_fkey";

-- DropTable
DROP TABLE "user_attributes";

-- CreateTable
CREATE TABLE "user_game_attributes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "attribute" "UserAttribute" NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_game_attributes_user_game_profile_id_key" ON "user_game_attributes"("user_game_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_attributes_user_game_profile_id_attribute_key" ON "user_game_attributes"("user_game_profile_id", "attribute");

-- AddForeignKey
ALTER TABLE "user_game_attributes" ADD CONSTRAINT "user_game_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_attributes" ADD CONSTRAINT "user_game_attributes_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
