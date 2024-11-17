import { HeroAttribute, ItemType } from '@prisma/client';
import itemData from './item.json';
import { Star } from '../common/common.model';

export class Chest {
  code: string;
  name: string;
  itemTypeRates: {
    [key in ItemType]?: number;
  };
  itemTypeCodeRates: {
    [key in ItemType]?: {
      [key: string]: number;
    };
  };
  fixedItemAttributesCount: number;
  flexibleItemAttributesCount: number;
  starRates: {
    [key in Star]?: number;
  };
}

export class Item {
  code: string;
  name: string;
}

export class ItemAttributeData {
  attribute: HeroAttribute;
  starRate: {
    [key in Star]?: number;
  };
  value: {
    point?: {
      value?: number;
      min?: number;
      max?: number;
    };
    percent?: {
      value?: number;
      min?: number;
      max?: number;
    };
    percentPerTime?: {
      value?: number;
      min?: number;
      max?: number;
    };
  };
}

export type ItemAttribute = {
  [key in ItemType]?: {
    [key in Star]?: {
      fixedItemAttributes: ItemAttributeData[];
      flexibleItemAttributes: ItemAttributeData[];
    };
  };
};

export class ItemConfigData {
  chests: {
    [key: string]: Chest;
  };
  items: {
    [key: string]: Item;
  };
  itemAttributes: ItemAttribute;
}

export const items = itemData as ItemConfigData;
