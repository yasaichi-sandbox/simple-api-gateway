import { DynamicModule } from '@nestjs/common';
import merge from 'deepmerge';
import { apiServiceFactory } from './factories/api-service.factory.ts';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './fake-api-openapi-gen.module-definition.ts';
import { PostApi, UserApi } from './generated/index.ts';

export class FakeApiOpenapiGenModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return merge<DynamicModule>(
      super.register(options),
      {
        providers: [
          {
            provide: PostApi,
            useFactory: apiServiceFactory(PostApi),
            inject: [MODULE_OPTIONS_TOKEN],
          },
          {
            provide: UserApi,
            useFactory: apiServiceFactory(UserApi),
            inject: [MODULE_OPTIONS_TOKEN],
          },
        ],
        exports: [PostApi, UserApi],
      },
    );
  }
}
