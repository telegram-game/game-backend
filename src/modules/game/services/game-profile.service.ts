import { Injectable } from '@nestjs/common';
import { GameProfileRepository } from '../repositories/game-profile.repository';
import { FullGameProfile } from '../models/game-profile.dto';
import { HeroService } from './hero.service';
import { GameHouse, Tokens, UserGameProfiles } from '@prisma/client';
import { configurationData } from '../../../data';
import { BalanceService } from 'src/modules/shared/services/balance.service';

const houseData = configurationData.houses;
const skills = configurationData.skills;

@Injectable()
export class GameProfileService {
  private readonly defaultHouse = GameHouse.HAMSTERS;
  constructor(
    private readonly gameProfileRepository: GameProfileRepository,
    private readonly balanceService: BalanceService,
    private readonly heroService: HeroService,
  ) {}

  async getByIdOrFirst(
    userId: string,
    gameProfileId?: string,
  ): Promise<UserGameProfiles> {
    return this.gameProfileRepository.getByIdOrFirst(userId, gameProfileId);
  }

  async getFullFirst(userId: string, options?: {
    includeBalances?: boolean;
  }): Promise<FullGameProfile> {
    const fullGameProfile = await this.createOrGetFullFirst(userId);
    if (options?.includeBalances) {
      const balances = await this.balanceService.getBalances(userId);
      fullGameProfile.balances = {};
      Object.keys(Tokens).forEach((key) => {
        const token = Tokens[key as keyof typeof Tokens];
        const userToken = balances.find((balance) => balance.token === token);
        fullGameProfile.balances[token] = userToken?.balance || 0.0;
      });
    }
    
    return fullGameProfile;
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

  async changeHouse(userId: string, gameProfileId: string, house: GameHouse): Promise<void> {
    let gameProfile = await this.gameProfileRepository.getByIdOrFirst(userId, gameProfileId);
    if (!gameProfile) {
      await this.gameProfileRepository.create({
        userId,
        house: house,
      });
      return;
    }

    if (gameProfile.house === house) {
      return;
    }
    
    await this.gameProfileRepository.update({ id: gameProfile.id, house });
  }
}
