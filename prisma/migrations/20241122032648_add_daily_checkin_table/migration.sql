-- CreateTable
CREATE TABLE "user_game_profile_daily_checkins" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "game_profile_id" TEXT NOT NULL,
    "checkin_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profile_daily_checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profile_daily_checkins_game_profile_id_checkin_co_key" ON "user_game_profile_daily_checkins"("game_profile_id", "checkin_code");

-- AddForeignKey
ALTER TABLE "user_game_profile_daily_checkins" ADD CONSTRAINT "user_game_profile_daily_checkins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_daily_checkins" ADD CONSTRAINT "user_game_profile_daily_checkins_game_profile_id_fkey" FOREIGN KEY ("game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
