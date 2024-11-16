-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('LOCAL', 'TELEGRAM', 'GOOGLE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "GameHouse" AS ENUM ('DOGS', 'HAMSTERS');

-- CreateEnum
CREATE TYPE "HeroAttribute" AS ENUM ('ATTACK', 'HP', 'CRIT_RATE', 'CRIT_DAMAGE', 'EVASION', 'LIFE_STEAL', 'REFLECT', 'HP_REGEN');

-- CreateEnum
CREATE TYPE "HeroSkill" AS ENUM ('DESOLATE', 'REFLECT', 'LIFE_STEAL', 'RISING_FURY', 'FATAL_BLOW');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SWORD', 'SHIELD', 'HELMET', 'ARMOR', 'BOOTS', 'RING', 'AMULET', 'GLOVES', 'PANTS', 'CAPE', 'BELT', 'BRACERS', 'EARRINGS', 'NECKLACE', 'SHOULDER', 'TALISMAN', 'WAND', 'ST');

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
CREATE TABLE "user_game_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "house" "GameHouse" NOT NULL,
    "class" TEXT DEFAULT 'Warrior',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_heros" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_game_profile_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "total_power" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_heros_pkey" PRIMARY KEY ("id")
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
    "item_type" "ItemType" NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_provider_id_key" ON "users"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_heros_user_id_key" ON "user_game_heros"("user_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_profiles" ADD CONSTRAINT "user_game_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_heros" ADD CONSTRAINT "user_game_heros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_heros" ADD CONSTRAINT "user_game_heros_user_game_profile_id_fkey" FOREIGN KEY ("user_game_profile_id") REFERENCES "user_game_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_attributes" ADD CONSTRAINT "user_game_hero_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_attributes" ADD CONSTRAINT "user_game_hero_attributes_user_game_hero_id_fkey" FOREIGN KEY ("user_game_hero_id") REFERENCES "user_game_heros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventories" ADD CONSTRAINT "user_game_inventories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventory_attributes" ADD CONSTRAINT "user_game_inventory_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_inventory_attributes" ADD CONSTRAINT "user_game_inventory_attributes_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "user_game_inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_items" ADD CONSTRAINT "user_game_hero_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_items" ADD CONSTRAINT "user_game_hero_items_user_game_hero_id_fkey" FOREIGN KEY ("user_game_hero_id") REFERENCES "user_game_heros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_skills" ADD CONSTRAINT "user_game_hero_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_hero_skills" ADD CONSTRAINT "user_game_hero_skills_user_game_hero_id_fkey" FOREIGN KEY ("user_game_hero_id") REFERENCES "user_game_heros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
