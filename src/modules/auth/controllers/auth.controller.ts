import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  LoginProviderRequest,
  LoginResponse,
  RefreshTokenRequest,
} from '../models/auth.dto';
import { UserService } from '../services/user.service';
import { NotRequireAuthentication } from 'src/decorators';
import { AuthService } from '../services/auth.service';
import { TelegramService } from 'src/modules/shared/services/telegram.service';
import { BusinessException } from 'src/exceptions';

@Controller({
  path: ['/api/v1.0/auth'],
  version: ['1.0'],
})
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('/login/by-provider')
  @NotRequireAuthentication()
  async loginByProvider(
    @Body() data: LoginProviderRequest,
  ): Promise<LoginResponse> {
    // temporary solution. Will use data.code as the userId. Profile will be mocked.
    const userData = this.telegramService.verify(data.code);
    if (!userData) {
      throw new BusinessException({status: HttpStatus.UNAUTHORIZED, errorCode: 'UNAUTHORIZED', errorMessage: 'Unauthorized'});
    }

    const userId = userData.id.toString();
    const profile = {
      provider: data.provider,
      providerId: userId,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: '',
      avatar: userData.photo_url,
    };
    const user = await this.userService.createOrGetFullById(userId, profile);

    return this.authService.generateTokens(user.id, profile);
  }

  @Post('/refresh-token')
  @NotRequireAuthentication()
  async refreshToken(
    @Body() data: RefreshTokenRequest,
  ): Promise<LoginResponse> {
    return this.authService.refreshToken(data.refreshToken);
  }
}
