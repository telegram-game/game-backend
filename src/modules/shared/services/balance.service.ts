import { Injectable } from '@nestjs/common';
import { Tokens } from '@prisma/client';
import { UserBalanceService } from 'src/modules/balance';

@Injectable()
export class BalanceService {
  constructor(private userBalanceService: UserBalanceService) {}
  async getBalances(userId: string): Promise<any> {
    // Should use http module to call external service
    return this.userBalanceService.gets(userId);
  }

  async get(userId: string, token: Tokens) {
    // Should use http module to call external service
    return this.userBalanceService.get(userId, token);
  }

  async decrease(userId: string, token: Tokens, amount: number, metaData: any) {
    // Should use http module to call external service
    return this.userBalanceService.decreaseBalance(
      userId,
      token,
      amount,
      metaData,
    );
  }

  async increase(userId: string, token: Tokens, amount: number, metaData: any) {
    // Should use http module to call external service
    return this.userBalanceService.increaseBalance(
      userId,
      token,
      amount,
      metaData,
    );
  }
}
