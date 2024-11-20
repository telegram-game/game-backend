import { HouseData } from 'src/data/houses';
import { FullHero } from './hero.model.dto';
import { GameHouse, Tokens, UserGameProfileAttribute, UserGameProfileAttributes, UserGameProfiles } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class FullGameProfile {
  id: string;
  houseData: HouseData;
  skillData: any;
  hero: FullHero;
  attributes?: {
    [key in UserGameProfileAttribute]?: {
      level: number;
      description: string;
    }
  }
  totalLevel: number;
}

export type FullGameProfileRepositoryModel  = UserGameProfiles & {
  userGameProfileAttributes?: UserGameProfileAttributes[];
}

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
