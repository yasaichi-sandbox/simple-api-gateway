import {
  FAKE_API_KIOTA_SERVICE_TOKEN,
  type FakeApiService,
} from '@app/fake-api-kiota';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Effect } from 'effect';

@Injectable()
export class EffectiveUsersService {
  constructor(
    @Inject(FAKE_API_KIOTA_SERVICE_TOKEN) private readonly apiService:
      FakeApiService,
  ) {}

  findOneWithLatestPosts(id: number) {
    return Effect.all([
      Effect
        .tryPromise(() => this.apiService.users.byUserId(id).get())
        .pipe(
          Effect.retry({
            until: ({ error }) =>
              error instanceof HttpException && error.getStatus() === 404,
          }),
        ),
      Effect
        .tryPromise(() =>
          this.apiService.posts.get({
            queryParameters: { userId: id, limit: 5 },
          })
        ).pipe(Effect.retry({})),
    ]).pipe(
      Effect.map(([user, posts]) => ({
        id: user!.id,
        username: user!.username,
        latestPosts: posts!.map((post) => ({ id: post.id, title: post.title })),
      })),
    );
  }
}
