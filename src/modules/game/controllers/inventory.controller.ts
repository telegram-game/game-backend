import { Body, Controller, Post, Query } from '@nestjs/common';
import { BuyChestRequest } from '../models/inventory.model.dto';
import { InventoryService } from '../services/inventory.service';
import asyncLocalStorage from 'src/storage/async_local';

@Controller({
  path: ['/api/v1.0/games/inventories'],
  version: ['1.0'],
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('buy/chest')
  async buyChest(@Body() { chestCode }: BuyChestRequest): Promise<void> {
    // TODO: Buy the chest and random the item and add to inventory
    // The cost is in item data file and the const from telegram is from the request. Now we skip the cost check first
    // After we integrate with the payment gateway, we will check the cost
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    console.log('userId', userId, chestCode)
    await this.inventoryService.openChest(chestCode, userId)
  }
}
