import { DynamicModule } from '@nestjs/common';
import { FAKE_API_SERVICE_TOKEN } from './fake-api.constants.ts';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './fake-api.module-definition.ts';
import { Configuration, DefaultApi } from './generated/index.ts';

export class FakeApiModule extends ConfigurableModuleClass {
  static register(
    { baseUrl, ...restOptions }: typeof OPTIONS_TYPE,
  ): DynamicModule {
    return {
      ...super.register(restOptions),
      providers: [{
        provide: FAKE_API_SERVICE_TOKEN,
        useValue: {
          default: new DefaultApi(new Configuration({ basePath: baseUrl })),
        },
      }],
      exports: [FAKE_API_SERVICE_TOKEN],
    };
  }
}
