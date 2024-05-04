import {
  ApiException,
  PostApiService,
  UserApiService,
} from '@app/fake-api-openapi-gen';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Effect } from 'effect';
import { type FindUserResponseDto } from './dto/find-user-response.dto.ts';

@Injectable()
export class RealworldUsersService {
  constructor(
    private readonly postApiService: PostApiService,
    private readonly userApiService: UserApiService,
  ) {}

  findOne(id: number): Effect.Effect<FindUserResponseDto, NotFoundException> {
    return Effect.gen(this, function* () {
      const [user, posts] = yield* Effect.all(
        [
          Effect.retry(
            Effect.tryPromise(() =>
              this.userApiService.getUserById({ userId: id })
            ),
            {
              until: (error) =>
                error instanceof ApiException && error.code === 404,
              times: 3,
            },
          ),
          Effect.retry(
            Effect.tryPromise(() =>
              this.postApiService.getPosts({ userId: id, limit: 5 })
            ),
            { times: 3 },
          ),
        ],
        { concurrency: 'unbounded' },
      );

      return {
        id: user.id,
        username: user.username,
        latestPosts: posts.map((post) => ({
          id: post.id,
          title: post.title,
        })),
      };
    }).pipe(
      Effect.catchAll(({ error }) =>
        error instanceof ApiException && error.code === 404
          ? Effect.fail(
            new NotFoundException('User not found', { cause: error }),
          )
          : Effect.die(error)
      ),
    );
  }
}
