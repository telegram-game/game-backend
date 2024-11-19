import { HouseData } from 'src/data/houses';
import { FullHero } from './hero.model.dto';
import { GameHouse, Tokens } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class FullGameProfile {
  id: string;
  houseData: HouseData;
  skillData: any;
  hero: FullHero;
  balances?: {
    [key in Tokens]?: number;
  };
}

export class ChangeHouseReqeust {
  @IsString()
  gameProfileId: string;

  @IsEnum(GameHouse)
  house: GameHouse;
}
