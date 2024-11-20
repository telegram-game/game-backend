import { Injectable } from '@nestjs/common';
import { HeroSkill } from '@prisma/client';
import { InventoryRepository } from '../repositories/inventory.repository';
import { SupportService } from 'src/modules/shared/services/support.service';
import { PrismaService } from 'src/modules/prisma';
import { InventoryAttributeRepository } from '../repositories/inventory-attribute.repository';
import { configurationData } from '../../../data/index';

@Injectable()
export class BaseInventoryService {
  protected readonly itemData = configurationData.items;

  protected readonly defaultSkill = HeroSkill.DESOLATE;
  constructor(
    protected readonly inventoryRepository: InventoryRepository,
    protected readonly inventoryAttributeRepository: InventoryAttributeRepository,
    protected readonly supportService: SupportService,
    protected readonly prismaService: PrismaService,
  ) {}

  async create() {}
}
