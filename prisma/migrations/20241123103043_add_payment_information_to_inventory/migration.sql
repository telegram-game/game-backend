/*
  Warnings:

  - A unique constraint covering the columns `[payment_code]` on the table `user_game_inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_game_inventories" ADD COLUMN     "payment_code" TEXT,
ADD COLUMN     "payment_meta_data" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "user_game_inventories_payment_code_key" ON "user_game_inventories"("payment_code");
