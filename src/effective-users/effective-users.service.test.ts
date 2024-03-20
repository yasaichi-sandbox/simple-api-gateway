import { FakeApiKiotaModule, type Post, type User } from '@app/fake-api-kiota';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from '@std/testing/bdd';
import { Effect, Match } from 'effect';
import fetchMock from 'fetch-mock';
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

      it('should throw `NotFoundException`', async () => {
        Match.value(
          await Effect.runPromiseExit(
            service.findOneWithLatestPosts(userId).pipe(
              Effect.withConcurrency('unbounded'),
            ),
          ),
        ).pipe(
          Match.tag('Failure', ({ cause }) =>
            Match.value(cause).pipe(
              Match.tag('Fail', ({ error }) => {
                assert.deepEqual(error.getResponse(), {
                  message: 'Not Found',
                  statusCode: 404,
                });
              }),
              Match.orElse((unexpectedCause) =>
                assert.fail(`Unexpected cause: ${unexpectedCause}`)
              ),
            )),
          Match.orElse((exit) => assert.fail(`Unexpected exit: ${exit}`)),
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
