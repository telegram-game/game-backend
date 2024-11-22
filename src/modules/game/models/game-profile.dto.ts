import { HouseData } from 'src/data/houses';
import { FullHero } from './hero.model.dto';
import {
  GameHouse,
  GameSeasons,
  UserGameProfileAttribute,
  UserGameProfileAttributes,
  UserGameProfileGameSeasons,
  UserGameProfiles,
} from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class GameProfileSeasonDto {
  rankPoint: number;
  energy: number;
  lastRechargeEnergyAt: Date;
  updatedAt: Date;
}

export class FullGameProfile {
  id: string;
  userId: string;
  houseData: HouseData;
  skillData: any;
  hero: FullHero;
  attributes?: {
    [key in UserGameProfileAttribute]?: {
      level: number;
      description: string;
    };
  };
  totalLevel: number;
  currentGameProfileSeason?: GameProfileSeasonDto;
  currentGameSeasons?: GameSeasons;
}

export type FullGameProfileRepositoryModel = UserGameProfiles & {
  userGameProfileAttributes?: UserGameProfileAttributes[];
  currentGameProfileSeason?: UserGameProfileGameSeasons;
};

export class ChangeHouseReqeust {
  @IsString()
  gameProfileId: string;

  @IsEnum(GameHouse)
  house: GameHouse;
}

export class UpgradeAttributeReqeust {
  @IsString()
  gameProfileId: string;

  @IsEnum(UserGameProfileAttribute)
  attribute: UserGameProfileAttribute;
}
