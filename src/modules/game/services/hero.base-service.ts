import {
  FullHero,
  FullHeroRepositoryModel,
  HeroAttributeValue,
} from '../models/hero.model.dto';
import { BusinessException } from 'src/exceptions';
import { FullInventoryRepositoryModel } from '../models/inventory.model.dto';
import { configurationData } from '../../../data/index';
import { HeroAttribute, HeroSkill, UserGameProfileAttribute } from '@prisma/client';
import { FullGameProfileRepositoryModel } from '../models/game-profile.dto';

const houseData = configurationData.houses;
const systemData = configurationData.system;
const skills = configurationData.skills;

export class BaseHeroService {
  protected readonly attackAttributes: HeroAttribute[] = [HeroAttribute.ATTACK];
  protected readonly hpAttributes: HeroAttribute[] = [HeroAttribute.HP];
  protected readonly hpRegenAttributes: HeroAttribute[] = [
    HeroAttribute.HP_REGEN,
  ];
  protected readonly evasionAttributes: HeroAttribute[] = [
    HeroAttribute.EVASION,
  ];
  protected readonly critRateAttributes: HeroAttribute[] = [
    HeroAttribute.CRIT_RATE,
  ];
  protected readonly lifeStealAttributes: HeroAttribute[] = [
    HeroAttribute.LIFE_STEAL,
  ];
  protected readonly reflectAttributes: HeroAttribute[] = [
    HeroAttribute.REFLECT,
  ];
  protected readonly lifeStealSkills: HeroSkill[] = [HeroSkill.LIFE_STEAL];
  protected readonly reflectSkills: HeroSkill[] = [HeroSkill.REFLECT];
  protected readonly hpRegenSkills: HeroSkill[] = [];
  protected readonly defaultCritDamegeLevel = 1;
  protected readonly maximumCritRate = 90;
  protected readonly maximumEvasion = 90;
  protected readonly defaultFreeItemChestCode = 'FIRE_SWORD_L1';

  private increaseByPercent(value: number, percent: number, max?: number): number {
    const increase = Math.floor(value * (percent / 100));
    const newValue = value + increase;
    return max ? Math.min(newValue, max) : newValue;
  }

  protected async mapToFullHero(
    hero: FullHeroRepositoryModel,
    inventories: FullInventoryRepositoryModel[],
    userGameProfile: FullGameProfileRepositoryModel,
  ): Promise<FullHero> {
    const house = houseData[hero.userGameProfile.house];
    if (!house) {
      throw new BusinessException({
        status: 500,
        errorCode: 'HERO_HOUSE_NOT_FOUND',
        errorMessage: 'House not found',
      });
    }

    const pocketAttribute = userGameProfile.userGameProfileAttributes?.find(att => att.attribute === UserGameProfileAttribute.POCKET);
    const salaryAttribute = userGameProfile.userGameProfileAttributes?.find(att => att.attribute === UserGameProfileAttribute.SALARY);
    const pocket = pocketAttribute ? pocketAttribute.value : 1;
    const salary = salaryAttribute ? salaryAttribute.value : 1;
    const increasePercent = pocket * 10 + salary * 10; // total percents

    const baseHouseAttack =
      this.increaseByPercent(systemData.baseAttackByLevel[house.attributes.attackLevel], increasePercent);
    const baseHouseHp = this.increaseByPercent(systemData.baseHpByLevel[house.attributes.hpLevel], increasePercent);
    const baseHouseEvasion =
      this.increaseByPercent(systemData.baseEvasionByLevel[house.attributes.luckLevel], increasePercent, this.maximumEvasion);
    const baseHouseCritRate =
      this.increaseByPercent(systemData.baseCritRateByLevel[house.attributes.luckLevel], increasePercent, this.maximumCritRate);
    const baseHouseCritDamage =
      systemData.baseCritDamageByLevel[this.defaultCritDamegeLevel];

    const skill = hero.userGameHeroSkills.find((skill) => skill).skill;
    const skillData = skills[skill];

    const itemInventoryIds = hero.userGameHeroItems.map(
      (item) => item.inventoryId,
    );
    const inventoryItems = itemInventoryIds.map((itemInventoryId) =>
      inventories.find((i) => i.id === itemInventoryId),
    );

    const evasion = this.buildEvasion(baseHouseEvasion, inventoryItems);
    if (evasion.percent > this.maximumEvasion) {
      evasion.percent = this.maximumEvasion;
    }
    const critRate = this.buildCritRate(baseHouseCritRate, inventoryItems);
    if (critRate.percent > this.maximumCritRate) {
      critRate.percent = this.maximumCritRate;
    }

    return {
      id: hero.id,
      attack: this.buildHeroAttack(baseHouseAttack, inventoryItems),
      hp: this.buildHeroHP(baseHouseHp, inventoryItems),
      evasion: evasion,
      critRate: critRate,
      critDamage: this.buildCritDamge(baseHouseCritDamage, inventoryItems),
      lifeSteal: this.buildLifeSteal(skillData, inventoryItems),
      reflect: this.buildReflect(skillData, inventoryItems),
      hpRegen: this.buildHPRegen(skillData, inventoryItems),

      skill: skill,
      items: inventoryItems,
    } as FullHero;
  }

  protected buildHeroAttack(
    baseHouseAttack: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue({
      point: baseHouseAttack,
    });

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.attackAttributes.includes(attribute.attribute)) {
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildHeroHP(
    baseHouseHp: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue({
      point: baseHouseHp,
    });

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.hpAttributes.includes(attribute.attribute)) {
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildEvasion(
    baseHouseEvasion: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue({
      percent: baseHouseEvasion,
    });

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.evasionAttributes.includes(attribute.attribute)) {
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildCritRate(
    baseHouseCritRate: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue({
      percent: baseHouseCritRate,
    });

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.critRateAttributes.includes(attribute.attribute)) {
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildCritDamge(
    baseHouseCritDamage: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue({
      percent: baseHouseCritDamage,
    });

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.critRateAttributes.includes(attribute.attribute)) {
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildLifeSteal(
    skillData: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue();

    if (this.lifeStealSkills.includes(skillData.code)) {
      attributeValue.percent =
        skillData.attributes[HeroAttribute.LIFE_STEAL].percent;
    }

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.lifeStealAttributes.includes(attribute.attribute)) {
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildReflect(
    skillData: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue();

    if (this.reflectSkills.includes(skillData.code)) {
      attributeValue.point = skillData.attributes[HeroAttribute.REFLECT].point;
      attributeValue.percent =
        skillData.attributes[HeroAttribute.REFLECT].percent;
    }

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.reflectAttributes.includes(attribute.attribute)) {
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }

  protected buildHPRegen(
    skillData: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): HeroAttributeValue {
    const attributeValue = new HeroAttributeValue();

    if (this.hpRegenSkills.includes(skillData.code)) {
      attributeValue.point = skillData.attributes[HeroAttribute.HP_REGEN].point;
      attributeValue.percent =
        skillData.attributes[HeroAttribute.HP_REGEN].percent;
    }

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.hpRegenAttributes.includes(attribute.attribute)) {
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }
}
