import { HouseData } from 'src/data/houses';
import { FullHero } from './hero.model.dto';

export class FullGameProfile {
  id: string;
  houseData: HouseData;
  skillData: any;
  hero: FullHero;
}
