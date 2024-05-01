import {
  FAKE_API_KIOTA_SERVICE_TOKEN,
  type FakeApiService,
} from '@app/fake-api-kiota';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import retry from 'async-retry';

@Injectable()
export class ComplicatedUsersService {
  constructor(
    @Inject(FAKE_API_KIOTA_SERVICE_TOKEN) private readonly apiService:
      FakeApiService,
  ) {}

  async findOneWithLatestPosts(id: number) {
    const [user, posts] = await Promise.all([
      retry(
        async (bail) => {
          try {
            return await this.apiService.users.byUserId(id).get();
          } catch (error) {
            if (error instanceof HttpException && error.getStatus() === 404) {
              bail(error);
              return;
            }

            throw error;
          }
        },
        { retries: 3 },
      ),
      retry(
        () =>
          this.apiService.posts.get({
            queryParameters: { userId: id, limit: 5 },
          }),
        { retries: 3 },
      ),
    ]);

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
