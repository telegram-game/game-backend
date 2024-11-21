import { HttpStatus, Injectable } from '@nestjs/common';
import { GameProfileRepository } from '../repositories/game-profile.repository';
import { FullGameProfile, FullGameProfileRepositoryModel } from '../models/game-profile.dto';
import { HeroService } from './hero.service';
import { GameHouse, GameSeasons, Tokens, UserGameProfileAttribute, UserGameProfiles } from '@prisma/client';
import { configurationData } from '../../../data';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import { BusinessException } from 'src/exceptions';
import { GameProfileAttributeRepository } from '../repositories/game-profile-attribute.repository';
import { PrismaService } from 'src/modules/prisma';
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
    expireAt = Date.now() + 3600000; // 1 hour
    return currentSeason;
  }
}
