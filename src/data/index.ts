import { HouseConfigData, houses } from './houses';
import { ItemConfigData, items } from './items';
import { skills, SkillConfigData } from './skills';
import { system, SystemConfigData } from './system';

export class ConfigurationData {
  items: ItemConfigData;
  houses: HouseConfigData;
  skills: SkillConfigData;
  system: SystemConfigData;
}

export const configurationData = {
  items,
  houses,
  skills,
  system,
};
