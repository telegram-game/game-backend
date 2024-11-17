import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async getUserByProvider(provider: string, providerId: string): Promise<any> {
    // Should use http module to call external service
    return {
      id: providerId, // This is a mock data
    };
  }
}
