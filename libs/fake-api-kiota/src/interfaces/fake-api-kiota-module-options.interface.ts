import { HttpClient } from '@microsoft/kiota-http-fetchlibrary';

export interface FakeApiKiotaModuleOptions {
  baseUrl?: string;
  customFetch?: ConstructorParameters<typeof HttpClient>[0];
}
