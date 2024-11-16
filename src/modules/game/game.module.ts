import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { HeroService } from './services/hero.service';
import { HeroRepository } from './repositories/hero.repository';
import { HeroController } from './controllers/hero.controller';
import { GameProfileRepository } from './repositories/game-profile.repository';
import { HeroAttributeRepository } from './repositories/hero-attribute.repository';
import { GameProfileController } from './controllers/game-profile.controller';
import { InventoryRepository } from './repositories/inventory.repository';
import { GameProfileService } from './services/game-profile.service';
import { HeroSkillRepository } from './repositories/hero-skill.repository';
import { InventoryService } from './services/inventory.service';
import { InventoryAttributeRepository } from './repositories/inventory-attribute.repository';
import { InventoryController } from './controllers/inventory.controller';
@Module({
  imports: [PrismaModule],
  controllers: [GameProfileController, HeroController, InventoryController],
  providers: [
    HeroRepository,
    HeroAttributeRepository,
    HeroSkillRepository,
    InventoryRepository,
    InventoryAttributeRepository,
    GameProfileRepository,
    HeroService,
    GameProfileService,
    InventoryService,
  ],
  exports: [],
})
export class GameModule {}
