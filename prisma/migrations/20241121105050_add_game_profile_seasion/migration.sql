-- CreateTable
CREATE TABLE "game_seasons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_profile_game_seasons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "rank_point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profile_game_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_seasons_code_key" ON "game_seasons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profile_game_seasons_user_game_profile_id_season__key" ON "user_game_profile_game_seasons"("user_game_profile_id", "season_id");

-- AddForeignKey
ALTER TABLE "user_game_profile_game_seasons" ADD CONSTRAINT "user_game_profile_game_seasons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_seasons" ADD CONSTRAINT "user_game_profile_game_seasons_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_seasons" ADD CONSTRAINT "user_game_profile_game_seasons_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "game_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
