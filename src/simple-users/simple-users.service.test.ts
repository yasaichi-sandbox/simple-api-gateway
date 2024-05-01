import { FakeApiKiotaModule, type Post, type User } from '@app/fake-api-kiota';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from '@std/testing/bdd';
import fetchMock from 'fetch-mock';
import assert from 'node:assert';
import { SimpleUsersService } from './simple-users.service.ts';

describe(SimpleUsersService.name, () => {
  let service: SimpleUsersService;

  describe(
    SimpleUsersService.prototype.findOneWithLatestPosts.name,
    () => {
      const userId = 42;
      const user: User = {
        id: userId,
        name: 'Foo Bar',
        username: 'foobar',
        email: 'foo.bar@example.com',
      };
      const posts: Post[] = [{
        id: 1,
        userId,
        title: 'post 1 title',
        body: 'post 1 body',
      }];

      describe('when the user is not found', () => {
        beforeEach(async () => {
          const module: TestingModule = await Test.createTestingModule({
            imports: [
              FakeApiKiotaModule.register({
                customFetch: fetchMock
                  .sandbox()
                  .get(`path:/users/${userId}`, { body: {}, status: 404 })
                  .getOnce('path:/posts', posts, {
                    query: { userId, limit: 5 },
                  }),
              }),
            ],
            providers: [SimpleUsersService],
          }).compile();

          service = module.get(SimpleUsersService);
        });

        it('should throw `HttpException` being serialized into an empty JSON response with 404 status', () => {
          assert.rejects(
            () => service.findOneWithLatestPosts(userId),
            (err) =>
              err instanceof HttpException && err.getStatus() === 404 &&
              JSON.stringify(err.getResponse()) === '{}',
          );
        });
      });

      describe('when the user is found', () => {
        beforeEach(async () => {
          const module: TestingModule = await Test.createTestingModule({
            imports: [
              FakeApiKiotaModule.register({
                customFetch: fetchMock
                  .sandbox()
                  .get(`path:/users/${userId}`, user)
                  .getOnce('path:/posts', posts, {
                    query: { userId, limit: 5 },
                  }),
              }),
            ],
            providers: [SimpleUsersService],
          }).compile();

          service = module.get(SimpleUsersService);
        });

        it('should return a specified user with the latest posts', async () => {
          assert.deepStrictEqual(
            await service.findOneWithLatestPosts(userId),
            {
              id: user.id,
              username: user.username,
              latestPosts: [{ id: posts[0].id, title: posts[0].title }],
            },
          );
        });
      });
    },
  );
});
