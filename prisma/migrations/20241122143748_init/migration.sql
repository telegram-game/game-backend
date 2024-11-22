-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('SEED', 'LOCAL', 'TELEGRAM', 'GOOGLE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "UserGameProfileAttribute" AS ENUM ('POCKET', 'SALARY', 'GAME_PROFILE_LEVEL');

-- CreateEnum
CREATE TYPE "GameHouse" AS ENUM ('DOGS', 'HAMSTERS');

-- CreateEnum
CREATE TYPE "HeroAttribute" AS ENUM ('ATTACK', 'HP', 'CRIT_RATE', 'CRIT_DAMAGE', 'EVASION', 'LIFE_STEAL', 'REFLECT', 'HP_REGEN');

-- CreateEnum
CREATE TYPE "HeroSkill" AS ENUM ('DESOLATE', 'REFLECT', 'LIFE_STEAL', 'RISING_FURY', 'FATAL_BLOW');

-- CreateEnum
CREATE TYPE "ItemCode" AS ENUM ('FIRE_SWORD', 'FIRE_SHIELD', 'ICE_SWORD', 'ICE_SHIELD');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SWORD', 'SHIELD', 'HELMET', 'ARMOR', 'BOOTS', 'RING', 'AMULET', 'GLOVES', 'PANTS', 'CAPE', 'BELT', 'BRACERS', 'EARRINGS', 'NECKLACE', 'SHOULDER', 'TALISMAN', 'WAND', 'ST');

-- CreateEnum
CREATE TYPE "Tokens" AS ENUM ('INGAME', 'INGAME_2');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'ENOUGH_BUDGET');

-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "provider" "UserProvider" NOT NULL DEFAULT 'LOCAL',
    "provider_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_referrals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "UserProvider" NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "referred_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "house" "GameHouse" NOT NULL,
    "class" TEXT,
    "total_power" INTEGER NOT NULL DEFAULT 2,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_attributes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "attribute" "UserGameProfileAttribute" NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_heroes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "total_power" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_heroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_hero_attributes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_hero_id" TEXT NOT NULL,
    "attribute" "HeroAttribute" NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_hero_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_inventories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "item_code" "ItemCode" NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "star" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_inventory_attributes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "attribute" "HeroAttribute" NOT NULL,
    "star" INTEGER NOT NULL DEFAULT 1,
    "can_roll" BOOLEAN NOT NULL DEFAULT true,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_inventory_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_hero_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_hero_id" TEXT NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_hero_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_hero_skills" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_hero_id" TEXT NOT NULL,
    "skill" "HeroSkill" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_hero_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token_balances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" "Tokens" NOT NULL DEFAULT 'INGAME',
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token_balance_histories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" "Tokens" NOT NULL DEFAULT 'INGAME',
    "from_balance" DOUBLE PRECISION NOT NULL,
    "to_balance" DOUBLE PRECISION NOT NULL,
    "meta_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_balance_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token_claim_infomations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" "Tokens" NOT NULL DEFAULT 'INGAME',
    "last_claim_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_claim_infomations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "total_budget" INTEGER NOT NULL,
    "current_claimed" INTEGER NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'ACTIVE',
    "meta_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_missions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_seasons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "status" "SeasonStatus" NOT NULL DEFAULT 'ACTIVE',
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
    "energy" INTEGER NOT NULL DEFAULT 0,
    "next_match_id" TEXT NOT NULL,
    "last_recharge_energy_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profile_game_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_profile_game_season_matches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "winner_user_id" TEXT NOT NULL,
    "rank_point" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profile_game_season_matches_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_provider_id_key" ON "users"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_referrals_user_id_idx" ON "user_referrals"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_referrals_provider_provider_user_id_key" ON "user_referrals"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profiles_user_id_key" ON "user_game_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_game_profiles_user_id_idx" ON "user_game_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_game_profiles_total_power_idx" ON "user_game_profiles"("total_power");

-- CreateIndex
CREATE INDEX "user_game_attributes_user_game_profile_id_idx" ON "user_game_attributes"("user_game_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_attributes_user_game_profile_id_attribute_key" ON "user_game_attributes"("user_game_profile_id", "attribute");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_heroes_user_id_key" ON "user_game_heroes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_heroes_user_game_profile_id_key" ON "user_game_heroes"("user_game_profile_id");

-- CreateIndex
CREATE INDEX "user_game_heroes_user_game_profile_id_idx" ON "user_game_heroes"("user_game_profile_id");

-- CreateIndex
CREATE INDEX "user_game_hero_attributes_user_game_hero_id_idx" ON "user_game_hero_attributes"("user_game_hero_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_inventories_user_game_profile_id_key" ON "user_game_inventories"("user_game_profile_id");

-- CreateIndex
CREATE INDEX "user_game_inventory_attributes_inventory_id_idx" ON "user_game_inventory_attributes"("inventory_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_hero_items_inventory_id_key" ON "user_game_hero_items"("inventory_id");

-- CreateIndex
CREATE INDEX "user_game_hero_items_user_game_hero_id_idx" ON "user_game_hero_items"("user_game_hero_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_hero_items_user_game_hero_id_item_type_key" ON "user_game_hero_items"("user_game_hero_id", "item_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_hero_skills_user_game_hero_id_key" ON "user_game_hero_skills"("user_game_hero_id");

-- CreateIndex
CREATE INDEX "user_game_hero_skills_user_game_hero_id_idx" ON "user_game_hero_skills"("user_game_hero_id");

-- CreateIndex
CREATE INDEX "user_token_balances_user_id_token_idx" ON "user_token_balances"("user_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_token_balances_user_id_token_key" ON "user_token_balances"("user_id", "token");

-- CreateIndex
CREATE INDEX "user_token_balance_histories_user_id_token_idx" ON "user_token_balance_histories"("user_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_token_balance_histories_user_id_token_created_at_key" ON "user_token_balance_histories"("user_id", "token", "created_at");

-- CreateIndex
CREATE INDEX "user_token_claim_infomations_user_id_token_idx" ON "user_token_claim_infomations"("user_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_token_claim_infomations_user_id_token_key" ON "user_token_claim_infomations"("user_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "missions_code_key" ON "missions"("code");

-- CreateIndex
CREATE INDEX "user_missions_user_id_idx" ON "user_missions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_missions_user_id_mission_id_key" ON "user_missions"("user_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_seasons_code_key" ON "game_seasons"("code");

-- CreateIndex
CREATE INDEX "user_game_profile_game_seasons_user_game_profile_id_idx" ON "user_game_profile_game_seasons"("user_game_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profile_game_seasons_user_game_profile_id_season__key" ON "user_game_profile_game_seasons"("user_game_profile_id", "season_id");

-- CreateIndex
CREATE INDEX "user_game_profile_game_season_matches_user_game_profile_id_idx" ON "user_game_profile_game_season_matches"("user_game_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profile_game_season_matches_user_game_profile_id__key" ON "user_game_profile_game_season_matches"("user_game_profile_id", "season_id");

-- CreateIndex
CREATE INDEX "user_game_profile_daily_checkins_game_profile_id_user_id_idx" ON "user_game_profile_daily_checkins"("game_profile_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profile_daily_checkins_game_profile_id_checkin_co_key" ON "user_game_profile_daily_checkins"("game_profile_id", "checkin_code");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profiles" ADD CONSTRAINT "user_game_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_attributes" ADD CONSTRAINT "user_game_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_attributes" ADD CONSTRAINT "user_game_attributes_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_heroes" ADD CONSTRAINT "user_game_heroes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_heroes" ADD CONSTRAINT "user_game_heroes_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_attributes" ADD CONSTRAINT "user_game_hero_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_attributes" ADD CONSTRAINT "user_game_hero_attributes_user_game_hero_id_fkey" FOREIGN KEY ("user_game_hero_id") REFERENCES "user_game_heroes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventories" ADD CONSTRAINT "user_game_inventories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventories" ADD CONSTRAINT "user_game_inventories_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventory_attributes" ADD CONSTRAINT "user_game_inventory_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventory_attributes" ADD CONSTRAINT "user_game_inventory_attributes_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "user_game_inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_items" ADD CONSTRAINT "user_game_hero_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_items" ADD CONSTRAINT "user_game_hero_items_user_game_hero_id_fkey" FOREIGN KEY ("user_game_hero_id") REFERENCES "user_game_heroes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_skills" ADD CONSTRAINT "user_game_hero_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_skills" ADD CONSTRAINT "user_game_hero_skills_user_game_hero_id_fkey" FOREIGN KEY ("user_game_hero_id") REFERENCES "user_game_heroes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_balances" ADD CONSTRAINT "user_token_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_balance_histories" ADD CONSTRAINT "user_token_balance_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_claim_infomations" ADD CONSTRAINT "user_token_claim_infomations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_seasons" ADD CONSTRAINT "user_game_profile_game_seasons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_seasons" ADD CONSTRAINT "user_game_profile_game_seasons_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_seasons" ADD CONSTRAINT "user_game_profile_game_seasons_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "game_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_season_matches" ADD CONSTRAINT "user_game_profile_game_season_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_season_matches" ADD CONSTRAINT "user_game_profile_game_season_matches_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_game_season_matches" ADD CONSTRAINT "user_game_profile_game_season_matches_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "game_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_daily_checkins" ADD CONSTRAINT "user_game_profile_daily_checkins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profile_daily_checkins" ADD CONSTRAINT "user_game_profile_daily_checkins_game_profile_id_fkey" FOREIGN KEY ("game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
