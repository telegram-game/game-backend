import { Injectable } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { PrismaService } from 'src/modules/prisma';
import { GameProfileRepository } from '../repositories/game-profile.repository';
import { FullGameProfile } from '../models/game-profile.dto';
import { HeroService } from './hero.service';
import { GameHouse } from '@prisma/client';
import houseData from '../../../data/house.json';
import systemData from '../../../data/system.json';

@Injectable()
export class GameProfileService {
  private readonly defaultHouse = GameHouse.HAMSTERS;
  constructor(
    private readonly gameProfileRepository: GameProfileRepository,
    private readonly heroService: HeroService,
  ) {}

  async getFullFirst(userId: string): Promise<FullGameProfile> {
    return this.createOrGetFullFirst(userId);
  }

  async createOrGetFullFirst(userId: string): Promise<FullGameProfile> {
    let gameProfile = await this.gameProfileRepository.getFirst(userId);
    if (!gameProfile) {
      gameProfile = await this.gameProfileRepository.create({
        userId,
        house: this.defaultHouse,
      });
    }

    const fullHero = await this.heroService.createOrGetFullFirst(
      userId,
      gameProfile,
    );
    const houseValue = houseData[gameProfile.house];
    return {
      houseData: houseValue,
      skillData: systemData.skills[fullHero.skill],
      hero: fullHero,
    };
  }
}
