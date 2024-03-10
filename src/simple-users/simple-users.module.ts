import { FakeApiModule } from '@app/fake-api';
import { Module } from '@nestjs/common';
import { SimpleUsersController } from './simple-users.controller.ts';
import { SimpleUsersService } from './simple-users.service.ts';

@Module({
  imports: [FakeApiModule.register({})],
  controllers: [SimpleUsersController],
  providers: [SimpleUsersService],
})
export class SimpleUsersModule {}
