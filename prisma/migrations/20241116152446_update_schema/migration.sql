/*
  Warnings:

  - A unique constraint covering the columns `[inventory_id]` on the table `user_game_hero_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_game_hero_id,item_type]` on the table `user_game_hero_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_game_hero_items_inventory_id_key" ON "user_game_hero_items"("inventory_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_hero_items_user_game_hero_id_item_type_key" ON "user_game_hero_items"("user_game_hero_id", "item_type");
