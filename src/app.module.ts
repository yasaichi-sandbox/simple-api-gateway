import { FakeApiKiotaModule } from '@app/fake-api-kiota';
import { FakeApiOpenapiGenModule } from '@app/fake-api-openapi-gen';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.ts';
import { AppInterceptor } from './app.interceptor.ts';
import { AppService } from './app.service.ts';
import { ComplicatedUsersModule } from './complicated-users/complicated-users.module.ts';
import { EffectiveUsersModule } from './effective-users/effective-users.module.ts';
import { SimpleUsersModule } from './simple-users/simple-users.module.ts';

@Module({
  imports: [
    FakeApiKiotaModule.register({ global: true }),
    FakeApiOpenapiGenModule.register({ global: true }),
    ComplicatedUsersModule,
    EffectiveUsersModule,
    SimpleUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: AppInterceptor,
  }],
})
export class AppModule {}
