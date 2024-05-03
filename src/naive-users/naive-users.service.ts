import { FakeApiService } from '@app/fake-api-openapi-gen';
import { Injectable } from '@nestjs/common';
import { type FindUserResponseDto } from './dto/find-user-response.dto.ts';

@Injectable()
export class NaiveUsersService {
  constructor(private readonly apiService: FakeApiService) {}

  async findOne(id: number): Promise<FindUserResponseDto> {
    const user = await this.apiService.usersUserIdGet({ userId: id });
    const posts = await this.apiService.postsGet({ userId: id, limit: 5 });

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
