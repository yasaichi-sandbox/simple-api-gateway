import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Effect } from 'effect';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map((value) =>
          // NOTE: `_op` is a special key that indicates that the value is an effect
          // https://github.com/Effect-TS/effect/blob/12345bf7955d126d4f3f48b604ed1f86da744148/packages/effect/src/internal/fiberRuntime.ts#L1282
          typeof value === 'object' && '_op' in value
            ? Effect.runPromise(value)
            : value
        ),
      );
  }
}
