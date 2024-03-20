import { apiClientServiceFactory, NestRequestAdapter } from '@app/nestjs-kiota';
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import {
  FetchRequestAdapter,
  HttpClient,
} from '@microsoft/kiota-http-fetchlibrary';
import { DynamicModule } from '@nestjs/common';
import { FAKE_API_KIOTA_SERVICE_TOKEN } from './fake-api-kiota.constants.ts';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './fake-api-kiota.module-definition.ts';
import { createApiClient } from './generated/apiClient.ts';

export class FakeApiKiotaModule extends ConfigurableModuleClass {
  static register(
    { baseUrl, customFetch, ...restOptions }: typeof OPTIONS_TYPE,
  ): DynamicModule {
    const requestAdapter = new FetchRequestAdapter(
      new AnonymousAuthenticationProvider(),
      undefined,
      undefined,
      new HttpClient(customFetch || fetch),
    );
    if (baseUrl) {
      requestAdapter.baseUrl = baseUrl;
    }

    return {
      ...super.register(restOptions),
      providers: [{
        provide: FAKE_API_KIOTA_SERVICE_TOKEN,
        useValue: apiClientServiceFactory(
          createApiClient(new NestRequestAdapter(requestAdapter)),
        ),
      }],
      exports: [FAKE_API_KIOTA_SERVICE_TOKEN],
    };
  }
}
