import { Injectable } from '@nestjs/common';
import { GameSeasons } from '@prisma/client';
import { configurationData } from '../../../data';
import { GameSeasonRepository } from '../repositories/game-season.repository';

const houseData = configurationData.houses;
const skills = configurationData.skills;

// Should store in Redis
// For now, just cache in memory for 1 hour
let currentSeason: GameSeasons | null = null;
let expireAt: number = 0;

@Injectable()
export class GameSeasonService {
  constructor(
    private readonly gameSeasonRepository: GameSeasonRepository,
  ) { }

  async getFirstActive( ): Promise<GameSeasons> {
    if (currentSeason && expireAt > Date.now()) {
      return currentSeason;
    }
    currentSeason = await this.gameSeasonRepository.getFirstActive();
    expireAt = Date.now() + (currentSeason ? 3600000 : 60000); // 1 hour or 1 minute
    return currentSeason;
  }
}
