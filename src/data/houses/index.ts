import { GameHouse } from "@prisma/client";
import houseData from './house.json'

export class HouseAttribute {
    attackLevel: number;
    hpLevel: number;
    luckLevel: number;
}

export class HouseData {
    name: string;
    description: string;
    attributes: HouseAttribute
}

export type HouseConfigData = {
    [key in GameHouse]?: HouseData
}

export const houses = houseData as HouseConfigData;