import {
  type BackingStoreFactory,
  type ErrorMappings,
  type Parsable,
  type ParsableFactory,
  type PrimitiveTypesForDeserialization,
  type PrimitiveTypesForDeserializationType,
  type RequestAdapter,
  type RequestInformation,
} from '@microsoft/kiota-abstractions';
import { HttpException } from '@nestjs/common';
import { identity, Match } from 'effect';

type ApiError = {
  responseStatusCode: number;
  [key: string]: unknown;
};

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
          { responseStatusCode: Match.number },
          (apiError) => this.convertToNestHttpException(apiError),
        ),
        Match.orElse(identity),
      );
    }
  }

  private convertToNestHttpException(apiError: ApiError) {
    const {
      responseStatusCode,
      additionalData: _additionalData,
      responseHeaders: _responseHeaders,
      ...body
    } = apiError;

    return new HttpException(body, responseStatusCode, { cause: apiError });
  }
}
