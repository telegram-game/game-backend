import { Injectable } from '@nestjs/common';
import { GameProfileRepository } from '../repositories/game-profile.repository';
import { FullGameProfile } from '../models/game-profile.dto';
import { HeroService } from './hero.service';
import { GameHouse, UserGameProfiles } from '@prisma/client';
import { configurationData } from '../../../data';

const houseData = configurationData.houses;
const skills = configurationData.skills;

@Injectable()
export class GameProfileService {
  private readonly defaultHouse = GameHouse.HAMSTERS;
  constructor(
    private readonly gameProfileRepository: GameProfileRepository,
    private readonly heroService: HeroService,
  ) {}

  async getByIdOrFirst(
    userId: string,
    gameProfileId?: string,
  ): Promise<UserGameProfiles> {
    return this.gameProfileRepository.getByIdOrFirst(userId, gameProfileId);
  }

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
      id: gameProfile.id,
      houseData: houseValue,
      skillData: skills[fullHero.skill],
      hero: fullHero,
    };
  }
}
