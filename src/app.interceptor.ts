import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Effect, identity, Match, unsafeCoerce } from 'effect';
import createError from 'http-errors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AppInterceptor.name);
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map((value) =>
          Match.value(value).pipe(
            Match.when(() => Effect.isEffect(value), async (effect) =>
              Match.value(
                await Effect.runPromiseExit<unknown, Error>(
                  unsafeCoerce(effect),
                ),
              ).pipe(
                Match.tag('Success', (success) =>
                  success.value),
                Match.tag(
                  'Failure',
                  (failure) =>
                    Match.value(failure.cause).pipe(
                      Match.tag('Fail', ({ error }) => {
                        throw error;
                      }),
                      Match.orElse((anotherFailure) => {
                        this.logger.error(anotherFailure);
                        throw createError(500);
                      }),
                    ),
                ),
                Match.exhaustive,
              )),
            Match.orElse(identity),
          )
        ),
      );
  }
}
