import { SupportService } from 'src/modules/shared/services/support.service';
import { configurationData } from '../../../data';
import { GameSeasons, UserGameProfileGameSeasons } from '@prisma/client';
import {
  FullGameProfile,
  GameProfileSeasonDto,
} from '../models/game-profile.dto';
import { FullHero } from '../models/hero.model.dto';
import { FullGameMatch, GameMatchResult } from '../models/game-match.dto';

export abstract class BaseGameMatchService {
  constructor(protected readonly supportService: SupportService) {}

  protected getGameProfileSeason(
    userGameProfileGameSeason?: UserGameProfileGameSeasons,
    gameSeasons?: GameSeasons,
  ): GameProfileSeasonDto {
    if (!gameSeasons) {
      return {
        rankPoint: 0,
        energy: 0,
        lastRechargeEnergyAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const energyConfigData = configurationData.game.energy;
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
        energy: energyConfigData.defaultInitEnergy,
        lastRechargeEnergyAt: gameSeasons.fromDate,
        updatedAt: gameSeasons.fromDate,
      };
    }
  }

  protected calculateEnergy(
    currentEnergy: number,
    lastRechargeEnergyAt: Date,
  ): {
    updatedEnergy: number;
    lastRechargeEnergyAt?: Date;
  } {
    const energyConfigData = configurationData.game.energy;
    const now = new Date();
    const diff = now.getTime() - lastRechargeEnergyAt.getTime();
    const diffSeconds = Math.floor(diff / 1000);
    const totalBlock = Math.floor(
      diffSeconds / energyConfigData.claimTimeBlockInSeconds,
    );
    if (totalBlock < 1) {
      return {
        updatedEnergy: currentEnergy,
      };
    }

    const energyToAdd = totalBlock * energyConfigData.claimEnergyAmount;
    currentEnergy += energyToAdd;
    return {
      updatedEnergy: Math.min(currentEnergy, energyConfigData.maxEnergy),
      lastRechargeEnergyAt: now,
    };
  }

  protected calculateRankPoint(
    leftRankPoint: number,
    rightRankPoint: number,
    leftWin: boolean,
  ): number {
    const matchConfigData = configurationData.game.match;
    const isLeftStronger = leftRankPoint > rightRankPoint;
    const diffRank = Math.abs(leftRankPoint - rightRankPoint);
    const diffRankPoint = Math.min(
      Math.floor((diffRank * matchConfigData.pointPerDiff100Rank) / 100),
      matchConfigData.maxDiffPoint,
    );
    const deltaRankPoint = isLeftStronger ? -diffRankPoint : diffRankPoint;
    const finalDiffRankPoint = (leftWin ? matchConfigData.basePoint : - matchConfigData.basePoint) + deltaRankPoint;

    return Math.max(0, leftRankPoint + finalDiffRankPoint);
  }

  protected getRewardForWinner() {
    const matchConfigData = configurationData.game.match;
    return {
      token: matchConfigData.rewardToken,
      value: matchConfigData.rewardTokenValue,
    };
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
          rightFullGameProfile:
            options?.rightFullGameProfile as FullGameProfile,
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
