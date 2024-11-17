import { RequestContext } from 'src/models';

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
  }
}
