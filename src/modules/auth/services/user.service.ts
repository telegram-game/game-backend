import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from 'src/modules/prisma';
import { UserProfileModel } from '../models/auth.dto';
import { FullUserModel, FullUserRepositoryModel } from '../models/user.dto';
import { UserProfileRepository } from '../repositories/user-profile.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private prismaService: PrismaService,
  ) {}

  async getById(userId: string, options?: {
  }): Promise<FullUserRepositoryModel> {
    return this.userRepository.getFullById(userId, options);
  }

  async createOrGetFullById(
    userId: string,
    profile: UserProfileModel,
  ): Promise<FullUserModel> {
    const user = await this.userRepository.getFullById(userId, {
      userProfile: true,
    });
    if (user) {
      return {
        ...user,
        userProfile: user.userProfile[0], // This is a hack to get the first element of the array
      };
    }

    return await this.prismaService.$transaction(async (tx: PrismaService) => {
      this.userRepository.joinTransaction(tx);
      this.userProfileRepository.joinTransaction(tx);

      const userData = await this.userRepository.create({
        id: userId,
        provider: profile.provider,
        providerId: profile.providerId,
      });
      const profileData = await this.userProfileRepository.create({
        userId: userData.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        avatar: profile.avatar,
      });

      return {
        ...userData,
        userProfile: profileData,
      };
    });
  }
}
