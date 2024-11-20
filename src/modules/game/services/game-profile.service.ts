import { HttpStatus, Injectable } from '@nestjs/common';
import { GameProfileRepository } from '../repositories/game-profile.repository';
import { FullGameProfile, FullGameProfileRepositoryModel } from '../models/game-profile.dto';
import { HeroService } from './hero.service';
import { GameHouse, Tokens, UserGameProfileAttribute, UserGameProfiles } from '@prisma/client';
import { configurationData } from '../../../data';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import { BusinessException } from 'src/exceptions';
import { GameProfileAttributeRepository } from '../repositories/game-profile-attribute.repository';

const houseData = configurationData.houses;
const skills = configurationData.skills;

@Injectable()
export class GameProfileService {
  private readonly defaultHouse = GameHouse.HAMSTERS;
  constructor(
    private readonly gameProfileRepository: GameProfileRepository,
    private readonly gameProfileAttributeRepository: GameProfileAttributeRepository,
    private readonly balanceService: BalanceService,
    private readonly heroService: HeroService,
  ) {}

  async getByIdOrFirst(
    userId: string,
    gameProfileId?: string,
  ): Promise<UserGameProfiles> {
    return this.gameProfileRepository.getByIdOrFirst(userId, gameProfileId);
  }

  async getFullFirst(
    userId: string,
    _?: {
      includeAttributes?: boolean;
    },
  ): Promise<FullGameProfile> {
    return await this.createOrGetFullFirst(userId);
  }

  async createOrGetFullFirst(userId: string): Promise<FullGameProfile> {
    let gameProfile: FullGameProfileRepositoryModel = await this.gameProfileRepository.getFirst(userId, {
      includeAttributes: true,
    });

    if (!gameProfile) {
      gameProfile = await this.gameProfileRepository.create({
        userId,
        house: this.defaultHouse,
      });
    }

    const attributes = {}
    Object.keys(UserGameProfileAttribute).forEach((key) => {
      const attribute = UserGameProfileAttribute[key as keyof typeof UserGameProfileAttribute];
      const userGameProfileAttribute = gameProfile.userGameProfileAttributes?.find(
        (attr) => attr.attribute === attribute,
      );
      attributes[attribute] = {
        level: userGameProfileAttribute?.value || 1,
        cost: this.calculateUpgradeCost(attribute, userGameProfileAttribute?.value || 1),
        description: 'This is a description',
      };
    })

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
      attributes: attributes,
    };
  }

  async changeHouse(
    userId: string,
    gameProfileId: string,
    house: GameHouse,
  ): Promise<void> {
    const gameProfile = await this.gameProfileRepository.getByIdOrFirst(
      userId,
      gameProfileId,
    );
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

  async upgradeAttribute(
    userId: string,
    gameProfileId: string,
    attribute: UserGameProfileAttribute,
  ): Promise<void> {
    const upgradeInformation = configurationData.system.upgradeInformation[attribute];
    if (!upgradeInformation) {
      throw new BusinessException({status: HttpStatus.BAD_REQUEST, errorCode: 'ATTRIBUTE_NOT_FOUND', errorMessage: 'Attribute not found'});
    }

    let attributeLevel = 1;
    let lastAttributeLevel = 2;
    const gameProfile = await this.gameProfileRepository.getByIdOrFirst(userId, gameProfileId, {
      includeAttributes: true,
    });

    if (!gameProfile) {
      throw new BusinessException({status: HttpStatus.BAD_REQUEST, errorCode: 'GAME_PROFILE_NOT_FOUND', errorMessage: 'Game profile not found'});
    }

    const attr = gameProfile.userGameProfileAttributes.find(att => att.attribute === attribute);
    if (attr) {
      attributeLevel = attr.value;
      lastAttributeLevel = attributeLevel + 1;
    }
    
    const cost = this.calculateUpgradeCost(attribute, lastAttributeLevel);
    const balance = await this.balanceService.get(userId, Tokens.INGAME);
    if (!balance || balance.balance < cost) {
      throw new BusinessException({status: HttpStatus.BAD_REQUEST, errorCode: 'INSUFFICIENT_BALANCE', errorMessage: 'Insufficient balance'});
    }

    // Update balance and balance history
    // Add event to upgrade attribute. But now just call to update in database
    await this.balanceService.decrease(userId, Tokens.INGAME, cost, {
      type: 'upgrade-attribute',
      additionalData: {
        attribute,
        cost,
        fromLevel: attributeLevel,
        toLevel: lastAttributeLevel,
      }
    });
    if (attr) {
      await this.gameProfileAttributeRepository.updateOptimstic({
        id: attr.id,
        value: lastAttributeLevel,
      }, attr.updatedAt);
    } else {
      await this.gameProfileAttributeRepository.create({
        userId,
        userGameProfileId: gameProfileId,
        attribute,
        value: lastAttributeLevel,
      });
    }
  }

  private calculateUpgradeCost(attribute: UserGameProfileAttribute, level: number): number {
    const upgradeInformation = configurationData.system.upgradeInformation[attribute];
    if (!upgradeInformation) {
      throw new BusinessException({status: HttpStatus.BAD_REQUEST, errorCode: 'ATTRIBUTE_NOT_FOUND', errorMessage: 'Attribute not found'});
    }

    const maxLevel = 100;
    const current = Math.min(level, maxLevel);
    return upgradeInformation.baseCost * Math.pow(current, upgradeInformation.multiplier);
  }
}
