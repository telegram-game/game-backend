import { HeroAttribute, ItemType, Tokens } from '@prisma/client';
import itemData from './item.json';
import { PaymentProvider, Star } from '../common/common.model';
import { TelegramCurrency } from 'src/modules/telegram';

export class Chest {
  code: string;
  name: string;
  description: string;
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
  cost?: {
    token: Tokens | TelegramCurrency | string;
    value: number;
    isExtenalToken: boolean;
    externalTokenProvider?: PaymentProvider;
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
  rerollData: {
    token: Tokens;
    value: number;
    multiplier: number;
  }
}

export const items = itemData as ItemConfigData;
