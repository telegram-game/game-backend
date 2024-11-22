import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseGameMatchService } from './game-match.base-service';
import { SupportService } from 'src/modules/shared/services/support.service';
import { GameMatchResult } from '../models/game-match.dto';
import { GameProfileService } from './game-profile.service';
import { AuthService } from 'src/modules/shared/services/auth.service';
import { BusinessException } from 'src/exceptions';
import { FullGameProfile } from '../models/game-profile.dto';
import { UserProvider } from '@prisma/client';
import { GameSeasonService } from './game-seasion.service';
import { UserGameProfileGameSeasonRepository } from '../repositories/user-game-profile-game-season.repository';

@Injectable()
export class GameMatchService extends BaseGameMatchService {
  constructor(
    private readonly gameProfileService: GameProfileService,
    private readonly authService: AuthService,
    private readonly gameSeasonService: GameSeasonService,
    private readonly userGameProfileGameSeasonRepository: UserGameProfileGameSeasonRepository,
    supportSerVice: SupportService,
  ) {
    super(supportSerVice);
  }

  async fightingRandom(userId: string): Promise<GameMatchResult> {
    // Check season
    const gameSeason = await this.gameSeasonService.getFirstActive();
    if (!gameSeason) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: '',
        errorMessage: 'No active rank season',
      });
    }

    const 

    const leftGameProfile = await this.gameProfileService.getFullFirst(userId);
    let rightGameProfile: FullGameProfile | null = null;
    let fromLevel = leftGameProfile.totalLevel;
    let toLevel = leftGameProfile.totalLevel;
    let totalTries = 5;
    while (!rightGameProfile && totalTries > 0) {
      rightGameProfile = await this.gameProfileService.getRandomSameLevelGameProfile(fromLevel, toLevel);
      fromLevel--;
      toLevel++;
      totalTries--;
    }

    if (!rightGameProfile) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: '',
        errorMessage: 'Cannot find a suitable opponent',
      });
    }

    return this.start([leftGameProfile.hero], [rightGameProfile.hero], {
      leftFullGameProfile: leftGameProfile,
      rightFullGameProfile: rightGameProfile,
    });
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

    const gameMatchResult = this.start([leftGameProfile.hero], [rightGameProfile.hero], {
      leftFullGameProfile: leftGameProfile,
      rightFullGameProfile: rightGameProfile,
    });

    return gameMatchResult;
  }
}
