import { Tokens } from '@prisma/client';
import gameData from './game.json';

export class GameConfigData {
  match: {
    basePoint: number;
    pointPerDiff100Rank: number;
    maxDiffPoint: number;
    rewardToken: Tokens;
    rewardTokenValue: number;
  };
  energy: {
    maxEnergy: number;
    claimTimeBlockInSeconds: number;
    defaultInitEnergy: number;
    claimEnergyAmount: number;
    claimEnergyDescription: string;
  };
}

export const game = gameData as GameConfigData;
