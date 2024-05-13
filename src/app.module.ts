import { FakeApiOpenapiGenModule } from '@app/fake-api-openapi-gen';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.ts';
import { AppInterceptor } from './app.interceptor.ts';
import { AppService } from './app.service.ts';
import { ComplicatedUsersModule } from './complicated-users/complicated-users.module.ts';
import { EffectiveUsersModule } from './effective-users/effective-users.module.ts';
import { NaiveUsersModule } from './naive-users/naive-users.module.ts';
import { RealworldUsersModule } from './realworld-users/realworld-users.module.ts';

@Module({
  imports: [
    FakeApiOpenapiGenModule.register({ global: true }),
    ComplicatedUsersModule,
    EffectiveUsersModule,
    NaiveUsersModule,
    RealworldUsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
