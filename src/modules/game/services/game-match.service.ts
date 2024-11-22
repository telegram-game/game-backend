import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseGameMatchService } from './game-match.base-service';
import { SupportService } from 'src/modules/shared/services/support.service';
import { GameMatchResult } from '../models/game-match.dto';
import { GameProfileService } from './game-profile.service';
import { AuthService } from 'src/modules/shared/services/auth.service';
import { BusinessException } from 'src/exceptions';
import { UserGameProfileGameSeasons, UserProvider } from '@prisma/client';
import { UserGameProfileSeasonRepository } from '../repositories/user-game-profile-season.repository';
import { PrismaService } from 'src/modules/prisma';
import { FullGameProfile } from '../models/game-profile.dto';
import { UserGameProfileSeasonMatchRepository } from '../repositories/user-game-profile-season-match.repository';
import { configurationData } from '../../..//data';
import { randomUUID } from 'crypto';
import { GameSeasonService } from './game-seasion.service';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameMatchService extends BaseGameMatchService {
  private readonly isStoreMatchMetaData: boolean = false;
  constructor(
    private readonly configService: ConfigService,
    private readonly gameSeasonService: GameSeasonService,
    private readonly gameProfileService: GameProfileService,
    private readonly authService: AuthService,
    private readonly userGameProfileSeasonRepository: UserGameProfileSeasonRepository,
    private readonly userGameProfileSeasonMatchRepository: UserGameProfileSeasonMatchRepository,
    private readonly balanceService: BalanceService,
    private readonly prismaService: PrismaService,
    supportSerVice: SupportService,
  ) {
    super(supportSerVice);
    this.isStoreMatchMetaData = configService.get<boolean>(
      'isStoreMatchMetaData',
    );
  }

  async fightingRandom(userId: string): Promise<GameMatchResult> {
    const gameSeason = await this.gameSeasonService.getFirstActive();
    if (!gameSeason) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'NO_ACTIVE_SEASON',
        errorMessage: 'No active season',
      });
    }

    const energyConfigData = configurationData.game.energy;
    const leftGameProfile: FullGameProfile =
      await this.gameProfileService.getFullFirst(userId);

    if (
      !leftGameProfile.currentGameSeasons ||
      !leftGameProfile.currentGameProfileSeason
    ) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'NO_ACTIVE_SEASON',
        errorMessage: 'No active season',
      });
    }

    if (leftGameProfile.currentGameProfileSeason.energy < 1) {
      const { updatedEnergy } = this.calculateEnergy(
        leftGameProfile.currentGameProfileSeason.energy,
        leftGameProfile.currentGameProfileSeason.lastRechargeEnergyAt,
      );
      if (updatedEnergy < 1) {
        throw new BusinessException({
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'INSUFFICIENT_ENERGY',
          errorMessage: 'Not enough energy',
        });
      }
    }

    let rightGameProfile: FullGameProfile | null = null;
    let fromLevel = leftGameProfile.totalLevel;
    let toLevel = leftGameProfile.totalLevel;
    let totalTries = 5;
    while (!rightGameProfile && totalTries > 0) {
      rightGameProfile =
        await this.gameProfileService.getRandomSameLevelGameProfile(
          fromLevel,
          toLevel,
        );
      fromLevel--;
      toLevel++;
      totalTries--;
    }

    if (!rightGameProfile) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'NO_OPPONENT',
        errorMessage: 'Cannot find a suitable opponent',
      });
    }

    const gameMatchResult = await this.start(
      [leftGameProfile.hero],
      [rightGameProfile.hero],
      {
        leftFullGameProfile: leftGameProfile,
        rightFullGameProfile: rightGameProfile,
      },
    );

    let gameProfileSeason =
      await this.userGameProfileSeasonRepository.getByGameProfileAndSeasion(
        userId,
        leftGameProfile.id,
        gameSeason.id,
      );
    if (!gameProfileSeason) {
      gameProfileSeason = await this.userGameProfileSeasonRepository.create({
        userId,
        userGameProfileId: leftGameProfile.id,
        seasonId: gameSeason.id,
        rankPoint: 0,
        energy: this.calculateEnergy(
          energyConfigData.defaultInitEnergy,
          gameSeason.fromDate,
        ).updatedEnergy,
        nextMatchId: randomUUID(),
        lastRechargeEnergyAt: gameSeason.fromDate,
      });
    }

    const { updatedEnergy, lastRechargeEnergyAt } = this.calculateEnergy(
      gameProfileSeason.energy,
      gameProfileSeason.lastRechargeEnergyAt,
    );
    if (updatedEnergy < 1) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'INSUFFICIENT_ENERGY',
        errorMessage: 'Not enough energy',
      });
    }

    const repositories = [
      this.userGameProfileSeasonRepository,
      this.userGameProfileSeasonMatchRepository,
    ];
    const matchData = await this.prismaService.transaction(async () => {
      // Tested concurrency issue. No issues found
      const finalRankPoint = this.calculateRankPoint(
        gameProfileSeason.rankPoint,
        rightGameProfile.currentGameProfileSeason.rankPoint,
        gameMatchResult.winnerHeroId === leftGameProfile.hero.id,
      );

      const match = await this.userGameProfileSeasonMatchRepository.create({
        id: gameProfileSeason.nextMatchId,
        userId,
        userGameProfileId: leftGameProfile.id,
        seasonId: gameSeason.id,
        fromUserId: leftGameProfile.userId,
        toUserId: rightGameProfile.userId,
        winnerUserId: gameMatchResult.winnerUserId,
        rankPoint: finalRankPoint - gameProfileSeason.rankPoint,
        metadata: this.isStoreMatchMetaData ? gameMatchResult : null,
      });

      const updatedData: Partial<UserGameProfileGameSeasons> = {
        id: gameProfileSeason.id,
        userId,
        userGameProfileId: leftGameProfile.id,
        seasonId: leftGameProfile.currentGameSeasons.id,
        energy: updatedEnergy - 1,
        rankPoint: finalRankPoint,
        nextMatchId: randomUUID(),
      };
      if (lastRechargeEnergyAt) {
        updatedData.lastRechargeEnergyAt = lastRechargeEnergyAt;
      }

      await this.userGameProfileSeasonRepository.update(updatedData);

      return match;
    }, repositories);

    // Add more token for left user if he/she is winner
    if (gameMatchResult.winnerUserId === leftGameProfile.userId) {
      const reward = this.getRewardForWinner();
      await this.balanceService.increase(
        leftGameProfile.userId,
        reward.token,
        reward.value,
        {
          type: 'win-rank-match',
          additionalData: {
            reward,
            matchDataId: matchData.id,
            winnerUserId: leftGameProfile.userId,
            matchedAt: new Date(),
          },
        },
      );
    }

    return gameMatchResult;
  }

  async fightingWithFriend(
    userId: string,
    provider: UserProvider,
    providerId: string,
  ): Promise<GameMatchResult> {
    const fightedUser = await this.authService.getUserByProvider(
      provider,
      providerId,
    );
    if (!fightedUser || fightedUser.id === userId) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: '',
        errorMessage: 'Invalid user',
      });
    }

    const rightGameProfile = await this.gameProfileService.getFullFirst(
      fightedUser.id,
    );
    const leftGameProfile = await this.gameProfileService.getFullFirst(userId);

    const gameMatchResult = this.start(
      [leftGameProfile.hero],
      [rightGameProfile.hero],
      {
        leftFullGameProfile: leftGameProfile,
        rightFullGameProfile: rightGameProfile,
      },
    );

    return gameMatchResult;
  }
}
