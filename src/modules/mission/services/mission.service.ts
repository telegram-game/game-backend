import { HttpStatus, Injectable } from '@nestjs/common';
import { MissionStatus, Missions } from '@prisma/client';
import { MissionRepository } from '../repositories/mission.repository';
import { CreateMissionReqeust, MissionClaimRewardRequest } from '../models/mission';
import { BusinessException } from 'src/exceptions';
import { PrismaService } from 'src/modules/prisma';
import { UserMissionRepository } from '../repositories/user-mission.repository';
import { BalanceService } from 'src/modules/shared/services/balance.service';

@Injectable()
export class MissionService {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly userMissionRepository: UserMissionRepository,
    private readonly balanceService: BalanceService,
    private readonly prismaService: PrismaService,
  ) { }

  async gets(): Promise<Missions[]> {
    return this.missionRepository.gets();
  }

  async create(data: CreateMissionReqeust): Promise<Missions> {
    if (data.fromDate >= data.toDate) {
      throw new BusinessException({ status: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_DATE_RANGE', errorMessage: 'From date must be less than to date' });
    }

    const now = new Date();
    let status: MissionStatus = MissionStatus.ACTIVE;
    if (now < data.fromDate) {
      status = MissionStatus.INACTIVE;
    } else if (now > data.toDate) {
      status = MissionStatus.EXPIRED;
    }

    // To active a mission, we should have a job to check the status of mission and update it

    const metaData = {
      token: data.rewardToken,
      rewardValue: data.rewardValue,
      socialType: data.socialType,
      socialIdOrLink: data.socialIdOrLink,
    }
    return await this.missionRepository.create({
      code: data.code,
      name: data.name,
      description: data.description,
      status: status,
      fromDate: data.fromDate,
      toDate: data.toDate,
      totalBudget: data.totalBudget,
      currentClaimed: 0,
      metaData: metaData,
    }).catch((error) => {
      if (error.code === 'P2002') {
        throw new BusinessException({ status: HttpStatus.BAD_REQUEST, errorCode: 'DUPLICATE_MISSION_CODE', errorMessage: 'Mission code is duplicated' });
      }
      throw error;
    });
  }

  async getsSatifiedByUserId(userId: string): Promise<Missions[]> {
    return this.missionRepository.getsSatifiedByUserId(userId)
    .then((missions) => missions.filter((mission) => !mission.userMissions || mission.userMissions?.length === 0));
  }

  async getById(id: string): Promise<Missions> {
    return this.missionRepository.getSatifiedById(id);
  }

  async claimReward(userId: string, data: MissionClaimRewardRequest): Promise<void> {
    // TODO: Don't check the token first before we integrate with the wallet service

    const mission = await this.missionRepository.getSatifiedById(data.missionId);
    if (!mission) {
      throw new BusinessException({ status: HttpStatus.BAD_REQUEST, errorCode: 'MISSION_NOT_FOUND', errorMessage: 'Mission not found' });
    }

    const repositories = [this.missionRepository, this.userMissionRepository];
    await this.prismaService.transaction(async () => {
      await this.userMissionRepository.create({
        userId: userId,
        missionId: data.missionId,
      }).catch((error) => {
        if (error.code === 'P2002') {
          throw new BusinessException({ status: HttpStatus.BAD_REQUEST, errorCode: 'DUPLICATE_MISSION_CLAIM', errorMessage: 'Mission is already claimed' });
        }
        throw error;
      });
      await this.missionRepository.updateCurrentTotalClaimedWithSatifyCondition(data.missionId, mission.metaData.rewardValue);
      await this.missionRepository.updateToEnoughBudget(data.missionId);

    }, repositories);

    // Call to balance service to increase the balance
    await this.balanceService.increase(userId, mission.metaData.token, mission.metaData.rewardValue, {
      type: 'mission-completed',
        additionalData: {
          missionId: data.missionId,
          complatedAt: new Date(),
        }
    });
  }
}
