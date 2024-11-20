import { Missions, Tokens, UserMissions } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SocialType {
  LOCAL = 'LOCAL',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
}

export type FullMissionRepositoryModel = Missions & {
  userMissions?: UserMissions[];
}

export class CreateMissionReqeust {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  fromDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  toDate: Date;

  @IsNumber()
  totalBudget: number;

  @IsNumber()
  rewardValue: number;

  @IsEnum(Tokens)
  rewardToken: Tokens;

  @IsEnum(SocialType)
  socialType: SocialType;

  @IsOptional()
  @IsString()
  socialIdOrLink?: string;
}

export class MissionClaimRewardRequest {
  @IsString()
  missionId: string;

  @IsString()
  token: string;
}
