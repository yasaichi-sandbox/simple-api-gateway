import { FakeApiKiotaModule } from '@app/fake-api-kiota';
import { Module } from '@nestjs/common';
import { SimpleUsersController } from './simple-users.controller.ts';
import { SimpleUsersService } from './simple-users.service.ts';

@Module({
  imports: [FakeApiKiotaModule.register({})],
  controllers: [SimpleUsersController],
  providers: [SimpleUsersService],
})
export class SimpleUsersModule {}
