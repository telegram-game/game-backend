import { HeroAttribute, HeroSkill } from '@prisma/client';
import skillData from './skill.json';

export class SkillData {
  code: string;
  name: string;
  description: string;
  attributes: {
    [key in HeroAttribute]?: {
      point?: number;
      percent?: number;
      percentPerTime?: number;
    };
  };
}

export type SkillConfigData = {
  [key in HeroSkill]: SkillData;
};

export const skills = skillData as SkillConfigData;
