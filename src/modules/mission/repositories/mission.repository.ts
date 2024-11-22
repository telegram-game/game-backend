import { Injectable, Scope } from '@nestjs/common';
import { MissionStatus, Missions } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { FullMissionRepositoryModel } from '../models/mission';

@Injectable({
  scope: Scope.REQUEST,
})
export class MissionRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async gets(): Promise<Missions[]> {
    return this.client.missions.findMany();
  }

  async getSatifiedById(id: string): Promise<Missions> {
    const now = new Date();
    return this.client.missions.findFirst({
      where: {
        id: id,
        status: MissionStatus.ACTIVE,
        fromDate: {
          lte: now,
        },
        toDate: {
          gte: now,
        },
        totalBudget: {
          gt: this.client.missions.fields.currentClaimed,
        },
      }
    });
  }

  async create(
    data: Partial<Missions>,
  ): Promise<Missions> {
    return this.client.missions.create({
      data: data as Missions,
    });
  }

  async getsSatifiedByUserId(userId: string): Promise<FullMissionRepositoryModel[]> {
    const now = new Date();
    return this.client.missions.findMany({
      where: {
        status: MissionStatus.ACTIVE,
        fromDate: {
          lte: now,
        },
        toDate: {
          gte: now,
        },
        totalBudget: {
          gt: this.client.missions.fields.currentClaimed,
        },
      },
      include: {
        userMissions: {
          where: {
            userId: userId,
          }
        }
      }
    });
  }

  async updateCurrentTotalClaimedWithSatifyCondition(id: string, claimAmount: number): Promise<Missions> {
    const now = new Date();
    return this.client.missions.update({
      where: {
        id: id,
        status: MissionStatus.ACTIVE,
        fromDate: {
          lte: now,
        },
        toDate: {
          gte: now,
        },
        totalBudget: {
          gt: this.client.missions.fields.currentClaimed,
        },
      },
      data: {
        currentClaimed: {
          increment: claimAmount,
        },
      }
    });
  }

  async updateToEnoughBudget(id: string): Promise<void> {
    await this.client.missions.updateMany({
      where: {
        id: id,
        status: MissionStatus.ACTIVE,
        totalBudget: {
          lte: this.client.missions.fields.currentClaimed,
        }
      },
      data: {
        status: MissionStatus.ENOUGH_BUDGET,
      }
    });
  }
}
