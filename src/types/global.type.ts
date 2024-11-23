import { Tokens } from '@prisma/client';
import { RequestContext } from 'src/models';
import { SocialType } from 'src/modules/mission/models/mission';
import {InventoryPaymentMetaData as GameInventoryPaymentMetaData} from 'src/modules/game/models/inventory.model.dto'; 

declare global {
  // eslint-disable-next-line  @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      context: RequestContext;
      rawBody: Buffer;
    }
  }

  // eslint-disable-next-line  @typescript-eslint/no-namespace
  namespace PrismaJson {
    export interface HeroAttributeValue {
      point: number;
      percent: number;
      percentPerTime: number;
    }

    export interface BalanceHistoryMetadata {
      type:
        | 'claim'
        | 'deposit'
        | 'withdraw'
        | 'upgrade-attribute'
        | 'mission-completed'
        | 'referral-completed'
        | 'checkin-completed'
        | 'buy-item'
        | 'win-rank-match';
      additionalData: any;
    }

    export interface MissionMetadata {
      token: Tokens;
      rewardValue: number;
      socialType: SocialType;
      socialIdOrLink?: string;
    }

    export interface InventoryPaymentMetaData extends GameInventoryPaymentMetaData {}
  }
}
