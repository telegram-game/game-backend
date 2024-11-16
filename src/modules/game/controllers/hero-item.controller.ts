import { Body, Controller, Post, Query } from '@nestjs/common';
import { BuyChestRequest } from '../models/inventory.model.dto';
import { InventoryService } from '../services/inventory.service';
import asyncLocalStorage from 'src/storage/async_local';
import { EquipRequest, UnEquipRequest } from '../models/hero-item.dto';

@Controller({
  path: ['/api/v1.0/games/hero-items'],
  version: ['1.0'],
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('equip')
  async equip(@Body() data: EquipRequest): Promise<void> {
    
  }

  @Post('unequip')
  async unequip(@Body() data: UnEquipRequest): Promise<void> {
  }
}
