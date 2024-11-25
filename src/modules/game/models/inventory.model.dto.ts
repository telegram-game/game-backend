import { Optional } from '@nestjs/common';
import {
  UserGameInventories,
  UserGameInventoryAttributes,
} from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaymentProvider } from 'src/data/common/common.model';

export type FullInventoryRepositoryModel = UserGameInventories & {
  userGameInventoryAttributes: UserGameInventoryAttributes[];
  refineCost?: number;
};

export class GetAllInventoryRequest {
  @IsString()
  gameProfileId: string;
}

export class BuyChestRequest {
  @IsString()
  chestCode: string;

  @IsString()
  gameProfileId: string;

  @Optional()
  code: string;
}

export class OpenChestRequirePaymentResponse {
  provider: PaymentProvider;
  codeOrUrl: string;

  constructor(data: Partial<OpenChestRequirePaymentResponse>) {
    Object.assign(this, data);
  }
}

export interface InventoryPaymentMetaData {
  provider: PaymentProvider;
  paymentChargeId: string; // It's the payment charge id from the payment provider directly
  providerPaymentChargeId: string; // It's the payment charge id from the provider of the payment provider. Example: Momo,...
  providerMessageId: number;
  providerUserId: string; // It's the user id from the provider of the payment provider.
  currency: string;
  totalAmount: number;
}

export class RerollItemAttributesRequest {
  @IsString()
  gameProfileId: string;

  @IsString()
  inventoryId: string;

  @IsOptional()
  @IsArray()
  attributeIds?: string[];
}
