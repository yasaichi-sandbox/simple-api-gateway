import { Module } from '@nestjs/common';
import { EffectiveUsersController } from './effective-users.controller.ts';
import { EffectiveUsersService } from './effective-users.service.ts';

@Module({
  controllers: [EffectiveUsersController],
  providers: [EffectiveUsersService],
})
export class EffectiveUsersModule {}
