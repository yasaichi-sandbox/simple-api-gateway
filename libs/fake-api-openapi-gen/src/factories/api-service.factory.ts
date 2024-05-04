import type { Constructor } from 'type-fest';
import {
  type Configuration,
  createConfiguration,
  ServerConfiguration,
} from '../generated/index.ts';
import { FakeApiOpenapiGenModuleOptions } from '../interfaces/fake-api-openapi-gen-module-options.interface.ts';

export const apiServiceFactory =
  <T>(apiClass: Constructor<T, [Configuration]>) =>
  (
    { baseUrl }: FakeApiOpenapiGenModuleOptions,
  ) =>
    new apiClass(createConfiguration({
      baseServer: baseUrl ? new ServerConfiguration(baseUrl, {}) : undefined,
    }));
