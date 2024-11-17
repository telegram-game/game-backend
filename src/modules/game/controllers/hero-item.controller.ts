import { Body, Controller, Post } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { EquipRequest, UnEquipRequest } from '../models/hero-item.dto';
import { HeroItemService } from '../services/hero-item.service';

@Controller({
  path: ['/api/v1.0/games/hero-items'],
  version: ['1.0'],
})
export class HeroItemController {
  constructor(private readonly heroItemService: HeroItemService) {}

  @Post('equip')
  async equip(@Body() data: EquipRequest): Promise<void> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return await this.heroItemService.equip(userId, data);
  }

  @Post('unequip')
  async unequip(@Body() data: UnEquipRequest): Promise<void> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return await this.heroItemService.unequip(userId, data);
  }
}
