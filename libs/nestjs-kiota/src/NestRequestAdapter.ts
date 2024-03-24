import {
  type AdditionalDataHolder,
  type ApiError,
  type BackingStoreFactory,
  DefaultApiError,
  type ErrorMappings,
  type Parsable,
  type ParsableFactory,
  type PrimitiveTypesForDeserialization,
  type PrimitiveTypesForDeserializationType,
  type RequestAdapter,
  type RequestInformation,
} from '@microsoft/kiota-abstractions';
import { HttpException } from '@nestjs/common';
import { Data, identity, Match, Predicate } from 'effect';
import type { SetNonNullable } from 'type-fest';

// NOTE: Deserialized and thrown error actually has only `additionalData`, `responseHeaders`,
// `responseStatusCode`, and the response body. For further details, see the following lines:
// https://github.com/microsoft/kiota-typescript/blob/5ce4f291d27a8142a6df0716a38e06a765fb6563/packages/http/fetch/src/fetchRequestAdapter.ts#L343-L357
export type DeserializedApiError =
  & AdditionalDataHolder
  & SetNonNullable<Pick<ApiError, 'responseHeaders' | 'responseStatusCode'>>
  & Record<string, unknown>;

export class NestRequestAdapter implements RequestAdapter {
  constructor(private readonly requestAdapter: RequestAdapter) {}

  get baseUrl() {
    return this.requestAdapter.baseUrl;
  }

  set baseUrl(value: string) {
    this.requestAdapter.baseUrl = value;
  }

  getSerializationWriterFactory() {
    return this.requestAdapter.getSerializationWriterFactory();
  }

  send<ModelType extends Parsable>(
    requestInfo: RequestInformation,
    type: ParsableFactory<ModelType>,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.send<ModelType>(
        requestInfo,
        type,
        errorMappings,
      )
    );
  }

  sendPrimitive<
    ResponseType extends PrimitiveTypesForDeserializationType,
  >(
    requestInfo: RequestInformation,
    responseType: PrimitiveTypesForDeserialization,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.sendPrimitive<ResponseType>(
        requestInfo,
        responseType,
        errorMappings,
      )
    );
  }

  sendCollection<ModelType extends Parsable>(
    requestInfo: RequestInformation,
    type: ParsableFactory<ModelType>,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.sendCollection<ModelType>(
        requestInfo,
        type,
        errorMappings,
      )
    );
  }

  sendCollectionOfPrimitive<
    ResponseType extends Exclude<
      PrimitiveTypesForDeserializationType,
      ArrayBuffer
    >,
  >(
    requestInfo: RequestInformation,
    responseType: Exclude<PrimitiveTypesForDeserialization, 'ArrayBuffer'>,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.sendCollectionOfPrimitive<ResponseType>(
        requestInfo,
        responseType,
        errorMappings,
      )
    );
  }

  sendNoResponseContent(
    requestInfo: RequestInformation,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.sendNoResponseContent(
        requestInfo,
        errorMappings,
      )
    );
  }

  sendEnum<EnumObject extends Record<string, unknown>>(
    requestInfo: RequestInformation,
    enumObject: EnumObject,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.sendEnum(
        requestInfo,
        enumObject,
        errorMappings,
      )
    );
  }

  sendCollectionOfEnum<EnumObject extends Record<string, unknown>>(
    requestInfo: RequestInformation,
    enumObject: EnumObject,
    errorMappings: ErrorMappings | undefined,
  ) {
    return this.catchApiError(() =>
      this.requestAdapter.sendCollectionOfEnum(
        requestInfo,
        enumObject,
        errorMappings,
      )
    );
  }

  enableBackingStore(
    backingStoreFactory?: BackingStoreFactory | undefined,
  ) {
    this.requestAdapter.enableBackingStore(backingStoreFactory);
  }

  convertToNativeRequest<T>(requestInfo: RequestInformation) {
    return this.requestAdapter.convertToNativeRequest<T>(requestInfo);
  }

  private async catchApiError<T>(send: () => Promise<T>): Promise<T> {
    try {
      return await send();
    } catch (error) {
      throw Match.value(error).pipe(
        Match.when(
          this.isApiError,
          (apiError) => this.convertToNestHttpException(apiError),
        ),
        Match.orElse(identity),
      );
    }
  }

  private convertToNestHttpException(apiError: DeserializedApiError) {
    const [response, status] = Match.value(apiError).pipe(
      Match.when(
        Match.instanceOf(DefaultApiError),
        ({ message, responseStatusCode }) =>
          Data.tuple(message, responseStatusCode!),
      ),
      Match.orElse(
        (
          {
            additionalData: _additionalData,
            responseHeaders: _responseHeaders,
            responseStatusCode,
            ...responseBody
          },
        ) => Data.tuple(responseBody, responseStatusCode),
      ),
    );

    return new HttpException(response, status, { cause: apiError });
  }

  private isApiError(input: unknown): input is DeserializedApiError {
    return Predicate.isRecord(input) &&
      Predicate.hasProperty(input, 'responseHeaders') &&
      Predicate.isRecord(input.responseHeaders) &&
      Predicate.hasProperty(input, 'responseStatusCode') &&
      Predicate.isNumber(input.responseStatusCode);
  }
}
