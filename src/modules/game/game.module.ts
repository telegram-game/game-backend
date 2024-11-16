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
@Module({
  imports: [PrismaModule],
  controllers: [GameProfileController, HeroController],
  providers: [
    HeroRepository,
    HeroAttributeRepository,
    HeroSkillRepository,
    InventoryRepository,
    GameProfileRepository,
    HeroService,
    GameProfileService,
  ],
  exports: [HeroService],
})
export class GameModule {}
