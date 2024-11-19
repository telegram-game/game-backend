import { Tokens } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ClaimRequest {
  @IsEnum(Tokens)
  token: Tokens;
}
