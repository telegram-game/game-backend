import { Injectable } from '@nestjs/common';
import { FullHero } from '../models/hero.model.dto';
import { HeroRepository } from '../repositories/hero.repository';
import { BaseHeroService } from './hero.base-service';
import { HeroSkill, UserGameProfiles } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { InventoryRepository } from '../repositories/inventory.repository';
import { HeroSkillRepository } from '../repositories/hero-skill.repository';

@Injectable()
export class HeroService extends BaseHeroService {
  private readonly defaultSkill = HeroSkill.DESOLATE;
  constructor(
    private readonly heroRepository: HeroRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly heroSkillRepository: HeroSkillRepository,
    private prismaService: PrismaService,
  ) {
    super();
  }

  async getFullFirst(
    userId: string,
    userGameProfile: UserGameProfiles,
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
    return this.mapToFullHero(hero, inventories);
  }

  async createOrGetFullFirst(
    userId: string,
    userGameProfile: UserGameProfiles,
  ): Promise<FullHero> {
    const fullHero = await this.getFullFirst(userId, userGameProfile);
    if (fullHero) {
      return fullHero;
    }

    await this.prismaService.$transaction(async (tx: PrismaService) => {
      this.heroRepository.joinTransaction(tx);
      this.heroSkillRepository.joinTransaction(tx);

      // Add hero
      const hero = await this.heroRepository.createDefault(
        userId,
        userGameProfile.id,
      );

      // Add skill
      await this.heroSkillRepository.create({
        userId,
        userGameHeroId: hero.id,
        skill: this.defaultSkill,
      });
      
    }).finally(() => {
      this.heroRepository.leftTransaction();
      this.heroSkillRepository.leftTransaction();
    });

    return await this.getFullFirst(userId, userGameProfile);
  }
}