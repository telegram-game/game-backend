import {
  UserGameHeroes,
  UserGameHeroAttributes,
  UserGameHeroSkills,
  UserGameHeroItems,
  UserGameProfiles,
  HeroSkill,
} from '@prisma/client';
import { FullInventoryRepositoryModel } from './inventory.model.dto';
import { IsEnum, IsString } from 'class-validator';

export class HeroAttributeValue {
  point: number;
  percent: number;
  percentPerTime: number;

  constructor(partials?: Partial<HeroAttributeValue>) {
    Object.assign(
      this,
      { point: 0, percent: 0, percentPerTime: 0 }, // default
      partials,
    );
  }
}

export type HeroAttributeType = {
  attack: HeroAttributeValue;
  hp: HeroAttributeValue;
  critRate: HeroAttributeValue;
  critDamage: HeroAttributeValue;
  evasion: HeroAttributeValue;
  lifeSteal: HeroAttributeValue;
  reflect: HeroAttributeValue;
  hpRegen: HeroAttributeValue;
};

export type FullHeroAttributeValue = {
  main: HeroAttributeValue;
  base: HeroAttributeValue;
  additional: HeroAttributeValue;
};

export type FullHero = UserGameHeroes &
  UserGameProfiles &
  HeroAttributeType & {
    metaData?: {
      base: HeroAttributeType;
      additional: HeroAttributeType;
    };

    skill: HeroSkill;
    items: FullInventoryRepositoryModel[];
  };

export type FullHeroRepositoryModel = UserGameHeroes & {
  userGameProfile: UserGameProfiles;
  userGameHeroAttributes: UserGameHeroAttributes[];
  userGameHeroItems: UserGameHeroItems[];
  userGameHeroSkills: UserGameHeroSkills[];
};

export class ChangeSkillRequest {
  @IsString()
  gameProfileId: string;

  @IsString()
  heroId: string;

  @IsEnum(HeroSkill)
  skill: HeroSkill;
}
