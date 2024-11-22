-- AlterTable
ALTER TABLE "user_game_profile_game_seasons" ADD COLUMN     "energy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_recharge_energy_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "next_match_id" TEXT;

-- CreateTable
CREATE TABLE "user_game_profile_game_season_matches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profile_game_season_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profile_game_season_matches_user_game_profile_id__key" ON "user_game_profile_game_season_matches"("user_game_profile_id", "season_id");

-- AddForeignKey
ALTER TABLE "user_game_profile_game_season_matches" ADD CONSTRAINT "user_game_profile_game_season_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_season_matches" ADD CONSTRAINT "user_game_profile_game_season_matches_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_season_matches" ADD CONSTRAINT "user_game_profile_game_season_matches_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "game_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
