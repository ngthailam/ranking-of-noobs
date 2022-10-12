import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class StatsService {

  constructor(
    private readonly userService: UserService
  ) {}

  getLeaderboard() {
    return this.userService.getSortByElo();
  }
}
