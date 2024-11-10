import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { AppInformationRepository } from './repositories/app-information.repository';
import { AppInformationService } from './services/app-information.service';
import { AppInformationController } from './controllers/app-information.controller';
@Module({
  imports: [PrismaModule],
  controllers: [AppInformationController],
  providers: [AppInformationRepository, AppInformationService],
})
export class AppInformationModule {}
