import { Injectable } from '@nestjs/common';
import { UserService as LocalUserService } from 'src/modules/auth/services/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly localUserService: LocalUserService) {}
  async getUserByProvider(provider: string, providerId: string): Promise<any> {
    // Should use http module to call external service
    return {
      id: providerId, // This is a mock data
    };
  }

  async getUserById(userId: string, options?: {
    userProfile?: true,
    includeAttributes?: boolean;
  }): Promise<any> {
    // Should use http module to call external service
    return this.localUserService.getById(userId, options);
  }
}
