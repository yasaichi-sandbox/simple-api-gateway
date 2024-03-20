import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Effect, identity, Match, unsafeCoerce } from 'effect';
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
                  ({ cause }) =>
                    Match.value(cause).pipe(
                      Match.tag('Fail', ({ error }) => {
                        throw error;
                      }),
                      Match.orElse((unexpectedCause) => {
                        this.logger.error(unexpectedCause);
                        throw new InternalServerErrorException();
                      }),
                    ),
                ),
                Match.exhaustive,
              )),
            Match.orElse(identity), // Just return the value if it's not an effect
          )
        ),
      );
  }
}
