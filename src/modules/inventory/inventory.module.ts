import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { InventoryRepository } from './repositories/inventory.repository';
@Module({
  imports: [PrismaModule],
  providers: [InventoryRepository],
  exports: [InventoryRepository],

})
export class InventoryModule {}
