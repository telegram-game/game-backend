import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from 'src/modules/prisma';
import { UserProfileModel } from '../models/auth.dto';
import { FullUserModel, FullUserRepositoryModel } from '../models/user.dto';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { User, UserProvider } from '@prisma/client';

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

  async getByProvider(provider: UserProvider, providerId: string): Promise<User> {
    return this.userRepository.getByProvider(provider, providerId);
  }

  async createOrGetFullByProvider(provider: UserProvider, providerId: string, profile: UserProfileModel): Promise<FullUserModel> {
    const user = await this.userRepository.getByProvider(provider, providerId);
    return await this.createOrGetFullById(user?.id, profile);
  }

  async createOrGetFullById(
    userId: string,
    profile: UserProfileModel,
  ): Promise<FullUserModel> {
    const user = userId ? await this.userRepository.getFullById(userId, {
      userProfile: true,
    }): null;
    if (user) {
      return {
        ...user,
        userProfile: user.userProfile[0], // This is a hack to get the first element of the array
        isNew: false,
      };
    }

    const repositories = [this.userRepository, this.userProfileRepository];
    return await this.prismaService.transaction(async () => {
      const userData = await this.userRepository.create({
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
        isNew: true,
      };
    }, repositories);
  }
}
