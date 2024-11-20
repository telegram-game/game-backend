import { Tokens } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ClaimRequest {
  @IsEnum(Tokens)
  token: Tokens;
}

export class BalanceInformationResponse {
  balances: {
    [key in Tokens]?: number;
  }
  lastClaimedAt: {
    [key in Tokens]?: Date;
  }
}
