import { apiClientServiceFactory, NestRequestAdapter } from '@app/nestjs-kiota';
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import {
  FetchRequestAdapter,
  HttpClient,
} from '@microsoft/kiota-http-fetchlibrary';
import { DynamicModule } from '@nestjs/common';
import merge from 'deepmerge';
import { FAKE_API_KIOTA_SERVICE_TOKEN } from './fake-api-kiota.constants.ts';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './fake-api-kiota.module-definition.ts';
import { createApiClient } from './generated/apiClient.ts';
import { type FakeApiKiotaModuleOptions } from './interfaces/fake-api-kiota-module-options.interface.ts';

export class FakeApiKiotaModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return merge<DynamicModule>(
      super.register(options),
      {
        providers: [{
          provide: FAKE_API_KIOTA_SERVICE_TOKEN,
          useFactory: ({ baseUrl, customFetch }: FakeApiKiotaModuleOptions) => {
            const requestAdapter = new FetchRequestAdapter(
              new AnonymousAuthenticationProvider(),
              undefined,
              undefined,
              new HttpClient(customFetch || fetch),
            );
            if (baseUrl) {
              requestAdapter.baseUrl = baseUrl;
            }

            return apiClientServiceFactory(
              createApiClient(new NestRequestAdapter(requestAdapter)),
            );
          },
          inject: [MODULE_OPTIONS_TOKEN],
        }],
        exports: [FAKE_API_KIOTA_SERVICE_TOKEN],
      },
    );
  }
}
