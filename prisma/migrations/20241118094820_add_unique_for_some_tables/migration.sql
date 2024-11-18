/*
  Warnings:

  - A unique constraint covering the columns `[user_game_hero_id]` on the table `user_game_hero_skills` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_game_profile_id]` on the table `user_game_heros` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `user_game_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_game_hero_skills_user_game_hero_id_key" ON "user_game_hero_skills"("user_game_hero_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_heros_user_game_profile_id_key" ON "user_game_heros"("user_game_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profiles_user_id_key" ON "user_game_profiles"("user_id");
