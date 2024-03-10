import { type RequestAdapter } from '@microsoft/kiota-abstractions';

export interface FakeApiKiotaModuleOptions {
  baseUrl?: string;
  requestAdapter?: RequestAdapter;
}
