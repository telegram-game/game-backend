import { Optional } from '@nestjs/common';
import {
  UserGameInventories,
  UserGameInventoryAttributes,
} from '@prisma/client';
import { IsString } from 'class-validator';

export type FullInventoryRepositoryModel = UserGameInventories & {
  userGameInventoryAttributes: UserGameInventoryAttributes[];
};

export class GetAllInventoryRequest {
  @IsString()
  gameProfileId: string;
}

export class BuyChestRequest {
  @IsString()
  chestCode: string;

  @IsString()
  gameProfileId: string;

  @Optional()
  code: string;
}
