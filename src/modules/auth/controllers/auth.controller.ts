import { Body, Controller, Post } from '@nestjs/common';
import {
  LoginProviderRequest,
  LoginResponse,
  RefreshTokenRequest,
} from '../models/auth.dto';
import { UserService } from '../services/user.service';
import { NotRequireAuthentication } from 'src/decorators';
import { AuthService } from '../services/auth.service';
import { randomUUID } from 'crypto';

@Controller({
  path: ['/api/v1.0/auth'],
  version: ['1.0'],
})
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login/by-provider')
  @NotRequireAuthentication()
  async loginByProvider(
    @Body() data: LoginProviderRequest,
  ): Promise<LoginResponse> {
    // temporary solution. Will use data.code as the userId. Profile will be mocked.
    const userId = data.code || randomUUID(); // get userId via the provider way
    const profile = {
      provider: data.provider,
      providerId: userId,
      firstName: `First-name-${userId}`,
      lastName: `Last-name-${userId}`,
      email: `${userId}@gmail.com`, // random email
    }; // Mock profile
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
