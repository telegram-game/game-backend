import { Injectable } from '@nestjs/common';
import { AuthType, LoginResponse } from '../models/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from 'src/exceptions';
import { HttpStatusCode } from 'axios';
import { ERROR_CODES, getErorrMessage } from 'src/constants/errors';

@Injectable()
export class AuthService {
  private readonly defaultAuthType: AuthType = AuthType.Bearer;
  private readonly accessTokenExpiresIn = '1d';
  private readonly refreshTokenExpiresIn = '7d';
  private readonly accessTokenPrivateKey: string;
  private readonly refreshTokenPrivateKey: string;
  private readonly refreshTokenPublicKey: string;
  constructor(
    private readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {
    this.accessTokenPrivateKey = configService.get<string>(
      'jwtAccesstokenPrivateKey',
    );
    this.refreshTokenPrivateKey = configService.get<string>(
      'jwtRefreshtokenPrivateKey',
    );
    this.refreshTokenPublicKey = configService.get<string>(
      'jwtRefreshtokenPublicKey',
    );
  }

  async generateTokens(userId: string, profile?: Record<string, string>): Promise<LoginResponse> {
    const accessToken = await this.jwtService.signAsync(
      { userId, profile },
      {
        privateKey: this.accessTokenPrivateKey,
        expiresIn: this.accessTokenExpiresIn,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId, profile },
      {
        privateKey: this.refreshTokenPrivateKey,
        expiresIn: this.refreshTokenExpiresIn,
      },
    );
    return {
      accessToken,
      refreshToken,
      authType: this.defaultAuthType,
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const decoded = await this.jwtService
      .verifyAsync(refreshToken, {
        publicKey: this.refreshTokenPublicKey,
      })
      .catch(() => {
        throw new BusinessException({
          status: HttpStatusCode.Unauthorized as number,
          errorCode: ERROR_CODES.INVALID_TOKEN,
          errorMessage: getErorrMessage(ERROR_CODES.INVALID_TOKEN),
        });
      });
    return this.generateTokens(decoded.userId, decoded.profile);
  }
}
