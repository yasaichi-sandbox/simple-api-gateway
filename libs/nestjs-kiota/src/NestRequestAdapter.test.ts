import {
  AnonymousAuthenticationProvider,
  DefaultApiError,
  HttpMethod,
  type RequestAdapter,
  RequestInformation,
} from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { HttpException } from '@nestjs/common';
import { beforeEach, describe, it } from '@std/testing/bdd';
import assert from 'node:assert';
import { fake, type SinonStubbedInstance, stub } from 'sinon';
import {
  type DeserializedApiError,
  NestRequestAdapter,
} from './NestRequestAdapter.ts';

describe(NestRequestAdapter.name, () => {
  let requestAdapter: SinonStubbedInstance<RequestAdapter>;
  let nestRequestAdapter: NestRequestAdapter;

  const apiError: DeserializedApiError = {
    additionalData: {},
    responseHeaders: {},
    responseStatusCode: 404,
    foo: 42,
  };
  const defaultApiError = new DefaultApiError('unexpected error type');
  defaultApiError.responseStatusCode = 401;

  beforeEach(() => {
    // TODO: Stop using FetchRequestAdapter
    requestAdapter = stub(
      new FetchRequestAdapter(new AnonymousAuthenticationProvider()),
    );
    nestRequestAdapter = new NestRequestAdapter(requestAdapter);
  });

  describe('baseUrl', () => {
    const baseUrl = 'https://example.com';

    describe('getter', () => {
      it('should return the same value as the wrapped adapter has', () => {
        requestAdapter.baseUrl = baseUrl;
        assert.strictEqual(nestRequestAdapter.baseUrl, baseUrl);
      });
    });

    describe('setter', () => {
      it('should change the value of the wrapped adapter', () => {
        nestRequestAdapter.baseUrl = baseUrl;
        assert.strictEqual(requestAdapter.baseUrl, baseUrl);
      });
    });
  });

  describe('send', () => {
    const responseModel = { foo: 42 };
    const args = [
      new RequestInformation(HttpMethod.GET),
      fake(),
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.send.returns(Promise.resolve(responseModel));
      });

      it('should return a response model the wrapped method returns', async () => {
        assert.deepEqual(await nestRequestAdapter.send(...args), responseModel);
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.send.throwsException(apiError);
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.send(...args),
          (error) => {
            assert(requestAdapter.send.calledOnceWith(...args));

            assert(error instanceof HttpException);
            assert.strictEqual(error.getStatus(), apiError.responseStatusCode);
            assert.deepEqual(error.getResponse(), { foo: apiError.foo });

            return true;
          },
        );
      });
    });
  });

  describe(NestRequestAdapter.prototype.sendPrimitive.name, () => {
    const primitiveResponseModel = 42;
    const args = [
      new RequestInformation(HttpMethod.GET),
      'number',
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.sendPrimitive.returns(
          Promise.resolve(primitiveResponseModel),
        );
      });

      it('should return a primitive response model the wrapped method returns', async () => {
        assert.strictEqual(
          await nestRequestAdapter.sendPrimitive(...args),
          primitiveResponseModel,
        );
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.sendPrimitive.throwsException(defaultApiError);
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.sendPrimitive(...args),
          (error) => {
            assert(requestAdapter.sendPrimitive.calledOnceWith(...args));

            assert(error instanceof HttpException);
            assert.strictEqual(
              error.getStatus(),
              defaultApiError.responseStatusCode,
            );
            assert.deepEqual(error.getResponse(), defaultApiError.message);

            return true;
          },
        );
      });
    });
  });

  describe(NestRequestAdapter.prototype.sendCollection.name, () => {
    const responseModel = { foo: 42 };
    const args = [
      new RequestInformation(HttpMethod.GET),
      fake(),
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.sendCollection.returns(Promise.resolve([responseModel]));
      });

      it('should return a response model collection the wrapped method returns', async () => {
        assert.deepEqual(
          await nestRequestAdapter.sendCollection(...args),
          [responseModel],
        );
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.sendCollection.throwsException(apiError);
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.sendCollection(...args),
          (error) => {
            assert(requestAdapter.sendCollection.calledOnceWith(...args));

            assert(error instanceof HttpException);
            assert.strictEqual(error.getStatus(), apiError.responseStatusCode);
            assert.deepEqual(error.getResponse(), { foo: apiError.foo });

            return true;
          },
        );
      });
    });
  });

  describe(NestRequestAdapter.prototype.sendCollectionOfPrimitive.name, () => {
    const primitiveResponseModel = 42;
    const args = [
      new RequestInformation(HttpMethod.GET),
      'number',
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.sendCollectionOfPrimitive.returns(
          Promise.resolve([primitiveResponseModel]),
        );
      });

      it('should return a primitive response model the wrapped method returns', async () => {
        assert.deepEqual(
          await nestRequestAdapter.sendCollectionOfPrimitive(...args),
          [primitiveResponseModel],
        );
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.sendCollectionOfPrimitive.throwsException(
          defaultApiError,
        );
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.sendCollectionOfPrimitive(...args),
          (error) => {
            assert(
              requestAdapter.sendCollectionOfPrimitive.calledOnceWith(...args),
            );

            assert(error instanceof HttpException);
            assert.strictEqual(
              error.getStatus(),
              defaultApiError.responseStatusCode,
            );
            assert.deepEqual(error.getResponse(), defaultApiError.message);

            return true;
          },
        );
      });
    });
  });

  describe(NestRequestAdapter.prototype.sendNoResponseContent.name, () => {
    const args = [
      new RequestInformation(HttpMethod.DELETE),
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.sendNoResponseContent.returns(Promise.resolve());
      });

      it('should return nothing', async () => {
        assert.strictEqual(
          await nestRequestAdapter.sendNoResponseContent(...args),
          undefined,
        );
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.sendNoResponseContent.throwsException(apiError);
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.sendNoResponseContent(...args),
          (error) => {
            assert(
              requestAdapter.sendNoResponseContent.calledOnceWith(...args),
            );

            assert(error instanceof HttpException);
            assert.strictEqual(error.getStatus(), apiError.responseStatusCode);
            assert.deepEqual(error.getResponse(), { foo: apiError.foo });

            return true;
          },
        );
      });
    });
  });

  describe(NestRequestAdapter.prototype.sendEnum.name, () => {
    const responseModel = { foo: 42 };
    const args = [
      new RequestInformation(HttpMethod.GET),
      responseModel,
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.sendEnum.returns(Promise.resolve(responseModel.foo));
      });

      it('should return a response model the wrapped method returns', async () => {
        assert.strictEqual(
          await nestRequestAdapter.sendEnum(...args),
          responseModel.foo,
        );
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.sendEnum.throwsException(defaultApiError);
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.sendEnum(...args),
          (error) => {
            assert(
              requestAdapter.sendEnum.calledOnceWith(...args),
            );

            assert(error instanceof HttpException);
            assert.strictEqual(
              error.getStatus(),
              defaultApiError.responseStatusCode,
            );
            assert.deepEqual(error.getResponse(), defaultApiError.message);

            return true;
          },
        );
      });
    });
  });

  describe(NestRequestAdapter.prototype.sendCollectionOfEnum.name, () => {
    const responseModel = { foo: 42 };
    const args = [
      new RequestInformation(HttpMethod.GET),
      responseModel,
      undefined,
    ] as const;

    describe('when the wrapped method call succeeds', () => {
      beforeEach(() => {
        requestAdapter.sendCollectionOfEnum.returns(
          Promise.resolve([responseModel.foo]),
        );
      });

      it('should return a response model collection the wrapped method returns', async () => {
        assert.deepEqual(
          await nestRequestAdapter.sendCollectionOfEnum(...args),
          [responseModel.foo],
        );
      });
    });

    describe('when the wrapped method call fails', () => {
      beforeEach(() => {
        requestAdapter.sendCollectionOfEnum.throwsException(apiError);
      });

      it('should throw `HttpException`', () => {
        assert.rejects(
          nestRequestAdapter.sendCollectionOfEnum(...args),
          (error) => {
            assert(
              requestAdapter.sendCollectionOfEnum.calledOnceWith(...args),
            );

            assert(error instanceof HttpException);
            assert.strictEqual(error.getStatus(), apiError.responseStatusCode);
            assert.deepEqual(error.getResponse(), { foo: apiError.foo });

            return true;
          },
        );
      });
    });
  });
});
