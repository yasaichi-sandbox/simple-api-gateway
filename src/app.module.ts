import { FakeApiModule } from '@app/fake-api';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';

@Module({
  imports: [FakeApiModule.register({})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
