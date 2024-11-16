import {
  FullHero,
  FullHeroRepositoryModel,
  HeroAttributeValue,
} from '../models/hero.model.dto';
import { BusinessException } from 'src/exceptions';
import houseData from '../../../data/house.json';
import systemData from '../../../data/system.json';
import { FullInventoryRepositoryModel } from '../models/inventory.model.dto';

export class BaseHeroService {
  private readonly attackAttributes = [];
  private readonly hpAttributes = [];
  private readonly hpRegenAttributes = [];
  private readonly evasionAttributes = [];
  private readonly critRateAttributes = [];
  private readonly lifeStealAttributes = [];
  private readonly lifeStealSkills = [];
  private readonly reflectSkills = [];

  private readonly hpRegenSkills = [];

  private readonly defaultCritDamegeLevel = 1;

  protected async mapToFullHero(
    hero: FullHeroRepositoryModel,
    inventories: FullInventoryRepositoryModel[],
  ): Promise<FullHero> {
    const house = houseData[hero.userGameProfile.house];
    if (!house) {
      throw new BusinessException({
        status: 500,
        errorCode: 'HERO_HOUSE_NOT_FOUND',
        errorMessage: 'House not found',
      });
    }

    const baseHouseAttack =
      systemData.baseAttackByLevel[house.attributes.attackLevel];
    const baseHouseHp = systemData.baseHpByLevel[house.attributes.hpLevel];
    const baseHouseEvasion =
      systemData.baseEvasionByLevel[house.attributes.luckLevel];
    const baseHouseCritRate =
      systemData.baseCritRateByLevel[house.attributes.luckLevel];
    const baseHouseCritDamage =
      systemData.baseCritDamageByLevel[this.defaultCritDamegeLevel];

    const skill = hero.userGameHeroSkills.find((skill) => skill).skill;
    const skillData = systemData.skills[skill];

    const itemInventoryIds = hero.userGameHeroItems.map(
      (item) => item.inventoryId,
    );
    const inventoryItems = itemInventoryIds.map((itemInventoryId) =>
      inventories.find((i) => i.id === itemInventoryId),
    );

    return {
      attack: this.buildHeroAttack(baseHouseAttack, inventoryItems),
      hp: this.buildHeroHP(baseHouseHp, inventoryItems),
      evasion: this.buildEvasion(baseHouseEvasion, inventoryItems),
      critRate: this.buildCritRate(baseHouseCritRate, inventoryItems),
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
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.attackAttributes.includes(attribute)) {
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
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.hpAttributes.includes(attribute)) {
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
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.evasionAttributes.includes(attribute)) {
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
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.critRateAttributes.includes(attribute)) {
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
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.critRateAttributes.includes(attribute)) {
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
      attributeValue.percent = skillData.attributes['lifeSteal'].percent;
    }

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.lifeStealAttributes.includes(attribute)) {
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
      attributeValue.point = skillData.attributes['reflect'].point;
      attributeValue.percent = skillData.attributes['reflect'].percent;
    }

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.lifeStealAttributes.includes(attribute)) {
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
      attributeValue.point = skillData.attributes['hpRegen'].point;
      attributeValue.percent = skillData.attributes['hpRegen'].percent;
    }

    return inventoryItems.reduce((attributeValue: HeroAttributeValue, item) => {
      for (let attribute of item.userGameInventoryAttributes) {
        if (this.hpRegenAttributes.includes(attribute)) {
          attributeValue.point += attribute.value.point || 0;
          attributeValue.percent += attribute.value.percent || 0;
        }
      }
      return attributeValue;
    }, attributeValue);
  }
}
