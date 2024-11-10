import { Injectable } from '@nestjs/common';
import { FullHero, FullHeroRepositoryModel, HeroAttributeValue } from '../models/hero.model.dto';
import { HeroRepository } from '../repositories/hero.repository';
import { BusinessException } from 'src/exceptions';
import houseData from '../../../data/house.json'
import systemData from '../../../data/system.json'
import { InventoryRepository } from 'src/modules/inventory/repositories/inventory.repository';
import asyncLocalStorage from 'src/storage/async_local';
import { FullInventoryRepositoryModel } from 'src/modules/inventory/models/inventory.model.dto';

@Injectable()
export class HeroService {
  constructor(
    private readonly heroRepository: HeroRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async getFirst(
  ): Promise<FullHero> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    const hero = await this.heroRepository.getFullFirst(userId);

    const inventoryIds = hero.userGameHeroItems.map(item => item.inventoryId);
    const inventories = await this.inventoryRepository.getByIds(inventoryIds, userId);
    return this.mapToFullHero(hero, inventories);
  }

  private async mapToFullHero(hero: FullHeroRepositoryModel, inventories: FullInventoryRepositoryModel[]): Promise<FullHero> {
    const house = houseData[hero.userGameProfile.house];
    if (!house) {
      throw new BusinessException({status: 500, errorCode: "HERO_HOUSE_NOT_FOUND", errorMessage: 'House not found'});
    }

    const baseHouseAttack = systemData.baseAttackByLevel[house.attributes.attackLevel];
    const baseHouseHp = systemData.baseHpByLevel[house.attributes.hpLevel];
    const baseHouseEvasion = systemData.baseEvasionByLevel[house.attributes.luckLevel];
    const baseHouseCritRate = systemData.baseCritRateByLevel[house.attributes.luckLevel];

    const skill = hero.userGameHeroSkills.find(skill => skill).skill;
    const skillData = systemData.skills[skill];

    const itemInventoryIds = hero.userGameHeroItems.map(item => item.inventoryId);
    const inventoryItems =  itemInventoryIds.map(itemInventoryId => inventories.find(i => i.id === itemInventoryId));

    return {
      attack: this.buildHeroAttack(),
    } as FullHero;
  }

  private buildHeroAttack(): HeroAttributeValue {
    return {
      point: 0,
      percent: 0,
    }
  }

}
