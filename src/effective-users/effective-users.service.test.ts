import { FakeApiKiotaModule, type Post, type User } from '@app/fake-api-kiota';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from '@std/testing/bdd';
import { Effect } from 'effect';
import fetchMock from 'fetch-mock';
import createHttpError from 'http-errors';
import assert from 'node:assert';
import { EffectiveUsersService } from './effective-users.service.ts';

describe(EffectiveUsersService.name, () => {
  let service: EffectiveUsersService;

  describe(EffectiveUsersService.prototype.findOneWithLatestPosts.name, () => {
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
                .getOnce('path:/posts', posts, { query: { userId, limit: 5 } }),
            }),
          ],
          providers: [EffectiveUsersService],
        }).compile();

        service = module.get(EffectiveUsersService);
      });

      it('should throw an error equivalent to HTTP 404 error', () => {
        assert.rejects(
          Effect.runPromise(
            service.findOneWithLatestPosts(userId).pipe(
              Effect.withConcurrency('unbounded'),
            ),
          ),
          createHttpError(404),
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
                .getOnce('path:/posts', posts, { query: { userId, limit: 5 } }),
            }),
          ],
          providers: [EffectiveUsersService],
        }).compile();

        service = module.get(EffectiveUsersService);
      });

      it('should return a specified user with the latest posts', async () => {
        assert.deepStrictEqual(
          await Effect.runPromise(service.findOneWithLatestPosts(userId)),
          {
            id: user.id,
            username: user.username,
            latestPosts: [{ id: posts[0].id, title: posts[0].title }],
          },
        );
      });
    });
  });
});
