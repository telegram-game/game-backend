import { Prisma, UserGameHeros, UserGameHeroAttributes, UserGameHeroSkills, UserGameHeroItems, UserGameProfiles, HeroSkill } from '@prisma/client';

export class HeroAttributeValue {
    point: number;
    percent: number;
}

export type FullHero = UserGameHeros & UserGameProfiles & {
    attack: HeroAttributeValue;
    hp: HeroAttributeValue;
    critRate: HeroAttributeValue;
    critDamage: HeroAttributeValue;
    evasion: HeroAttributeValue;
    lifeSteal: HeroAttributeValue;
    reflect: HeroAttributeValue;
    hpRegen: HeroAttributeValue;

    skill: HeroSkill;
    items: UserGameHeroItems[];
}

export type FullHeroRepositoryModel = UserGameHeros & {
    userGameProfile: UserGameProfiles;
    userGameHeroAttributes: UserGameHeroAttributes[];
    userGameHeroItems: UserGameHeroItems[];
    userGameHeroSkills: UserGameHeroSkills[];
}