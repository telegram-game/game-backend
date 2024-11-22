import { UserProvider } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum AllowedProviders {
  TELEGRAM = 'TELEGRAM',
}

export enum AuthType {
  Bearer = 'Bearer',
}

export class LoginResponse {
  accessToken: string;
  refreshToken: string;
  authType: AuthType;
}

export class LoginProviderRequest {
  @IsEnum(AllowedProviders)
  provider: UserProvider;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}

export class RefreshTokenRequest {
  @IsString()
  refreshToken: string;
}

export class UserProfileModel {
  provider: UserProvider;
  providerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}
