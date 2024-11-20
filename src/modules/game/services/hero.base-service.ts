import {
  FullHero,
  FullHeroAttributeValue,
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

    const attack = this.buildHeroAttack(baseHouseAttack, inventoryItems)
    const hp = this.buildHeroHP(baseHouseHp, inventoryItems)
    const evasion = this.buildEvasion(baseHouseEvasion, inventoryItems);
    const critRate = this.buildCritRate(baseHouseCritRate, inventoryItems);
    const critDamage = this.buildCritDamge(baseHouseCritDamage, inventoryItems)
    const lifeSteal = this.buildLifeSteal(skillData, inventoryItems);
    const reflect = this.buildReflect(skillData, inventoryItems);
    const hpRegen = this.buildHPRegen(skillData, inventoryItems);

    return {
      id: hero.id,
      attack: attack.main,
      hp: hp.main,
      evasion: evasion.main,
      critRate: critRate.main,
      critDamage: critDamage.main,
      lifeSteal: lifeSteal.main,
      reflect: reflect.main,
      hpRegen: hpRegen.main,

      metaData: {
        base: {
          attack: attack.base,
          hp: hp.base,
          evasion: evasion.base,
          critRate: critRate.base,
          critDamage: critDamage.base,
          lifeSteal: lifeSteal.base,
          reflect: reflect.base,
          hpRegen: hpRegen.base,
        },
        additional: {
          attack: attack.additional,
          hp: hp.additional,
          evasion: evasion.additional,
          critRate: critRate.additional,
          critDamage: critDamage.additional,
          lifeSteal: lifeSteal.additional,
          reflect: reflect.additional,
          hpRegen: hpRegen.additional,
        },
      },

      skill: skill,
      items: inventoryItems,
    } as FullHero;
  }

  protected buildHeroAttack(
    baseHouseAttack: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue({
      point: baseHouseAttack,
    });
    const main = new HeroAttributeValue({
      point: baseHouseAttack,
    });

    const additional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.attackAttributes.includes(attribute.attribute)) {
          // Main
          main.point += attribute.value.point || 0;
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    return {
      main,
      base,
      additional,
    }
  }

  protected buildHeroHP(
    baseHouseHp: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue({
      point: baseHouseHp,
    });

    const main = new HeroAttributeValue({
      point: baseHouseHp,
    });

    const additional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.hpAttributes.includes(attribute.attribute)) {
          // Main 
          main.point += attribute.value.point || 0;
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    return {
      main,
      base,
      additional,
    }
  }

  protected buildEvasion(
    baseHouseEvasion: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue({
      percent: baseHouseEvasion,
    });

    const main = new HeroAttributeValue({
      percent: baseHouseEvasion,
    });

    const additional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.evasionAttributes.includes(attribute.attribute)) {
          // Main
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    if (base.percent > this.maximumCritRate) {
      base.percent = this.maximumCritRate;
    }
    if (main.percent > this.maximumCritRate) {
      main.percent = this.maximumCritRate;
    }
    if (additional.percent > main.percent - base.percent) {
      additional.percent = main.percent - base.percent;
    }

    return {
      main,
      base,
      additional,
    }
  }

  protected buildCritRate(
    baseHouseCritRate: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue({
      percent: baseHouseCritRate,
    });

    const main = new HeroAttributeValue({
      percent: baseHouseCritRate,
    });

    const additional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.critRateAttributes.includes(attribute.attribute)) {
          // Main
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    if (base.percent > this.maximumCritRate) {
      base.percent = this.maximumCritRate;
    }
    if (main.percent > this.maximumCritRate) {
      main.percent = this.maximumCritRate;
    }
    if (additional.percent > main.percent - base.percent) {
      additional.percent = main.percent - base.percent;
    }

    return {
      main,
      base,
      additional,
    }
  }

  protected buildCritDamge(
    baseHouseCritDamage: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue({
      percent: baseHouseCritDamage,
    });

    const main = new HeroAttributeValue({
      percent: baseHouseCritDamage,
    });

    const addtional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.critRateAttributes.includes(attribute.attribute)) {
          // Main
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    return {
      main,
      base,
      additional: addtional,
    }
  }

  protected buildLifeSteal(
    skillData: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue();

    const main = new HeroAttributeValue();

    // Skill is the base
    if (this.lifeStealSkills.includes(skillData.code)) {
      base.point = skillData.attributes[HeroAttribute.LIFE_STEAL].point;
      base.percent =
        skillData.attributes[HeroAttribute.LIFE_STEAL].percent;
      main.point = skillData.attributes[HeroAttribute.LIFE_STEAL].point;
      main.percent =
        skillData.attributes[HeroAttribute.LIFE_STEAL].percent;
    }

    const addtional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.lifeStealAttributes.includes(attribute.attribute)) {
          // Main
          main.point += attribute.value.point || 0;

          // Additional
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    return {
      main,
      base,
      additional: addtional,
    }
  }

  protected buildReflect(
    skillData: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue();
    const main = new HeroAttributeValue();

    if (this.reflectSkills.includes(skillData.code)) {
      base.point = skillData.attributes[HeroAttribute.REFLECT].point;
      base.percent =
        skillData.attributes[HeroAttribute.REFLECT].percent;
      main.point = skillData.attributes[HeroAttribute.REFLECT].point;
      main.percent = skillData.attributes[HeroAttribute.REFLECT];
    }

    const addtional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.reflectAttributes.includes(attribute.attribute)) {
          // Main
          main.point += attribute.value.point || 0;
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    return {
      main,
      base,
      additional: addtional,
    }
  }

  protected buildHPRegen(
    skillData: any,
    inventoryItems: FullInventoryRepositoryModel[],
  ): FullHeroAttributeValue {
    const base = new HeroAttributeValue();
    const main = new HeroAttributeValue();

    if (this.hpRegenSkills.includes(skillData.code)) {
      base.point = skillData.attributes[HeroAttribute.HP_REGEN].point;
      base.percent =
        skillData.attributes[HeroAttribute.HP_REGEN].percent;
      main.point = skillData.attributes[HeroAttribute.HP_REGEN].point;
      main.percent = skillData.attributes[HeroAttribute.HP_REGEN];
    }

    const addtional = inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (const attribute of item.userGameInventoryAttributes) {
        if (this.hpRegenAttributes.includes(attribute.attribute)) {
          // Main
          main.point += attribute.value.point || 0;
          main.percent += attribute.value.percent || 0;

          // Additional
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, new HeroAttributeValue());

    return {
      main,
      base,
      additional: addtional,
    }
  }
}
