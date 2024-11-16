import { Controller, Post } from '@nestjs/common';

@Controller({
  path: ['/api/v1.0/games/inventories'],
  version: ['1.0'],
})
export class InventoryController {
  constructor() {}

  @Post('')
  async getFirst(): Promise<void> {
    // TODO: Buy the chest and random the item and add to inventory
  }
}
