import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ItemCode,
  ItemType,
  Tokens,
  UserGameInventories,
  UserGameInventoryAttributes,
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
import { FullInventoryRepositoryModel, InventoryPaymentMetaData, OpenChestRequirePaymentResponse } from '../models/inventory.model.dto';
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

  async getAll(userId: string, gameProfileId: string): Promise<FullInventoryRepositoryModel[]> {
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

  async rerollAttributes(
    userId: string,
    gameProfileId: string,
    inventoryId: string,
    attributeIds?: string[],
  ): Promise<FullInventoryRepositoryModel> {
    const inventory = await this.inventoryRepository.getById(inventoryId, userId, gameProfileId);
    if (!inventory) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'INVENTORY_NOT_FOUND',
        errorMessage: 'Inventory not found',
      });
    }

    const rerollCost = this.calculateRerollCost(inventory.lastRerollDate, inventory.rerollCount);
    if (rerollCost.cost > 0) {
      await this.balanceService.decrease(
        userId,
        rerollCost.token as Tokens,
        rerollCost.currentRerollCount,
        {
          type: 'reroll-item-attributes',
          inventoryId,
          rerollDate: new Date(),
          rerollData: rerollCost,
        },
      );
    }

    const repositories = [this.inventoryRepository, this.inventoryAttributeRepository];
    await this.prismaService.transaction(async () => {
      let attributes: UserGameInventoryAttributes[] = [];
      if (Array.isArray(attributeIds) && attributeIds.length > 0) {
        // Reroll selected attributes
        attributes = inventory.userGameInventoryAttributes.filter(
          (attribute) => attribute.canRoll && attributeIds.includes(attribute.id),
        );

        // Check again if the data from user is incorrect. Reroll all attributes if the data is incorrect
        if (attributes.length === 0) {
          attributes = inventory.userGameInventoryAttributes.filter(
            (attribute) => attribute.canRoll,
          );
        }
      } else {
        // Reroll all attributes
        attributes = inventory.userGameInventoryAttributes.filter(
          (attribute) => attribute.canRoll,
        );
      }

      await this.inventoryRepository.updateOptimistic({
        id: inventory.id,
        userId,
        userGameProfileId: gameProfileId,
        lastRerollDate: new Date(),
        rerollCount: rerollCost.currentRerollCount + 1,
      }, inventory.updatedAt);

      for (const attribute of attributes) {
        const star = parseInt(
          this.supportService.randomWithRate(
            this.itemData.itemAttributes[attribute.attribute][attribute.star].starRate,
          ),
        );
        const value = {
          point: this.supportService.buildValue(
            this.itemData.itemAttributes[attribute.attribute][star].value.point,
            star,
          ),
          percent: this.supportService.buildValue(
            this.itemData.itemAttributes[attribute.attribute][star].value.percent,
            star,
          ),
          percentPerTime: this.supportService.buildValue(
            this.itemData.itemAttributes[attribute.attribute][star].value.percentPerTime,
            star,
          ),
        };
        await this.inventoryAttributeRepository.create(
          {
            id: attribute.id,
            userId,
            inventoryId: inventory.id,
            attribute: attribute.attribute,
            star,
            value,
          });
      }


    }, repositories);
  }

  private calculateRerollCost(lastRerollDate: Date, rerollCount: number): {
    cost: number;
    token: Tokens;
    currentRerollCount: number;
  } {
    const cost = this.itemData.rerollData;
    if (!cost) {
      return {
        cost: 0,
        token: null,
        currentRerollCount: rerollCount,
      }
    }
    const now = new Date();
    // Compare the date. If the same date, use the algorithm to calculate the cost
    if (lastRerollDate.getDate() === now.getDate()) {
      return {
        cost: cost.value * Math.pow(2, rerollCount),
        token: cost.token,
        currentRerollCount: rerollCount,
      }
    }

    return {
      cost: cost.value,
      token: cost.token,
      currentRerollCount: 0,
    }
  }
}
