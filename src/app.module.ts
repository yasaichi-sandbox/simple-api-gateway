import { FakeApiModule } from '@app/fake-api';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.ts';
import { AppInterceptor } from './app.interceptor.ts';
import { AppService } from './app.service.ts';

@Module({
  imports: [FakeApiModule.register({})],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: AppInterceptor,
  }],
})
export class AppModule {}
