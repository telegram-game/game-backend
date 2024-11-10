import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { HeroService } from './services/hero.service';
import { HeroRepository } from './repositories/hero.repository';
import { HeroController } from './controllers/hero.controller';
import { InventoryRepository } from '../inventory/repositories/inventory.repository';
@Module({
  imports: [PrismaModule, InventoryRepository],
  controllers: [HeroController],
  providers: [HeroRepository, HeroService],
})
export class HeroModule {}
