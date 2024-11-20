import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMissionReqeust } from '../models/mission';
import { MissionService } from '../services/mission.service';
import { Missions } from '@prisma/client';
import { NotRequireAuthentication } from 'src/decorators';

@Controller({
  path: ['/internal/api/v1.0/missions'],
  version: ['1.0'],
})
@NotRequireAuthentication()
export class InternalMissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('')
  async gets(): Promise<Missions[]> {
    return await this.missionService.gets();
  }

  @Post('')
  async create(@Body() data: CreateMissionReqeust): Promise<Missions> {
    return await this.missionService.create(data);
  }
}
