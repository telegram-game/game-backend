import { HttpStatus, Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { HeroItemRepository } from '../repositories/hero-item.repository';
import { EquipRequest, UnEquipRequest } from '../models/hero-item.dto';
import { BusinessException } from 'src/exceptions';

@Injectable()
export class HeroItemService {
  constructor(
    private readonly heroItemRepository: HeroItemRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async equip(userId: string, data: EquipRequest): Promise<void> {
    const inventory = await this.inventoryRepository.getById(
      data.inventoryId,
      userId,
      data.gameProfileId,
    );
    if (!inventory) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'INVALID_INVENTORY',
        errorMessage: 'Inventory not found',
      });
    }

    const sameTypeEquipped = await this.heroItemRepository.getItemByHeroAndType(
      userId,
      data.heroId,
      inventory.itemType,
    );
    if (sameTypeEquipped) {
      if (sameTypeEquipped.inventoryId === data.inventoryId) {
        throw new BusinessException({
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'DUPLICATE_INVENTORY',
          errorMessage: 'Inventory already equipped',
        });
      }

      await this.heroItemRepository.updateOptimistic(
        {
          id: sameTypeEquipped.id,
          userId: userId,
          userGameHeroId: data.heroId,
          inventoryId: inventory.id,
          itemType: inventory.itemType,
        },
        sameTypeEquipped.updatedAt,
      );
    } else {
      // Will throw error when hit unique constraint
      await this.heroItemRepository
        .create({
          userId: userId,
          userGameHeroId: data.heroId,
          inventoryId: inventory.id,
          itemType: inventory.itemType,
        })
        .catch((e) => {
          if (e.code === 'P2002') {
            throw new BusinessException({
              status: HttpStatus.BAD_REQUEST,
              errorCode: 'DUPLICATE_INVENTORY',
              errorMessage: 'Inventory already equipped',
            });
          }
        });
    }
  }

  async unequip(userId: string, data: UnEquipRequest): Promise<void> {
    await this.heroItemRepository.remove(userId, data.heroId, data.inventoryId);
  }
}
