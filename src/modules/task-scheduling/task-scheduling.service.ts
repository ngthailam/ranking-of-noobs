import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskSchedulingService {
  private readonly logger = new Logger(TaskSchedulingService.name);

  constructor(private readonly userService: UserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  updateRank() {
    this.logger.debug('[updateRank] Updating rank for all users....');
    this.userService.updateAllUsersRank();
    this.logger.debug('[updateRank] DONE updating rank for all users....');
  }
}
