import { DynamicModule } from '@nestjs/common';
import merge from 'deepmerge';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './fake-api-openapi-gen.module-definition.ts';
import {
  createConfiguration,
  DefaultApi,
  ServerConfiguration,
} from './generated/index.ts';
import { type FakeApiOpenapiGenModuleOptions } from './interfaces/fake-api-openapi-gen-module-options.interface.ts';

export class FakeApiOpenapiGenModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE = {}): DynamicModule {
    return merge<DynamicModule>(
      super.register(options),
      {
        providers: [{
          provide: DefaultApi,
          useFactory: ({ baseUrl }: FakeApiOpenapiGenModuleOptions) =>
            new DefaultApi(createConfiguration({
              baseServer: baseUrl
                ? new ServerConfiguration(baseUrl, {})
                : undefined,
            })),
          inject: [MODULE_OPTIONS_TOKEN],
        }],
        exports: [DefaultApi],
      },
    );
  }
}
