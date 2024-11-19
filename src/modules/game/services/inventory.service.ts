import { HttpStatus, Injectable } from '@nestjs/common';
import { ItemCode, ItemType } from '@prisma/client';
import { InventoryRepository } from '../repositories/inventory.repository';
import { SupportService } from 'src/modules/shared/services/support.service';
import { BusinessException } from 'src/exceptions';
import { PrismaService } from 'src/modules/prisma';
import { GameProfileService } from './game-profile.service';
import { InventoryAttributeRepository } from '../repositories/inventory-attribute.repository';
import { BaseInventoryService } from './inventory.base-service';
import { configurationData } from '../../../data/index';
import { ItemAttributeData } from 'src/data/items';

@Injectable()
export class InventoryService extends BaseInventoryService {
  protected readonly itemData = configurationData.items;
  constructor(
    inventoryRepository: InventoryRepository,
    inventoryAttributeRepository: InventoryAttributeRepository,
    gameProfileService: GameProfileService,
    supportService: SupportService,
    prismaService: PrismaService,
  ) {
    super(
      inventoryRepository,
      inventoryAttributeRepository,
      gameProfileService,
      supportService,
      prismaService,
    );
  }

  async getAll(userId: string, gameProfileId: string) {
    return this.inventoryRepository.getAll(userId, gameProfileId);
  }

  async openChest(
    chestCode: string,
    userId: string,
    gameProfileId?: string,
  ): Promise<void> {
    const chest = this.itemData.chests[chestCode];
    if (!chest) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'CHEST_NOT_FOUND',
        errorMessage: 'Chest not found',
      });
    }

    gameProfileId =
      gameProfileId ??
      (await this.gameProfileService.getByIdOrFirst(userId)).id;

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
    await this.prismaService.$transaction(async (tx: PrismaService) => {
      this.inventoryRepository.joinTransaction(tx);
      this.inventoryAttributeRepository.joinTransaction(tx);

      const inventory = await this.inventoryRepository.create({
        userId,
        userGameProfileId: gameProfileId,
        itemCode: itemCode as ItemCode,
        itemType: itemType as ItemType,
        star,
      });

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
    });
  }
}
