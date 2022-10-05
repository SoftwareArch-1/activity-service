import { Module } from '@nestjs/common';
import { ActivityService } from './activity.controller';

@Module({
  imports: [],
  controllers: [ActivityService],
})
export class ActivityModule {}
