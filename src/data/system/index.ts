import { Tokens, UserGameProfileAttribute } from '@prisma/client';
import { Star } from '../common/common.model';
import systemData from './system.json';

export class SystemConfigData {
  baseAttackByLevel: {
    [key in Star]?: number;
  };
  baseHpByLevel: {
    [key in Star]?: number;
  };
  baseEvasionByLevel: {
    [key in Star]?: number;
  };
  baseCritRateByLevel: {
    [key in Star]?: number;
  };
  baseCritDamageByLevel: {
    [key in Star]?: number;
  };
  baseTokenInvestSpeed: {
    [key in Tokens]?: {
      speed: number;
      gapTime: number;
      description: string;
    };
  };
  upgradeInformation: {
    [key in UserGameProfileAttribute]?: {
      baseCost: number;
      multiplier: number;
      token: Tokens;
    }
  }
  referralCampaign?: {
    userReward: number;
    premiumUserReward: number;
    referrerReward: number;
    premiumReferrerReward: number;
    rewardToken: Tokens;
  }
}

export const system = systemData as SystemConfigData;
