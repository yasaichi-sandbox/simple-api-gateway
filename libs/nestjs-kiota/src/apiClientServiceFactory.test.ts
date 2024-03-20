import { describe, it } from '@std/testing/bdd';
import assert from 'node:assert';
import { apiClientServiceFactory } from './apiClientServiceFactory.ts';

describe(apiClientServiceFactory.name, () => {
  const navigationPropertyError = new Error(
    "couldn't find navigation property",
  );
  const apiClient = {
    get then() {
      throw navigationPropertyError;
    },
    get onModuleInit() {
      throw navigationPropertyError;
    },
    get onApplicationBootstrap() {
      throw navigationPropertyError;
    },
    get onModuleDestroy() {
      throw navigationPropertyError;
    },
    get beforeApplicationShutdown() {
      throw navigationPropertyError;
    },
    get onApplicationShutdown() {
      throw navigationPropertyError;
    },
  };

  describe('when lifecycle hooks are tried to call', () => {
    it('should return `undefined` without any errors', () => {
      assert.strictEqual(
        apiClientServiceFactory(apiClient).onModuleInit,
        undefined,
      );
      assert.strictEqual(
        apiClientServiceFactory(apiClient).onApplicationBootstrap,
        undefined,
      );
      assert.strictEqual(
        apiClientServiceFactory(apiClient).onModuleDestroy,
        undefined,
      );
      assert.strictEqual(
        apiClientServiceFactory(apiClient).beforeApplicationShutdown,
        undefined,
      );
      assert.strictEqual(
        apiClientServiceFactory(apiClient).onApplicationShutdown,
        undefined,
      );
    });
  });

  describe('when `then` method is tried to call', () => {
    it('should return `undefined` without any errors', () => {
      assert.strictEqual(apiClientServiceFactory(apiClient).then, undefined);
    });
  });
});
