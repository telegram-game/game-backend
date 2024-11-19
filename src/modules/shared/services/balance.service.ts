import { Injectable } from '@nestjs/common';
import { UserBalanceService } from 'src/modules/balance';

@Injectable()
export class BalanceService {
  constructor(private userBalanceService: UserBalanceService) {}
  async getBalances(userId: string): Promise<any> {
    // Should use http module to call external service
    return this.userBalanceService.gets(userId);
  }
}
