import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { MissionRepository } from './repositories/mission.repository';
import { MissionService } from './services/mission.service';
import { InternalMissionController } from './controllers/mission.internal.controller';
import { MissionController } from './controllers/mission.controller';
import { UserMissionRepository } from './repositories/user-mission.repository';
@Module({
  imports: [PrismaModule],
  controllers: [InternalMissionController, MissionController],
  providers: [
    MissionRepository,
    UserMissionRepository,
    MissionService,
  ],
  exports: [],
})
export class MissionModule {}
