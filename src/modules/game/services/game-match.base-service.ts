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
      const { updatedEnergy, lastRechargeEnergyAt } = this.calculateEnergy(userGameProfileGameSeason.energy, userGameProfileGameSeason.lastRechargeEnergyAt);
      return {
        rankPoint: userGameProfileGameSeason.rankPoint,
        energy: updatedEnergy,
        lastRechargeEnergyAt: lastRechargeEnergyAt,
        updatedAt: userGameProfileGameSeason.updatedAt,
      };
    } else {
      const { updatedEnergy, lastRechargeEnergyAt } = this.calculateEnergy(energyConfigData.defaultInitEnergy, gameSeasons.fromDate);
      return {
        rankPoint: 0,
        energy: updatedEnergy,
        lastRechargeEnergyAt: lastRechargeEnergyAt,
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

    // Set energy to max if it is over max. And lastRechargeEnergyAt to now because we don't want to count when max
    if (currentEnergy >= energyConfigData.maxEnergy) {
      return {
        updatedEnergy: currentEnergy,
        lastRechargeEnergyAt: now,
      }
    }

    let currentEnergyCheck = currentEnergy;
    const lastDateCheck = new Date(lastRechargeEnergyAt);
    const currentDateCheck = new Date(lastRechargeEnergyAt);
    currentDateCheck.setSeconds(currentDateCheck.getSeconds() + energyConfigData.claimTimeBlockInSeconds);
    while (currentEnergyCheck < energyConfigData.maxEnergy && currentDateCheck.getTime() < now.getTime()) {
      currentEnergyCheck = Math.min(energyConfigData.maxEnergy, currentEnergyCheck + energyConfigData.claimEnergyAmount);
      lastDateCheck.setSeconds(lastDateCheck.getSeconds() + energyConfigData.claimTimeBlockInSeconds); // set to last
      currentDateCheck.setSeconds(currentDateCheck.getSeconds() + energyConfigData.claimTimeBlockInSeconds); // set to current
    }
  
    if (currentEnergyCheck >= energyConfigData.maxEnergy) {
      return {
        updatedEnergy: currentEnergy,
        lastRechargeEnergyAt: now,
      };
    }

    return {
      updatedEnergy: currentEnergyCheck,
      lastRechargeEnergyAt: lastDateCheck,
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
