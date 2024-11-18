import { Injectable } from '@nestjs/common';
import { UserTokenBalances } from '@prisma/client';
import { UserBalanceRepository } from '../repositories/user-balance.repository';

@Injectable()
export class UserBalanceService {
  constructor(private userBalanceRepository: UserBalanceRepository) {}

  async gets(userId: string): Promise<UserTokenBalances[]> {
    return await this.userBalanceRepository.gets(userId);
  }

  async claim(): Promise<number> {
    return 0;
  }
}
