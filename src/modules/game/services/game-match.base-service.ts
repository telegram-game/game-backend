import { Injectable } from '@nestjs/common';
import { SupportService } from 'src/modules/shared/services/support.service';
import { configurationData } from '../../../data';
import { GameSeasons, UserGameProfileGameSeason } from '@prisma/client';
import { FullGameProfile, GameProfileSeasonDto } from '../models/game-profile.dto';
import { FullHero } from '../models/hero.model.dto';
import { FullGameMatch, GameMatchResult } from '../models/game-match.dto';

export abstract class BaseGameMatchService {
  constructor(protected readonly supportService: SupportService) {
    
  }

  protected getGameProfileSeason(userGameProfileGameSeason?: UserGameProfileGameSeason, gameSeasons?: GameSeasons): GameProfileSeasonDto {
    if (!gameSeasons) {
      return {
        rankPoint: 0,
        energy: 0,
        lastRechargeEnergyAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const matchConfigData = configurationData.game.match;
    if (userGameProfileGameSeason) {
      return {
        rankPoint: userGameProfileGameSeason.rankPoint,
        energy: userGameProfileGameSeason.energy,
        lastRechargeEnergyAt: userGameProfileGameSeason.lastRechargeEnergyAt,
        updatedAt: userGameProfileGameSeason.updatedAt,
      };
    } else {
      return {
        rankPoint: 0,
        energy: matchConfigData.defaultInitEnergy,
        lastRechargeEnergyAt: gameSeasons.fromDate,
        updatedAt: gameSeasons.fromDate,
      };
    }
  }

  protected async start(
    leftHeroes: FullHero[],
    rightHeroes: FullHero[],
    options?: {
      leftFullGameProfile?: FullGameProfile;
      rightFullGameProfile?: FullGameProfile;
    },
  ): Promise<GameMatchResult> {
    const gameMatch: FullGameMatch = new FullGameMatch(
      {
        initData: {
          leftFullGameProfile: options?.leftFullGameProfile as FullGameProfile,
          rightFullGameProfile: options?.rightFullGameProfile as FullGameProfile,
          leftHeroes: leftHeroes,
          rightHeroes: rightHeroes,
          maximumSteps: 40,
        },
      },
      this.supportService,
    );

    const result = gameMatch.run();

    return result;
  }
}
