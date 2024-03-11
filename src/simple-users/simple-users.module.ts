import { Module } from '@nestjs/common';
import { SimpleUsersController } from './simple-users.controller.ts';
import { SimpleUsersService } from './simple-users.service.ts';

@Module({
  controllers: [SimpleUsersController],
  providers: [SimpleUsersService],
})
export class SimpleUsersModule {}
