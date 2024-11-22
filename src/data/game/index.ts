import gameData from './game.json';

export class GameConfigData {
  match: {
    maxEnergy: number;
    claimTimeBlockInSeconds: number;
    defaultInitEnergy: number;
    claimEnergyAmount: number;
    claimEnergyDescription: string;
  };
}

export const game = gameData as GameConfigData;
