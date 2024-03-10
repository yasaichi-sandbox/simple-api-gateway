import { FAKE_API_SERVICE_TOKEN, type FakeApiService } from '@app/fake-api';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SimpleUsersService {
  constructor(
    @Inject(FAKE_API_SERVICE_TOKEN) private readonly apiService: FakeApiService,
  ) {}

  async findOneWithLatestPosts(id: number) {
    const user = await this.apiService.users.byUserId(id).get();
    const posts = await this.apiService.posts.get({
      queryParameters: { userId: id, limit: 5 },
    });

    return {
      id: user!.id,
      username: user!.username,
      latestPosts: posts!.map((post) => ({
        id: post.id,
        title: post.title,
      })),
    };
  }
}
