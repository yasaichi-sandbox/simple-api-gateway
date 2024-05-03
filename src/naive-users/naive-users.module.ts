import { Module } from '@nestjs/common';
import { NaiveUsersController } from './naive-users.controller.ts';
import { NaiveUsersService } from './naive-users.service.ts';

@Module({
  controllers: [NaiveUsersController],
  providers: [NaiveUsersService],
})
export class NaiveUsersModule {}
