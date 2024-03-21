import {
  FAKE_API_KIOTA_SERVICE_TOKEN,
  type FakeApiService,
} from '@app/fake-api-kiota';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Data, Effect, Either, Match, Schedule } from 'effect';

@Injectable()
export class EffectiveUsersService {
  constructor(
    @Inject(FAKE_API_KIOTA_SERVICE_TOKEN) private readonly apiService:
      FakeApiService,
  ) {}

  findOneWithLatestPosts(id: number) {
    return Effect.all(
      [
        Effect.retry(
          Effect.tryPromise(() => this.apiService.users.byUserId(id).get()),
          {
            schedule: Schedule.exponential('100 millis'),
            times: 3,
            until: ({ error }) =>
              Match.value(error).pipe(
                Match.when(
                  Match.instanceOf(HttpException),
                  (httpException) => httpException.getStatus() === 404,
                ),
                Match.orElse(() => false),
              ),
          },
        ),
        Effect.retry(
          Effect.tryPromise(() =>
            this.apiService.posts.get({
              queryParameters: { userId: id, limit: 5 },
            })
          ),
          { schedule: Schedule.exponential('100 millis'), times: 3 },
        ),
      ],
      { concurrency: 'inherit' },
    ).pipe(
      Effect.flatMap(([user, posts]) =>
        !user || !posts
          ? Effect.die('Something went wrong!')
          : Effect.succeed(Data.tuple(user, posts))
      ),
      Effect.map(([user, posts]) => ({
        id: user.id,
        username: user.username,
        latestPosts: posts.map((post) => ({ id: post.id, title: post.title })),
      })),
      Effect.catchAll(({ error }) =>
        Match.value(error).pipe(
          Match.when(
            () => error instanceof HttpException && error.getStatus() === 404,
            () => Effect.fail(new NotFoundException()),
          ),
          Match.orElse((unexpectedError) => Effect.die(unexpectedError)),
        )
      ),
    );
  }

  findOneWithLatestPostsGen(id: number) {
    return Effect.gen(this, function* (_) {
      const data = yield* _(Effect.either(
        Effect.all([
          Effect.retry(
            Effect.tryPromise(() => this.apiService.users.byUserId(id).get()),
            {
              schedule: Schedule.exponential('100 millis'),
              times: 3,
              until: ({ error }) =>
                Match.value(error).pipe(
                  Match.when(
                    Match.instanceOf(HttpException),
                    (httpException) => httpException.getStatus() === 404,
                  ),
                  Match.orElse(() => false),
                ),
            },
          ),
          Effect.retry(
            Effect.tryPromise(() =>
              this.apiService.posts.get({
                queryParameters: { userId: id, limit: 5 },
              })
            ),
            { schedule: Schedule.exponential('100 millis'), times: 3 },
          ),
        ]),
      ));

      if (Either.isLeft(data)) {
        return yield* _(
          Match.value(data.left).pipe(
            Match.when(
              ({ error }) =>
                error instanceof HttpException && error.getStatus() === 404,
              () => Effect.fail(new NotFoundException()),
            ),
            Match.orElse((unexpectedError) => Effect.die(unexpectedError)),
          ),
        );
      }

      const [user, posts] = data.right;
      if (!user || !posts) {
        return yield* _(Effect.die('Something went wrong!'));
      }

      return {
        id: user.id,
        username: user.username,
        latestPosts: posts.map((post) => ({ id: post.id, title: post.title })),
      };
    });
  }
}
