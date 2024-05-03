import { FakeApiKiotaModule, type Post, type User } from '@app/fake-api-kiota';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from '@std/testing/bdd';
import { Effect, Exit, Match } from 'effect';
import fetchMock from 'fetch-mock';
import assert from 'node:assert';
import { RealworldUsersService } from './realworld-users.service.ts';

describe(RealworldUsersService.name, () => {
  let service: RealworldUsersService;

  describe(
    RealworldUsersService.prototype.findOneWithLatestPosts.name,
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
            providers: [RealworldUsersService],
          }).compile();

          service = module.get(RealworldUsersService);
        });

        it('should throw `HttpException` being serialized into an empty JSON response with 404 status', async () => {
          Exit.match(
            await Effect.runPromiseExit(
              service.findOneWithLatestPosts(userId).pipe(
                Effect.withConcurrency('unbounded'),
              ),
            ),
            {
              onSuccess: (user) => assert.fail(`Unexpected success: ${user}`),
              onFailure: (cause) => {
                Match.value(cause).pipe(
                  Match.tag('Fail', ({ error }) => {
                    assert(error instanceof HttpException);
                    assert.strictEqual(error.getStatus(), 404);
                    assert.deepEqual(error.getResponse(), {});
                  }),
                  Match.orElse((unexpectedCause) =>
                    assert.fail(`Unexpected cause: ${unexpectedCause}`)
                  ),
                );
              },
            },
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
            providers: [RealworldUsersService],
          }).compile();

          service = module.get(RealworldUsersService);
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
    },
  );
});
