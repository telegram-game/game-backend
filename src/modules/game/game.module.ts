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
import { HeroItemRepository } from './repositories/hero-item.repository';
import { HeroItemController } from './controllers/hero-item.controller';
import { HeroItemService } from './services/hero-item.service';
@Module({
  imports: [PrismaModule],
  controllers: [
    GameProfileController,
    HeroController,
    InventoryController,
    HeroItemController,
  ],
  providers: [
    HeroRepository,
    HeroAttributeRepository,
    HeroSkillRepository,
    HeroItemRepository,
    InventoryRepository,
    InventoryAttributeRepository,
    GameProfileRepository,
    HeroService,
    GameProfileService,
    InventoryService,
    HeroItemService,
  ],
  exports: [],
})
export class GameModule {}
