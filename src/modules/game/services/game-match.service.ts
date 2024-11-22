import { HttpStatus, Injectable } from '@nestjs/common';
import { FullHero } from '../models/hero.model.dto';
import { BaseGameMatchService } from './game-match.base-service';
import { SupportService } from 'src/modules/shared/services/support.service';
import { FullGameMatch, GameMatchResult } from '../models/game-match.dto';
import { GameProfileService } from './game-profile.service';
import { AuthService } from 'src/modules/shared/services/auth.service';
import { BusinessException } from 'src/exceptions';
import { FullGameProfile } from '../models/game-profile.dto';
import { UserProvider } from '@prisma/client';

@Injectable()
export class GameMatchService extends BaseGameMatchService {
  constructor(
    private gameProfileService: GameProfileService,
    private authService: AuthService,
    supportSerVice: SupportService,
  ) {
    super(supportSerVice);
  }

  async fightingRandom(userId: string): Promise<GameMatchResult> {
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
      shouldStoreGame: false,
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

    return this.start([leftGameProfile.hero], [rightGameProfile.hero], {
      shouldStoreGame: false,
      leftFullGameProfile: leftGameProfile,
      rightFullGameProfile: rightGameProfile,
    });
  }

  async start(
    leftHeroes: FullHero[],
    rightHeroes: FullHero[],
    options?: {
      shouldStoreGame?: boolean;
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

    // Store the game match
    if (options?.shouldStoreGame) {
      // Store the game match
    }

    return result;
  }
}
