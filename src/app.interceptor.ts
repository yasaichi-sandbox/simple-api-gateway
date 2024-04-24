import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Effect, Exit, identity, Match, unsafeCoerce } from 'effect';
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
            Match.not(Effect.isEffect, identity), // Just return the value if it's not an effect
            Match.orElse(async (effect) =>
              Exit.match(
                await Effect.runPromiseExit<unknown, Error>(
                  unsafeCoerce(effect),
                ),
                {
                  onSuccess: (value) => value,
                  onFailure: (cause) =>
                    Match.value(cause).pipe(
                      Match.tag('Fail', ({ error }) => {
                        throw error;
                      }),
                      Match.orElse((unexpectedCause) => {
                        this.logger.error(unexpectedCause);
                        throw new InternalServerErrorException();
                      }),
                    ),
                },
              )
            ),
          )
        ),
      );
  }
}
