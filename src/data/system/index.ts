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
  baseIngameBalanceInvestSpeedInSecond: number;
}

export const system = systemData as SystemConfigData;
