export { type RequestAdapter } from '@microsoft/kiota-abstractions';
export * from './fake-api.constants.ts';
export * from './fake-api.module.ts';
export { type ApiClient as FakeApiService } from './generated/apiClient.ts';
export { type Post, type User } from './generated/models/index.ts';
