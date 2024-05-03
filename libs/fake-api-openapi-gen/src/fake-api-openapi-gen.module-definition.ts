import { ConfigurableModuleBuilder } from '@nestjs/common';
import { type FakeApiOpenapiGenModuleOptions } from './interfaces/fake-api-openapi-gen-module-options.interface.ts';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<FakeApiOpenapiGenModuleOptions>()
    .setExtras(
      { global: true },
      (definition, { global }) => ({ ...definition, global }),
    ).build();
