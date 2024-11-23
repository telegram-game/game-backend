import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ItemCode,
  ItemType,
  Tokens,
  UserGameInventories,
} from '@prisma/client';
import { InventoryRepository } from '../repositories/inventory.repository';
import { SupportService } from 'src/modules/shared/services/support.service';
import { BusinessException } from 'src/exceptions';
import { PrismaService } from 'src/modules/prisma';
import { InventoryAttributeRepository } from '../repositories/inventory-attribute.repository';
import { BaseInventoryService } from './inventory.base-service';
import { configurationData } from '../../../data/index';
import { ItemAttributeData } from 'src/data/items';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import { TelegramBotService, TelegramCurrency } from 'src/modules/telegram';
import { InventoryPaymentMetaData, OpenChestRequirePaymentResponse } from '../models/inventory.model.dto';
import { Environment } from 'src/config/validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InventoryService extends BaseInventoryService {
  protected readonly itemData = configurationData.items;
  private readonly env: Environment;
  constructor(
    private readonly balanceService: BalanceService,
    private readonly telegramBotService: TelegramBotService,
    inventoryRepository: InventoryRepository,
    inventoryAttributeRepository: InventoryAttributeRepository,
    configService: ConfigService,
    supportService: SupportService,
    prismaService: PrismaService,
  ) {
    super(
      inventoryRepository,
      inventoryAttributeRepository,
      supportService,
      prismaService,
    );

    this.env = configService.get<Environment>('env');
  }

  async getAll(userId: string, gameProfileId: string) {
    return this.inventoryRepository.getAll(userId, gameProfileId);
  }

  async openChest(
    chestCode: string,
    userId: string,
    gameProfileId: string,
    options?: {
      ignoreCost?: boolean;
    },
  ): Promise<UserGameInventories | OpenChestRequirePaymentResponse> {
    const chest = this.itemData.chests[chestCode];
    if (!chest) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'CHEST_NOT_FOUND',
        errorMessage: 'Chest not found',
      });
    }

    const cost = options?.ignoreCost ? null : chest.cost;
    if (cost) {
      // Get cost value from the environment. If the environment is local or development, the cost value will be 1 for testing
      const costValue = [Environment.Local, Environment.Development].includes(this.env) ? 1 : cost.value;
      if (cost.isExtenalToken && costValue > 0) {
        if (
          cost.externalTokenProvider !== 'TELEGRAM' ||
          Object.values(TelegramCurrency).indexOf(
            cost.token as TelegramCurrency,
          ) < 0
        ) {
          throw new BusinessException({
            status: HttpStatus.BAD_REQUEST,
            errorCode: 'EXTERNAL_TOKEN_NOT_SUPPORTED',
            errorMessage: `External token ${cost.token} with provider ${cost.externalTokenProvider} is not supported`,
          });
        }

        const invoiceLink = await this.telegramBotService.createInvoice(
          [
            {
              label: chest.name,
              amount: costValue,
            },
          ],
          cost.token as TelegramCurrency,
          {
            title: chest.name,
            description: chest.description,
            payload: {
              chestCode,
              userId,
              gameProfileId,
            },
          },
        );

        return new OpenChestRequirePaymentResponse({
          provider: cost.externalTokenProvider,
          codeOrUrl: invoiceLink,
        });
      }

      const balance = await this.balanceService.get(
        userId,
        cost.token as Tokens,
      );
      if (!balance || balance.balance < cost.value) {
        throw new BusinessException({
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'INSUFFICIENT_BALANCE',
          errorMessage: 'Insufficient balance',
        });
      }

      await this.balanceService.decrease(
        userId,
        cost.token as Tokens,
        cost.value,
        {
          type: 'buy-item',
          itemType: 'chest',
          itemCode: chestCode,
          buyAt: new Date(),
        },
      );
    }

    return await this.openChestExecution(chestCode, userId, gameProfileId);
  }

  async openChestExecution(
    chestCode: string,
    userId: string,
    gameProfileId: string,
    options?: InventoryPaymentMetaData,
  ): Promise<UserGameInventories> {
    const chest = this.itemData.chests[chestCode];
    if (!chest) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'CHEST_NOT_FOUND',
        errorMessage: 'Chest not found',
      });
    }

    // Random the item
    const itemType = this.supportService.randomWithRate(chest.itemTypeRates);
    const itemCodeList = chest.itemTypeCodeRates[itemType] ?? [];
    const itemCode = this.supportService.randomWithRate(itemCodeList);
    const star = parseInt(this.supportService.randomWithRate(chest.starRates));
    const attributes = this.itemData.itemAttributes[itemType][star];
    const fixedAttributes =
      this.supportService.randomWithList<ItemAttributeData>(
        attributes.fixedItemAttributes,
        chest.fixedItemAttributesCount,
        true,
      );
    const flexibleItemAttributes =
      this.supportService.randomWithList<ItemAttributeData>(
        attributes.flexibleItemAttributes,
        chest.flexibleItemAttributesCount,
        true,
      );

    const repositories = [
      this.inventoryRepository,
      this.inventoryAttributeRepository,
    ];
    return await this.prismaService.transaction(async () => {
      let inventory: UserGameInventories ={
        userId,
        userGameProfileId: gameProfileId,
        itemCode: itemCode as ItemCode,
        itemType: itemType as ItemType,
        star,
      } as UserGameInventories;

      if (options) {
        inventory.paymentCode = `${options.provider}-${options.paymentChargeId}`;
        inventory.paymentMetaData = options;
      }

      inventory = await this.inventoryRepository.create(inventory);

      // Add attributes
      for (const attribute of fixedAttributes) {
        const star = parseInt(
          this.supportService.randomWithRate(attribute.starRate),
        );
        const value = {
          point: this.supportService.buildValue(attribute.value.point, star),
          percent: this.supportService.buildValue(
            attribute.value.percent,
            star,
          ),
          percentPerTime: this.supportService.buildValue(
            attribute.value.percentPerTime,
            star,
          ),
        };
        await this.inventoryAttributeRepository.create({
          userId,
          inventoryId: inventory.id,
          attribute: attribute.attribute,
          star,
          value,
          canRoll: false,
        });
      }

      for (const attribute of flexibleItemAttributes) {
        const star = parseInt(
          this.supportService.randomWithRate(attribute.starRate),
        );
        const value = {
          point: this.supportService.buildValue(attribute.value.point, star),
          percent: this.supportService.buildValue(
            attribute.value.percent,
            star,
          ),
          percentPerTime: this.supportService.buildValue(
            attribute.value.percentPerTime,
            star,
          ),
        };
        await this.inventoryAttributeRepository.create({
          userId,
          inventoryId: inventory.id,
          attribute: attribute.attribute,
          star,
          value,
          canRoll: true,
        });
      }

      return inventory;
    }, repositories);
  }
}
