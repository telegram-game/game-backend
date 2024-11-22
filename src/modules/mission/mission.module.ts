import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { MissionRepository } from './repositories/mission.repository';
import { MissionService } from './services/mission.service';
import { InternalMissionController } from './controllers/mission.internal.controller';
import { MissionController } from './controllers/mission.controller';
import { UserMissionRepository } from './repositories/user-mission.repository';
import { CheckinController } from './controllers/checkin.controller';
import { CheckinRepository } from './repositories/checkin.repository';
import { CheckinService } from './services/checkin.service';
@Module({
  imports: [PrismaModule],
  controllers: [
    InternalMissionController,
    MissionController,
    CheckinController,
  ],
  providers: [
    MissionRepository,
    UserMissionRepository,
    CheckinRepository,
    MissionService,
    CheckinService,
  ],
  exports: [],
})
export class MissionModule {}
