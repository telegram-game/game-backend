-- DropIndex
DROP INDEX "user_game_inventories_user_game_profile_id_key";

-- CreateIndex
CREATE INDEX "user_game_inventories_user_game_profile_id_idx" ON "user_game_inventories"("user_game_profile_id");
