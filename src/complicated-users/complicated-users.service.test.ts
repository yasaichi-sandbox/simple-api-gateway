import {
  FakeApiOpenapiGenModule,
  type Post,
  type User,
} from '@app/fake-api-openapi-gen';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';
import fetchMock from 'fetch-mock';
import assert from 'node:assert';
import { ComplicatedUsersService } from './complicated-users.service.ts';

describe(ComplicatedUsersService.name, () => {
  let service: ComplicatedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FakeApiOpenapiGenModule.register({})],
      providers: [ComplicatedUsersService],
    }).compile();

    service = module.get(ComplicatedUsersService);
  });

  describe(
    ComplicatedUsersService.prototype.findOne.name,
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

      afterEach(() => {
        fetchMock.restore();
      });

      describe('when the user is not found', () => {
        beforeEach(() => {
          fetchMock
            .get(`path:/users/${userId}`, { body: {}, status: 404 })
            .getOnce('path:/posts', posts, { query: { userId, limit: 5 } });
        });

        it('should throw `NotFoundException`', () => {
          assert.rejects(
            () => service.findOne(userId),
            (err) => err instanceof NotFoundException,
          );
        });
      });

      describe('when the user is found', () => {
        beforeEach(() => {
          fetchMock
            .get(`path:/users/${userId}`, user)
            .getOnce('path:/posts', posts, { query: { userId, limit: 5 } });
        });

        it('should return a specified user with the latest posts', async () => {
          assert.deepStrictEqual(
            await service.findOne(userId),
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
