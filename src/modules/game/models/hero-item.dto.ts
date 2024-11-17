import { IsString } from 'class-validator';

export class EquipRequest {
  @IsString()
  gameProfileId: string;

  @IsString()
  heroId: string;

  @IsString()
  inventoryId: string;
}

export class UnEquipRequest {
  @IsString()
  gameProfileId: string;

  @IsString()
  heroId: string;

  @IsString()
  inventoryId: string;
}
