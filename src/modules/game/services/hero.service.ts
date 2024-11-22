import { HttpStatus, Injectable } from '@nestjs/common';
import { FullHero } from '../models/hero.model.dto';
import { HeroRepository } from '../repositories/hero.repository';
import { BaseHeroService } from './hero.base-service';
import { HeroSkill } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { InventoryRepository } from '../repositories/inventory.repository';
import { HeroSkillRepository } from '../repositories/hero-skill.repository';
import { BusinessException } from 'src/exceptions';
import { FullGameProfileRepositoryModel } from '../models/game-profile.dto';
import { InventoryService } from './inventory.service';
import { Logger } from 'src/modules/loggers';
import { HeroItemService } from './hero-item.service';

@Injectable()
export class HeroService extends BaseHeroService {
  private readonly defaultSkill = HeroSkill.DESOLATE;
  constructor(
    private readonly heroRepository: HeroRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly heroSkillRepository: HeroSkillRepository,
    private readonly inventoryService: InventoryService,
    private readonly heroItemService: HeroItemService,
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async getFullFirst(
    userId: string,
    userGameProfile: FullGameProfileRepositoryModel,
  ): Promise<FullHero> {
    const hero = await this.heroRepository.getFullFirst(
      userId,
      userGameProfile.id,
    );
    if (!hero) {
      return null;
    }

    const inventoryIds = hero.userGameHeroItems.map((item) => item.inventoryId);
    const inventories = await this.inventoryRepository.getByIds(
      inventoryIds,
      userId,
      userGameProfile.id,
    );
    return this.mapToFullHero(hero, inventories, userGameProfile);
  }

  async createOrGetFullFirst(
    userId: string,
    userGameProfile: FullGameProfileRepositoryModel,
  ): Promise<FullHero> {
    const fullHero = await this.getFullFirst(userId, userGameProfile);
    if (fullHero) {
      return fullHero;
    }

    let heroId = fullHero?.id;

    const repositories = [this.heroRepository, this.heroSkillRepository];
    await this.prismaService.transaction(async () => {
      // Add hero
      const hero = await this.heroRepository.createDefault(
        userId,
        userGameProfile.id,
      );
      heroId = hero.id;

      // Add skill
      await this.heroSkillRepository.create({
        userId,
        userGameHeroId: hero.id,
        skill: this.defaultSkill,
      });
    }, repositories);

    // This is for the first free item. We can ignore the error here
    //Add first free item
    if (!fullHero) {
      const inventory = await this.inventoryService
        .openChest(this.defaultFreeItemChestCode, userId, userGameProfile.id, {
          ignoreCost: true,
        })
        .catch((error) => {
          this.logger.error('Error while opening first free item', error);
          return null;
        });
      if (inventory) {
        // Equip the item
        await this.heroItemService
          .equip(userId, {
            heroId: heroId,
            inventoryId: inventory.id,
            gameProfileId: userGameProfile.id,
          })
          .catch((error) => {
            this.logger.error('Error while equipping first free item', error);
          });
      }
    }

    return await this.getFullFirst(userId, userGameProfile);
  }

  async changeSkill(
    userId: string,
    heroId: string,
    skill: HeroSkill,
  ): Promise<void> {
    const skillData = await this.heroSkillRepository.getFirstByHeroId(
      userId,
      heroId,
    );
    if (!skill) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'SKILL_NOT_FOUND',
        errorMessage: 'Skill not found',
      });
    }

    if (skillData.skill === skill) {
      return;
    }

    await this.heroSkillRepository.update({ id: skillData.id, skill });
  }
}
