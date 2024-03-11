import {
  FAKE_API_KIOTA_SERVICE_TOKEN,
  type FakeApiService,
} from '@app/fake-api-kiota';
import { Inject, Injectable } from '@nestjs/common';
import { Effect, identity, Match, Schedule } from 'effect';
import createError from 'http-errors';

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
                Match.when({ responseStatusCode: 404 }, () => true),
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
          : Effect.succeed([user, posts] as const)
      ),
      Effect.map(([user, posts]) => ({
        id: user.id,
        username: user.username,
        latestPosts: posts.map((post) => ({ id: post.id, title: post.title })),
      })),
      Effect.catchAll(({ error }) =>
        Effect.fail(
          Match.value(error).pipe(
            Match.when(
              { responseStatusCode: Match.number },
              ({ responseStatusCode }) => createError(responseStatusCode),
            ),
            Match.orElse(identity),
          ),
        )
      ),
    );
  }
}
