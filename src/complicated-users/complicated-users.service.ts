import {
  ApiException,
  PostApiService,
  UserApiService,
} from '@app/fake-api-openapi-gen';
import { Injectable, NotFoundException } from '@nestjs/common';
import retry, { AbortError } from 'p-retry';
import { type FindUserResponseDto } from './dto/find-user-response.dto.ts';

@Injectable()
export class ComplicatedUsersService {
  constructor(
    private readonly postApiService: PostApiService,
    private readonly userApiService: UserApiService,
  ) {}

  async findOne(id: number): Promise<FindUserResponseDto> {
    const [user, posts] = await Promise.all([
      retry(
        async () => {
          try {
            return await this.userApiService.getUserById({ userId: id });
          } catch (error) {
            if (error instanceof ApiException && error.code === 404) {
              throw new AbortError(
                new NotFoundException('User not found', { cause: error }),
              );
            }

            throw error;
          }
        },
        { retries: 3 },
      ),
      retry(
        () => this.postApiService.getPosts({ userId: id, limit: 5 }),
        { retries: 3 },
      ),
    ]);

    return {
      id: user.id,
      username: user.username,
      latestPosts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
    };
  }
}
