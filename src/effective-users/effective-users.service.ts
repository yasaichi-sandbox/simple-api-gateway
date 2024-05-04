import {
  ApiException,
  PostApiService,
  UserApiService,
} from '@app/fake-api-openapi-gen';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Effect } from 'effect';
import { type FindUserResponseDto } from './dto/find-user-response.dto.ts';

@Injectable()
export class EffectiveUsersService {
  constructor(
    private readonly postApiService: PostApiService,
    private readonly userApiService: UserApiService,
  ) {}

  findOne(id: number): Effect.Effect<FindUserResponseDto, NotFoundException> {
    return Effect.all(
      [
        Effect
          .tryPromise(() => this.userApiService.getUserById({ userId: id }))
          .pipe(Effect.retry({
            until: (error) =>
              error instanceof ApiException && error.code === 404,
            times: 3,
          })),
        Effect
          .tryPromise(() =>
            this.postApiService.getPosts({ userId: id, limit: 5 })
          ).pipe(Effect.retry({ times: 3 })),
      ],
      { concurrency: 'unbounded' },
    ).pipe(
      Effect.catchAll(({ error }) =>
        error instanceof ApiException && error.code === 404
          ? Effect.fail(new NotFoundException(undefined, { cause: error }))
          : Effect.die(error)
      ),
      Effect.map(([user, posts]) => ({
        id: user.id,
        username: user.username,
        latestPosts: posts.map((post) => ({ id: post.id, title: post.title })),
      })),
    );
  }
}
