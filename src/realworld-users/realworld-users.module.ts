import { Module } from '@nestjs/common';
import { RealworldUsersController } from './realworld-users.controller.ts';
import { RealworldUsersService } from './realworld-users.service.ts';

@Module({
  controllers: [RealworldUsersController],
  providers: [RealworldUsersService],
})
export class RealworldUsersModule {}
