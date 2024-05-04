import {
  ApiException,
  PostApiService,
  UserApiService,
} from '@app/fake-api-openapi-gen';
import { Injectable, NotFoundException } from '@nestjs/common';
import { type FindUserResponseDto } from './dto/find-user-response.dto.ts';

@Injectable()
export class NaiveUsersService {
  constructor(
    private readonly postApiService: PostApiService,
    private readonly userApiService: UserApiService,
  ) {}

  async findOne(id: number): Promise<FindUserResponseDto> {
    try {
      const user = await this.userApiService.getUserById({ userId: id });
      const posts = await this.postApiService.getPosts({
        userId: id,
        limit: 5,
      });

      return {
        id: user.id,
        username: user.username,
        latestPosts: posts.map((post) => ({
          id: post.id,
          title: post.title,
        })),
      };
    } catch (error) {
      if (error instanceof ApiException && error.code === 404) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
