import { FullHero } from './hero.model.dto';

export class HouseData {}

export class FullGameProfile {
  id: string;
  houseData: HouseData;
  skillData: any;
  hero: FullHero;
}
