import { IsEnum, IsString } from 'class-validator';

export enum Providers {
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
  @IsEnum(Providers)
  provider: Providers;

  @IsString()
  code: string;
}

export class RefreshTokenRequest {
  @IsString()
  refreshToken: string;
}

export class UserProfileModel {
  provider: Providers;
  providerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}
