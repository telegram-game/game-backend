import {
  UserGameInventories,
  UserGameInventoryAttributes,
} from '@prisma/client';

export type FullInventoryRepositoryModel = UserGameInventories & {
  userGameInventoryAttributes: UserGameInventoryAttributes[];
};
