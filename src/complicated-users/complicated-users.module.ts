import { Module } from '@nestjs/common';
import { ComplicatedUsersController } from './complicated-users.controller.ts';
import { ComplicatedUsersService } from './complicated-users.service.ts';

@Module({
  controllers: [ComplicatedUsersController],
  providers: [ComplicatedUsersService],
})
export class ComplicatedUsersModule {}
