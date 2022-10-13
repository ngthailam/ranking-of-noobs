import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TaskSchedulingService } from './task-scheduling.service';

@Module({
  imports: [UserModule],
  providers: [TaskSchedulingService],
})
export class TaskSchedulingModule {}
