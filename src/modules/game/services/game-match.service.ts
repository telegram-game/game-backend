import { HttpStatus, Injectable } from '@nestjs/common';
import { FullHero } from '../models/hero.model.dto';
import { BaseGameMatchService } from './game-match.base-service';
import { SupportService } from 'src/modules/shared/services/support.service';
import { FullGameMatch, GameMatchResult } from '../models/game-match.dto';
import { GameProfileService } from './game-profile.service';
import { Providers } from 'src/modules/auth/models/auth.dto';
import { AuthService } from 'src/modules/shared/services/auth.service';
import { BusinessException } from 'src/exceptions';

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
    console.log(userId);
    throw new Error('Not implemented');
  }

  async fightingWithFriend(
    userId: string,
    provider: Providers,
    providerId: string,
  ): Promise<GameMatchResult> {
    const fightedUser = await this.authService.getUserByProvider(
      provider,
      providerId,
    );
    if (!fightedUser || fightedUser.id === userId) {
        throw new BusinessException({status: HttpStatus.BAD_REQUEST, errorCode: '', errorMessage: 'Invalid user'});
    }

    const rightGameProfile = await this.gameProfileService.getFullFirst(
      fightedUser.id,
    );
    const leftGameProfile = await this.gameProfileService.getFullFirst(userId);

    return this.start([leftGameProfile.hero], [rightGameProfile.hero], {
      shouldStoreGame: false,
    });
  }

  async start(
    leftHeroes: FullHero[],
    rightHeroes: FullHero[],
    options?: {
      shouldStoreGame?: boolean;
    },
  ): Promise<GameMatchResult> {
    const gameMatch: FullGameMatch = new FullGameMatch(
      {
        initData: {
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
