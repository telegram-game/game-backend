import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Log } from 'src/modules/loggers';

export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  @Log()
  async onModuleInit() {
    await super.$connect();
  }

  @Log()
  async onModuleDestroy() {
    await super.$disconnect();
  }

  /**
   * @deprecated
   */
  $on(): void {
    throw new Error('Method $on is not available in PrismaService');
  }

  /**
   * @deprecated
   */
  async $disconnect(): Promise<void> {
    throw new Error('Method $disconnect is not available in PrismaService');
  }
}

export default new PrismaService();
