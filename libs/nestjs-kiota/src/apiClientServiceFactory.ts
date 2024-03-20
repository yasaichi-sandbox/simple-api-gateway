// See: https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-events-1
const nestLifecycleHooks: string[] = [
  'onModuleInit',
  'onApplicationBootstrap',
  'onModuleDestroy',
  'beforeApplicationShutdown',
  'onApplicationShutdown',
];

const servicePropsCalledByNest = new Set([
  'then',
  ...nestLifecycleHooks,
]);

// NOTE: This is a workaround to use the API client with NestJS dependency injection mechanism.
// For further details, please refer to the following comment:
// https://github.com/microsoft/kiota-typescript/issues/1075#issuecomment-1987042257
export const apiClientServiceFactory = <T extends object>(apiClient: T): T =>
  new Proxy<T>(
    apiClient,
    {
      get: (target, prop) =>
        servicePropsCalledByNest.has(prop.toString())
          ? undefined
          : Reflect.get(target, prop),
    },
  );
