import { User, UserProfiles } from '@prisma/client';

export type FullUserRepositoryModel = User & {
  userProfile: UserProfiles[];
};

export type FullUserModel = User & {
  userProfile: UserProfiles;
};
