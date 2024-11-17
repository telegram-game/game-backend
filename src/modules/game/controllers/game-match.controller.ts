import { Body, Controller, Post } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { GameMatchService } from '../services/game-match.service';
import {
  FightWithFriendRequest,
  GameMatchResult,
} from '../models/game-match.dto';

@Controller({
  path: ['/api/v1.0/games/game-matchs'],
  version: ['1.0'],
})
export class GameMatchController {
  constructor(private gameMatchService: GameMatchService) {}

  @Post('fight/by-friend')
  async fightByFriend(
    @Body() data: FightWithFriendRequest,
  ): Promise<GameMatchResult> {
    // Now providerId is userId to mock the fight with friend
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return this.gameMatchService.fightingWithFriend(
      userId,
      data.provider,
      data.providerId,
    ); // Should find the way to apply game profile id
  }
}
