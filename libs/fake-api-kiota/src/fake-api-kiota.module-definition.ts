import { ConfigurableModuleBuilder } from '@nestjs/common';
import { type FakeApiKiotaModuleOptions } from './interfaces/fake-api-kiota-module-options.interface.ts';

export const { ConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<FakeApiKiotaModuleOptions>()
    .setExtras(
      { global: true },
      (definition, { global }) => ({ ...definition, global }),
    ).build();
