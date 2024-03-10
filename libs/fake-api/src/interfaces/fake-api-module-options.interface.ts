import { type RequestAdapter } from '@microsoft/kiota-abstractions';

export interface FakeApiModuleOptions {
  baseUrl?: string;
  requestAdapter?: RequestAdapter;
}
